import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

type Json = Record<string, unknown>;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getUserId(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const payload = token.split(".")[1];

  if (!payload) throw new Error("Token no valido");

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const parsed = JSON.parse(atob(normalized));

  if (!parsed.sub) throw new Error("Token sin usuario");
  return parsed.sub as string;
}

async function getBody(req: Request) {
  if (req.method === "GET") return {};
  try {
    return await req.json();
  } catch {
    return {};
  }
}

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

async function getFriendIds(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

  if (error) throw error;

  return (data ?? []).map((friendship) =>
    friendship.requester_id === userId ? friendship.addressee_id : friendship.requester_id
  );
}

async function assertFriend(userId: string, friendId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select("id")
    .eq("status", "accepted")
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`,
    )
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Solo puedes usar esta accion con amigos aceptados");
}

async function notifyUsers(
  recipientIds: string[],
  actorUserId: string,
  type: string,
  title: string,
  body: string,
  relatedTable?: string,
  relatedId?: string,
) {
  const rows = recipientIds
    .filter((id) => id !== actorUserId)
    .map((recipientId) => ({
      recipient_user_id: recipientId,
      actor_user_id: actorUserId,
      type,
      title,
      body,
      related_table: relatedTable ?? null,
      related_id: relatedId ?? null,
    }));

  if (rows.length === 0) return [];

  const { data, error } = await supabase.from("notifications").insert(rows).select("*");
  if (error) throw error;
  return data;
}

async function startRun(userId: string, body: Json) {
  const profile = await getProfile(userId);
  const metadata = {
    latitude: body.latitude ?? null,
    longitude: body.longitude ?? null,
  };

  const { data: activity, error } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      type: "started_running",
      title: `${profile.display_name} comenzo a correr`,
      body: "Enviale apoyo y motivacion.",
      metadata,
    })
    .select("*")
    .single();

  if (error) throw error;

  const friendIds = await getFriendIds(userId);
  const notifications = await notifyUsers(
    friendIds,
    userId,
    "friend_started_running",
    `${profile.display_name} comenzo a correr`,
    "Enviale apoyo y motivacion.",
    "activities",
    activity.id,
  );

  return { activity, notifications_created: notifications.length };
}

async function finishRun(userId: string, body: Json) {
  const profile = await getProfile(userId);
  const points = Array.isArray(body.points) ? body.points as Json[] : [];

  const { data: run, error } = await supabase
    .from("runs")
    .insert({
      user_id: userId,
      status: "saved",
      started_at: body.started_at ?? new Date(Date.now() - Number(body.duration_seconds ?? 0) * 1000).toISOString(),
      ended_at: body.ended_at ?? new Date().toISOString(),
      duration_seconds: body.duration_seconds ?? 0,
      distance_meters: body.distance_meters ?? 0,
      pace_seconds_per_km: body.pace_seconds_per_km ?? null,
      calories: body.calories ?? 0,
      mood: body.mood ?? null,
    })
    .select("*")
    .single();

  if (error) throw error;

  if (points.length > 0) {
    const rows = points.map((point, index) => ({
      run_id: run.id,
      point_order: point.point_order ?? index,
      latitude: point.latitude,
      longitude: point.longitude,
      accuracy_meters: point.accuracy_meters ?? null,
      speed_meters_second: point.speed_meters_second ?? null,
      recorded_at: point.recorded_at ?? new Date().toISOString(),
    }));

    const { error: pointsError } = await supabase.from("run_points").insert(rows);
    if (pointsError) throw pointsError;
  }

  const distanceKm = Math.round(Number(run.distance_meters) / 10) / 100;
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      run_id: run.id,
      type: "finished_run",
      title: `${profile.display_name} finalizo su carrera`,
      body: `Completo ${distanceKm} km.`,
      metadata: { distance_km: distanceKm },
    })
    .select("*")
    .single();

  if (activityError) throw activityError;

  const friendIds = await getFriendIds(userId);
  const notifications = await notifyUsers(
    friendIds,
    userId,
    "friend_finished_run",
    `${profile.display_name} finalizo una carrera`,
    `Completo ${distanceKm} km.`,
    "runs",
    run.id,
  );

  return { run, activity, points_created: points.length, notifications_created: notifications.length };
}

async function cancelRun(userId: string, body: Json) {
  const profile = await getProfile(userId);

  const { data: activity, error } = await supabase
    .from("activities")
    .insert({
      user_id: userId,
      type: "stopped_running",
      title: `${profile.display_name} dejo de correr`,
      body: String(body.reason ?? "Carrera detenida."),
      metadata: { reason: body.reason ?? null },
    })
    .select("*")
    .single();

  if (error) throw error;

  const friendIds = await getFriendIds(userId);
  const notifications = await notifyUsers(
    friendIds,
    userId,
    "friend_stopped_running",
    `${profile.display_name} dejo de correr`,
    "La actividad en vivo se detuvo.",
    "activities",
    activity.id,
  );

  return { activity, notifications_created: notifications.length };
}

async function createFriendRequest(userId: string, body: Json) {
  const addresseeId = String(body.addressee_id ?? "");
  if (!addresseeId || addresseeId === userId) throw new Error("addressee_id no valido");

  const profile = await getProfile(userId);
  const { data: friendship, error } = await supabase
    .from("friendships")
    .insert({ requester_id: userId, addressee_id: addresseeId, status: "pending" })
    .select("*")
    .single();

  if (error) throw error;

  await notifyUsers(
    [addresseeId],
    userId,
    "friend_request_received",
    "Nueva solicitud de amistad",
    `${profile.display_name} quiere agregarte como amigo.`,
    "friendships",
    friendship.id,
  );

  return { friendship };
}

async function respondFriendRequest(userId: string, body: Json) {
  const friendshipId = String(body.friendship_id ?? "");
  const status = String(body.status ?? "");

  if (!["accepted", "rejected"].includes(status)) throw new Error("status debe ser accepted o rejected");

  const { data: friendship, error } = await supabase
    .from("friendships")
    .update({
      status,
      responded_at: new Date().toISOString(),
    })
    .eq("id", friendshipId)
    .eq("addressee_id", userId)
    .eq("status", "pending")
    .select("*")
    .single();

  if (error) throw error;

  if (status === "accepted") {
    const profile = await getProfile(userId);
    await notifyUsers(
      [friendship.requester_id],
      userId,
      "friend_request_accepted",
      "Solicitud aceptada",
      `${profile.display_name} acepto tu solicitud de amistad.`,
      "friendships",
      friendship.id,
    );
  }

  return { friendship };
}

async function friendRanking(userId: string, req: Request) {
  const period = new URL(req.url).searchParams.get("period") ?? "month";
  const friendIds = await getFriendIds(userId);
  const visibleUserIds = [userId, ...friendIds];
  const source = period === "week" ? "run_statistics_weekly" : "run_statistics_monthly";

  const { data, error } = await supabase
    .from(source)
    .select("user_id, total_runs, total_distance_meters, total_duration_seconds, total_calories, avg_pace_seconds_per_km")
    .in("user_id", visibleUserIds)
    .order("total_distance_meters", { ascending: false });

  if (error) throw error;

  const profileIds = (data ?? []).map((row) => row.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, country, avatar_url")
    .in("id", profileIds.length > 0 ? profileIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const ranking = (data ?? []).map((row, index) => ({
    position: index + 1,
    ...row,
    profile: profileById.get(row.user_id) ?? null,
  }));

  return { user_id: userId, period, ranking };
}

async function sendReaction(userId: string, body: Json) {
  const targetType = String(body.target_type ?? "");
  const targetId = String(body.target_id ?? "");
  const reactionType = String(body.reaction_type ?? "");

  const { data: reaction, error } = await supabase
    .from("reactions")
    .upsert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
      reaction_type: reactionType,
    }, { onConflict: "user_id,target_type,target_id" })
    .select("*")
    .single();

  if (error) throw error;

  const ownerTable = targetType === "run" ? "runs" : "activities";
  const { data: target } = await supabase.from(ownerTable).select("user_id").eq("id", targetId).maybeSingle();

  if (target?.user_id && target.user_id !== userId) {
    const profile = await getProfile(userId);
    await notifyUsers(
      [target.user_id],
      userId,
      "reaction_received",
      `${profile.display_name} reacciono`,
      "Recibiste una reaccion en Force Runner.",
      ownerTable,
      targetId,
    );
  }

  return { reaction };
}

async function getReactions(req: Request) {
  const url = new URL(req.url);
  const targetType = url.searchParams.get("target_type");
  const targetId = url.searchParams.get("target_id");

  if (!targetType || !targetId) throw new Error("target_type y target_id son obligatorios");

  const { data: reactions, error } = await supabase
    .from("reactions")
    .select("id, user_id, target_type, target_id, reaction_type, created_at")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const userIds = [...new Set((reactions ?? []).map((reaction) => reaction.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  return { reactions: reactions ?? [], profiles: profiles ?? [] };
}

async function sendMessage(userId: string, body: Json) {
  const recipientId = String(body.recipient_user_id ?? "");
  const messageBody = String(body.body ?? "").trim();

  if (!recipientId || !messageBody) throw new Error("recipient_user_id y body son obligatorios");
  await assertFriend(userId, recipientId);

  const now = new Date().toISOString();

  const { data: existingConversation, error: existingError } = await supabase
    .from("conversations")
    .select("*")
    .or(
      `and(user_a_id.eq.${userId},user_b_id.eq.${recipientId}),and(user_a_id.eq.${recipientId},user_b_id.eq.${userId})`,
    )
    .maybeSingle();

  if (existingError) throw existingError;

  const conversationResult = existingConversation
    ? await supabase
        .from("conversations")
        .update({ last_message_at: now })
        .eq("id", existingConversation.id)
        .select("*")
        .single()
    : await supabase
        .from("conversations")
        .insert({ user_a_id: userId, user_b_id: recipientId, last_message_at: now })
        .select("*")
        .single();

  if (conversationResult.error) throw conversationResult.error;
  const conversation = conversationResult.data;

  const { data: message, error: messageError } = await supabase
    .from("messages")
    .insert({ conversation_id: conversation.id, sender_id: userId, body: messageBody })
    .select("*")
    .single();

  if (messageError) throw messageError;

  const profile = await getProfile(userId);
  await notifyUsers(
    [recipientId],
    userId,
    "chat_message_received",
    `Nuevo mensaje de ${profile.display_name}`,
    messageBody,
    "messages",
    message.id,
  );

  return { conversation, message };
}

async function notifyFriends(userId: string, body: Json) {
  const type = String(body.type ?? "");
  const title = String(body.title ?? "");
  const messageBody = String(body.body ?? "");
  const allowed = ["friend_started_running", "friend_stopped_running", "friend_finished_run", "ranking_up"];

  if (!allowed.includes(type)) throw new Error("Tipo de notificacion no permitido para notify-friends");

  const friendIds = await getFriendIds(userId);
  const notifications = await notifyUsers(
    friendIds,
    userId,
    type,
    title,
    messageBody,
    body.related_table ? String(body.related_table) : undefined,
    body.related_id ? String(body.related_id) : undefined,
  );

  return { notifications_created: notifications.length };
}

async function coachAi(userId: string, body: Json) {
  const inputType = String(body.input_type ?? "text");
  const question = String(body.question ?? "").trim();
  const caloriesGoal = body.calories_goal ?? null;

  if (!question) throw new Error("question es obligatorio");

  let answer = "Te recomiendo correr de forma progresiva, mantener hidratacion y respetar tus dias de descanso.";

  if (typeof caloriesGoal === "number") {
    answer = `Para quemar aproximadamente ${caloriesGoal} calorias, combina carrera continua con un ritmo moderado y registra tu progreso en Force Runner.`;
  } else if (question.toLowerCase().includes("cuando")) {
    answer = "Puedes correr 3 dias por semana dejando al menos un dia de descanso entre sesiones.";
  }

  const { data: coachMessage, error } = await supabase
    .from("coach_messages")
    .insert({
      user_id: userId,
      input_type: inputType,
      question,
      answer,
      calories_goal: caloriesGoal,
      metadata: { provider: "force-runner-api", mode: "local-answer" },
    })
    .select("*")
    .single();

  if (error) throw error;
  return { coach_message: coachMessage };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const userId = getUserId(req);
    const url = new URL(req.url);
    const route = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const body = await getBody(req);

    const result = await ({
      "start-run": () => startRun(userId, body),
      "finish-run": () => finishRun(userId, body),
      "cancel-run": () => cancelRun(userId, body),
      "create-friend-request": () => createFriendRequest(userId, body),
      "respond-friend-request": () => respondFriendRequest(userId, body),
      "friend-ranking": () => friendRanking(userId, req),
      "send-reaction": () => sendReaction(userId, body),
      "get-reactions": () => getReactions(req),
      "send-message": () => sendMessage(userId, body),
      "notify-friends": () => notifyFriends(userId, body),
      "coach-ai": () => coachAi(userId, body),
    } as Record<string, () => Promise<unknown>>)[route]?.();

    if (!result) return jsonResponse({ error: "Ruta no encontrada" }, 404);
    return jsonResponse({ ok: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    return jsonResponse({ ok: false, error: message }, 400);
  }
});
