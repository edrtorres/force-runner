import type { ProfileSummary } from "../../domain/models.ts";

export function toPublicProfile(row: Record<string, unknown>): ProfileSummary {
  return {
    id: String(row.id),
    display_name: String(row.display_name),
    country: typeof row.country === "string" ? row.country : null,
    avatar_url: typeof row.avatar_url === "string" ? row.avatar_url : null
  };
}
