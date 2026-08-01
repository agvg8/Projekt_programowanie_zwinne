import keycloak from "../keycloak.js";

const BASE_URL = "http://localhost:8081/api/chats";

const authHeaders = () => ({
  Authorization: `Bearer ${keycloak.token}`,
  "Content-Type": "application/json"
});

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) }
  });
  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status}`);
  }
  return response.status === 204 ? null : response.json();
}

export const fetchChatConversations = () => request("/conversations");

export const fetchCurrentChatUser = () => request("/me");

export const fetchChatMessages = (conversationId) =>
  request(`/conversations/${conversationId}/messages`);

export const sendChatMessage = (conversationId, content) =>
  request(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content })
  });

export const deleteChatMessage = (messageId) =>
  request(`/messages/${messageId}`, { method: "DELETE" });

export const fetchChatUsers = (search = "") =>
  request(`/users?search=${encodeURIComponent(search)}`);

export const createChatConversation = (type, name, participantIds) =>
  request("/conversations", {
    method: "POST",
    body: JSON.stringify({ type, name, participantIds })
  });

export function connectToChatSocket(onMessage, onStatus) {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname === "localhost" ? "localhost:8081" : window.location.host;
  const socket = new WebSocket(`${protocol}://${host}/ws/chat`);
  const pendingSubscriptions = new Set();
  socket.onopen = () => {
    onStatus?.("online");
    pendingSubscriptions.forEach((conversationId) => socket.send(JSON.stringify({ action: "subscribe", conversationId })));
  };
  socket.onclose = () => onStatus?.("offline");
  socket.onerror = () => onStatus?.("offline");
  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "message") onMessage?.(payload.payload);
    } catch {
      // Ignore malformed events from a disconnected or outdated server.
    }
  };
  return {
    subscribe: (conversationId) => {
      pendingSubscriptions.add(conversationId);
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ action: "subscribe", conversationId }));
      }
    },
    close: () => socket.close()
  };
}
