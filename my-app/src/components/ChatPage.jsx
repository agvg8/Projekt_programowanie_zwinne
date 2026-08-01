import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowLeft, FiCheck, FiEdit3, FiHash, FiMessageCircle,
  FiMoreHorizontal, FiPaperclip, FiPlus, FiSearch, FiSend, FiSmile,
  FiTrash2, FiUsers, FiWifi, FiX
} from "react-icons/fi";
import {
  connectToChatSocket,
  createChatConversation,
  deleteChatMessage,
  fetchChatConversations,
  fetchChatMessages,
  fetchChatUsers,
  sendChatMessage
} from "../api/chatApi";
import "./ChatPage.css";

const demoUsers = [
  { id: "you", firstName: "Alex", lastName: "Morgan", email: "alex.morgan@acme.io", online: true },
  { id: "maya", firstName: "Maya", lastName: "Chen", email: "maya.chen@acme.io", online: true },
  { id: "noah", firstName: "Noah", lastName: "Williams", email: "noah.williams@acme.io", online: false },
  { id: "sofia", firstName: "Sofia", lastName: "Kowalski", email: "sofia.kowalski@acme.io", online: true },
  { id: "luca", firstName: "Luca", lastName: "Rossi", email: "luca.rossi@acme.io", online: false }
];

const demoConversations = [
  {
    id: "maya",
    type: "DIRECT",
    name: "Maya Chen",
    participants: [demoUsers[0], demoUsers[1]],
    unread: 2,
    messages: [
      { id: "m1", senderId: "maya", senderName: "Maya Chen", content: "Hej Alex! Masz chwilę, żeby zerknąć na flow onboardingu?", sentAt: "2026-08-01T09:32:00Z" },
      { id: "m2", senderId: "you", senderName: "Alex Morgan", content: "Jasne — właśnie kończę. Podeślę Ci komentarze za 15 min.", sentAt: "2026-08-01T09:35:00Z" },
      { id: "m3", senderId: "maya", senderName: "Maya Chen", content: "Super, dzięki! ✨", sentAt: "2026-08-01T09:36:00Z" }
    ]
  },
  {
    id: "design",
    type: "GROUP",
    name: "Design squad",
    participants: [demoUsers[0], demoUsers[1], demoUsers[3], demoUsers[4]],
    unread: 0,
    messages: [
      { id: "d1", senderId: "sofia", senderName: "Sofia Kowalski", content: "Dodałam nową wersję komponentu Button do Figmy.", sentAt: "2026-07-31T14:20:00Z" },
      { id: "d2", senderId: "luca", senderName: "Luca Rossi", content: "Wygląda świetnie. Sprawdzę jeszcze stany focus i disabled.", sentAt: "2026-07-31T14:24:00Z" },
      { id: "d3", senderId: "you", senderName: "Alex Morgan", content: "Idealnie, dzięki za szybką iterację.", sentAt: "2026-07-31T14:31:00Z" }
    ]
  },
  {
    id: "noah",
    type: "DIRECT",
    name: "Noah Williams",
    participants: [demoUsers[0], demoUsers[2]],
    unread: 0,
    messages: [
      { id: "n1", senderId: "you", senderName: "Alex Morgan", content: "Hej Noah, czy API jest już gotowe do testów?", sentAt: "2026-07-30T11:12:00Z" }
    ]
  }
];

function initials(person) {
  return `${person?.firstName?.[0] || "?"}${person?.lastName?.[0] || ""}`.toUpperCase();
}

function formatTime(date) {
  return new Intl.DateTimeFormat("pl-PL", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

function formatDay(date) {
  const day = new Date(date);
  const today = new Date();
  if (day.toDateString() === today.toDateString()) return "Dzisiaj";
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long" }).format(day);
}

function normalizeConversation(item) {
  const participants = (item.participants || []).map((person) => ({
    ...person,
    id: String(person.id),
    name: `${person.firstName} ${person.lastName}`
  }));
  const other = participants.find((person) => person.id !== "you") || participants[0];
  return { ...item, id: String(item.id), participants, name: item.name || other?.name || "Nowa rozmowa", messages: [] };
}

function Avatar({ person, large = false }) {
  return <div className={`chat-avatar ${large ? "chat-avatar-large" : ""}`}>{initials(person)}</div>;
}

function NewConversationModal({ users, onClose, onCreate }) {
  const [type, setType] = useState("DIRECT");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const availableUsers = users.filter((user) => user.id !== "you");

  const toggleUser = (id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const canCreate = type === "DIRECT" ? selected.length === 1 : selected.length > 0 && name.trim();

  return (
    <div className="chat-modal-overlay" onMouseDown={onClose}>
      <div className="chat-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="chat-modal-header">
          <div><span className="eyebrow">NOWA ROZMOWA</span><h2>Połącz się z zespołem</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="Zamknij"><FiX /></button>
        </div>
        <div className="chat-type-switcher">
          <button className={type === "DIRECT" ? "active" : ""} onClick={() => setType("DIRECT")}><FiMessageCircle /> Prywatna</button>
          <button className={type === "GROUP" ? "active" : ""} onClick={() => setType("GROUP")}><FiUsers /> Grupa</button>
        </div>
        {type === "GROUP" && <label className="chat-field"><span>Nazwa grupy</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="np. Launch crew" autoFocus /></label>}
        <div className="chat-member-picker">
          <span className="chat-field-label">Wybierz osoby</span>
          {availableUsers.map((user) => <button key={user.id} className={`chat-member-option ${selected.includes(user.id) ? "selected" : ""}`} onClick={() => toggleUser(user.id)}><Avatar person={user} /><span><strong>{user.firstName} {user.lastName}</strong><small>{user.email}</small></span><span className="selection-check">{selected.includes(user.id) && <FiCheck />}</span></button>)}
        </div>
        <div className="chat-modal-actions"><button className="chat-secondary-button" onClick={onClose}>Anuluj</button><button className="chat-primary-button" disabled={!canCreate} onClick={() => onCreate({ type, name, selected })}><FiPlus /> Utwórz rozmowę</button></div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [conversations, setConversations] = useState(demoConversations);
  const [users, setUsers] = useState(demoUsers);
  const [activeId, setActiveId] = useState("maya");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [isMobileList, setIsMobileList] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const activeConversation = conversations.find((conversation) => conversation.id === activeId) || conversations[0];
  const currentUser = demoUsers[0];
  const visibleConversations = useMemo(() => conversations.filter((conversation) => conversation.name.toLowerCase().includes(search.toLowerCase())), [conversations, search]);
  const activePerson = activeConversation?.participants.find((person) => person.id !== "you") || activeConversation?.participants[0];
  const activeConversationId = activeConversation?.id;

  useEffect(() => {
    fetchChatConversations().then((data) => {
      if (Array.isArray(data) && data.length) {
        const normalized = data.map(normalizeConversation);
        setConversations(normalized);
        setActiveId(normalized[0].id);
      }
    }).catch(() => {});
    fetchChatUsers().then((data) => { if (Array.isArray(data) && data.length) setUsers(data.map((user) => ({ ...user, id: String(user.id) }))); }).catch(() => {});
    socketRef.current = connectToChatSocket((incoming) => {
      const next = { ...incoming, id: String(incoming.id), senderId: String(incoming.senderId), senderName: incoming.senderName };
      setConversations((items) => items.map((conversation) => {
        if (conversation.id !== String(incoming.conversationId)) return conversation;
        const hasMessage = conversation.messages.some((item) => String(item.id) === String(next.id));
        return { ...conversation, messages: hasMessage ? conversation.messages.map((item) => String(item.id) === String(next.id) ? { ...item, ...next } : item) : [...conversation.messages, next] };
      }));
    }, setSocketStatus);
    return () => socketRef.current?.close();
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (/^\d+$/.test(activeConversationId)) {
      fetchChatMessages(activeConversationId).then((data) => setConversations((items) => items.map((conversation) => conversation.id === activeConversationId ? { ...conversation, messages: data } : conversation))).catch(() => {});
      const timer = setTimeout(() => socketRef.current?.subscribe(Number(activeConversationId)), 200);
      return () => clearTimeout(timer);
    }
  }, [activeId, activeConversationId]);

  const selectConversation = (id) => {
    setActiveId(id);
    setConversations((items) => items.map((item) => item.id === id ? { ...item, unread: 0 } : item));
    setIsMobileList(false);
  };

  const addMessage = async (event) => {
    event.preventDefault();
    const content = message.trim();
    if (!content || !activeConversation) return;
    setMessage("");
    if (/^\d+$/.test(activeConversation.id)) {
      try {
        const sent = await sendChatMessage(activeConversation.id, content);
        setConversations((items) => items.map((conversation) => conversation.id === activeConversation.id && !conversation.messages.some((item) => String(item.id) === String(sent.id)) ? { ...conversation, messages: [...conversation.messages, sent] } : conversation));
      } catch { setMessage(content); }
      return;
    }
    const optimistic = { id: `local-${Date.now()}`, senderId: currentUser.id, senderName: `${currentUser.firstName} ${currentUser.lastName}`, content, sentAt: new Date().toISOString() };
    setConversations((items) => items.map((conversation) => conversation.id === activeConversation.id ? { ...conversation, messages: [...conversation.messages, optimistic] } : conversation));
  };

  const deleteMessage = async (messageItem) => {
    if (String(messageItem.id).match(/^\d+$/)) await deleteChatMessage(messageItem.id).catch(() => {});
    setConversations((items) => items.map((conversation) => conversation.id === activeConversation.id ? { ...conversation, messages: conversation.messages.map((item) => item.id === messageItem.id ? { ...item, content: "", deleted: true } : item) } : conversation));
  };

  const createConversation = async ({ type, name, selected }) => {
    const picked = users.filter((user) => selected.includes(user.id));
    try {
      const created = await createChatConversation(type, name, picked.map((user) => Number(user.id)));
      const normalized = { ...normalizeConversation(created), messages: [] };
      setConversations((items) => [normalized, ...items]);
      setActiveId(normalized.id);
    } catch {
      const local = { id: `local-${Date.now()}`, type, name: type === "GROUP" ? name : picked[0]?.name || `${picked[0]?.firstName} ${picked[0]?.lastName}`, participants: [currentUser, ...picked], messages: [], unread: 0 };
      setConversations((items) => [local, ...items]);
      setActiveId(local.id);
    }
    setShowNew(false);
  };

  return (
    <section className="chat-page">
      <div className="chat-page-heading"><div><span className="eyebrow">WORKSPACE / MESSAGES</span><h1>Twoje rozmowy</h1><p>Rozmawiaj z zespołem. Wszystko ważne, w jednym miejscu.</p></div><button className="chat-primary-button heading-action" onClick={() => setShowNew(true)}><FiEdit3 /> Nowa rozmowa</button></div>
      <div className={`chat-shell ${isMobileList ? "mobile-list-open" : ""}`}>
        <aside className="chat-conversation-list">
          <div className="chat-list-header"><div><span className="chat-section-label">WIADOMOŚCI</span><strong>{conversations.length} rozmowy</strong></div><button className="icon-button soft" onClick={() => setShowNew(true)} aria-label="Nowa rozmowa"><FiPlus /></button></div>
          <div className="chat-search"><FiSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Szukaj rozmowy..." /></div>
          <div className="chat-filters"><button className="active">Wszystkie</button><button>Nieprzeczytane <span>{conversations.filter((item) => item.unread).length}</span></button></div>
          <div className="chat-list-scroll">{visibleConversations.map((conversation) => {
            const person = conversation.participants.find((item) => item.id !== "you") || conversation.participants[0];
            const last = conversation.messages[conversation.messages.length - 1];
            return <button key={conversation.id} className={`chat-list-item ${conversation.id === activeConversation?.id ? "active" : ""}`} onClick={() => selectConversation(conversation.id)}><div className="chat-list-avatar-wrap">{conversation.type === "GROUP" ? <div className="chat-avatar group-avatar"><FiUsers /></div> : <Avatar person={person} />} {person?.online && <i className="online-dot" />}</div><span className="chat-list-copy"><strong>{conversation.name}</strong><small>{last?.deleted ? "Wiadomość usunięta" : last?.content || "Brak wiadomości — napisz pierwszy"}</small></span><span className="chat-list-meta">{last && formatTime(last.sentAt)}{conversation.unread > 0 && <b>{conversation.unread}</b>}</span></button>;
          })}</div>
          <div className="chat-list-footer"><div className="chat-status"><span className={socketStatus === "online" ? "live-dot" : "live-dot muted"} /><span>{socketStatus === "online" ? "Połączenie live" : "Tryb lokalny"}</span><FiWifi /></div></div>
        </aside>
        <main className="chat-thread">
          {activeConversation && <>
            <header className="chat-thread-header"><button className="icon-button mobile-back" onClick={() => setIsMobileList(true)}><FiArrowLeft /></button><div className="chat-thread-identity">{activeConversation.type === "GROUP" ? <div className="chat-avatar group-avatar"><FiUsers /></div> : <Avatar person={activePerson} large />}<div><h2>{activeConversation.name}</h2><span>{activeConversation.type === "GROUP" ? `${activeConversation.participants.length} osoby · aktywna grupa` : <><i className="online-dot-inline" /> {activePerson?.online ? "Aktywny teraz" : "Ostatnio online niedawno"}</>}</span></div></div><div className="chat-thread-actions"><button className="icon-button soft"><FiSearch /></button><button className="icon-button soft"><FiMoreHorizontal /></button></div></header>
            <div className="chat-thread-body">{activeConversation.messages.map((item, index) => { const day = formatDay(item.sentAt); const previousDay = index > 0 ? formatDay(activeConversation.messages[index - 1].sentAt) : null; const showDay = day !== previousDay; const own = item.senderId === "you" || item.senderId === currentUser.id; return <div key={item.id}>{showDay && <div className="chat-date-divider"><span>{day}</span></div>}<div className={`chat-message-row ${own ? "own" : ""}`}>{!own && <Avatar person={activeConversation.participants.find((person) => person.id === item.senderId) || { firstName: item.senderName?.split(" ")[0], lastName: item.senderName?.split(" ")[1] }} />}<div className="chat-message-stack"><span className="chat-message-author">{own ? "Ty" : item.senderName}</span><div className={`chat-bubble ${item.deleted ? "deleted" : ""}`}><span>{item.deleted ? "Wiadomość usunięta" : item.content}</span>{own && !item.deleted && <button className="message-delete" onClick={() => deleteMessage(item)} title="Usuń wiadomość"><FiTrash2 /></button>}</div><span className="chat-message-time">{formatTime(item.sentAt)} {own && !item.deleted && <FiCheck />}</span></div></div></div>; })}<div ref={messagesEndRef} /></div>
            <form className="chat-composer" onSubmit={addMessage}><div className="composer-input-wrap"><textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); addMessage(event); } }} placeholder="Napisz wiadomość..." rows="1" /><div className="composer-tools"><button type="button" title="Dodaj plik"><FiPaperclip /></button><button type="button" title="Dodaj emoji"><FiSmile /></button></div></div><button className="send-button" disabled={!message.trim()} aria-label="Wyślij"><FiSend /></button><span className="composer-hint">Enter, aby wysłać · Shift + Enter, aby dodać nową linię</span></form>
          </>}
        </main>
        <aside className="chat-info-panel"><div className="chat-info-cover"><div className="chat-info-avatar">{activeConversation?.type === "GROUP" ? <FiHash /> : initials(activePerson)}</div></div><div className="chat-info-content"><span className="eyebrow">{activeConversation?.type === "GROUP" ? "ZESPÓŁ" : "KONTAKT"}</span><h3>{activeConversation?.name}</h3><p>{activeConversation?.type === "GROUP" ? "Wspólna przestrzeń do szybkich decyzji i codziennej współpracy." : activePerson?.email}</p><div className="chat-info-stats"><div><strong>{activeConversation?.messages.length || 0}</strong><span>wiadomości</span></div><div><strong>{activeConversation?.participants.length || 0}</strong><span>uczestników</span></div></div><div className="chat-info-section"><div className="chat-info-section-title"><span>CZŁONKOWIE</span><button className="icon-button soft"><FiPlus /></button></div>{activeConversation?.participants.map((person) => <div className="chat-person-row" key={person.id}><Avatar person={person} /><span><strong>{person.id === "you" ? "Ty" : `${person.firstName} ${person.lastName}`}</strong><small>{person.online ? "Online" : "Offline"}</small></span><i className={person.online ? "online-dot" : "offline-dot"} /></div>)}</div></div></aside>
      </div>
      {showNew && <NewConversationModal users={users} onClose={() => setShowNew(false)} onCreate={createConversation} />}
    </section>
  );
}
