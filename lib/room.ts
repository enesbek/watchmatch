import { supabase } from "./supabase";
import type { DiscoveryMode, MediaType } from "./tmdb";

export function generateRoomCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000)); // 4 haneli kod
}

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("watchmatch_guest_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("watchmatch_guest_id", id);
  }
  return id;
}

export interface CreateRoomParams {
  mediaType: MediaType;
  discoveryMode: DiscoveryMode;
  minScore: number;
}

export async function createRoom(params: CreateRoomParams) {
  const hostId = getOrCreateGuestId();
  const code = generateRoomCode();
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      code,
      host_id: hostId,
      media_type: params.mediaType,
      discovery_mode: params.discoveryMode,
      min_score: params.minScore,
      status: "waiting",
    })
    .select()
    .single();

  if (error) throw error;
  return { room: data, hostId };
}

export async function joinRoom(code: string) {
  const guestId = getOrCreateGuestId();
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !room) throw new Error("Oda bulunamadı. Kodu kontrol edin.");

  if (room.host_id !== guestId && !room.guest_id) {
    const { error: updateError } = await supabase
      .from("rooms")
      .update({ guest_id: guestId, status: "active" })
      .eq("id", room.id);
    if (updateError) throw updateError;
  }

  return { room, guestId };
}

export async function recordSwipe(params: {
  roomId: string;
  userId: string;
  mediaId: number;
  mediaType: MediaType;
  direction: "like" | "pass";
}) {
  const { error } = await supabase.from("swipes").insert({
    room_id: params.roomId,
    user_id: params.userId,
    media_id: params.mediaId,
    media_type: params.mediaType,
    direction: params.direction,
  });
  if (error) throw error;
}

/**
 * İki kullanıcı da aynı içeriği "like" yaptıysa true döner ve match kaydı oluşturur.
 */
export async function checkAndCreateMatch(params: {
  roomId: string;
  userId: string;
  otherUserId: string;
  mediaId: number;
  mediaType: MediaType;
}): Promise<boolean> {
  const { data: otherLikes, error } = await supabase
    .from("swipes")
    .select("*")
    .eq("room_id", params.roomId)
    .eq("user_id", params.otherUserId)
    .eq("media_id", params.mediaId)
    .eq("direction", "like")
    .limit(1);

  if (error) throw error;
  if (!otherLikes || otherLikes.length === 0) return false;

  const { error: matchError } = await supabase.from("matches").insert({
    room_id: params.roomId,
    user1_id: params.userId,
    user2_id: params.otherUserId,
    media_id: params.mediaId,
    media_type: params.mediaType,
  });
  if (matchError) throw matchError;
  return true;
}

export function subscribeToRoom(
  roomId: string,
  onSwipe: (payload: any) => void,
  onMatch: (payload: any) => void
) {
  const channel = supabase
    .channel(`room-${roomId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "swipes", filter: `room_id=eq.${roomId}` },
      onSwipe
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "matches", filter: `room_id=eq.${roomId}` },
      onMatch
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
