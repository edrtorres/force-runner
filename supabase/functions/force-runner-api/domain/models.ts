export interface ProfileSummary {
  id: string;
  display_name: string;
  country: string | null;
  avatar_url: string | null;
}

export interface Profile extends ProfileSummary {
  full_name: string;
}

export interface Run {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  distance_meters: number;
  pace_seconds_per_km: number | null;
  calories: number;
  mood: string | null;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "rejected" | "deleted";
  requested_at: string;
  responded_at: string | null;
}

export interface Conversation {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
  deleted_at: string | null;
}

export interface Notification {
  id: string;
  recipient_user_id: string;
  actor_user_id: string | null;
  type: string;
  title: string;
  body: string;
  related_table: string | null;
  related_id: string | null;
  read_at: string | null;
  created_at: string;
}

export interface RunStatistics {
  user_id: string;
  total_runs: number;
  total_distance_meters: number;
  total_duration_seconds: number;
  total_calories: number;
  avg_pace_seconds_per_km: number | null;
}
