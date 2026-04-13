import { useEffect, useRef, useState } from 'react';
import { MessageBubble, TypingIndicator } from 'components/chat/MessageBubble';
import ChatInput from 'components/chat/ChatInput';
import api from 'utils/api';
import 'styles/chat.css';

const SUGGESTIONS = [
  { icon: '📅', text: 'Organise ma journée de demain' },
  { icon: '✉️', text: 'Rédige un email professionnel' },
  { icon: '💡', text: 'Donne-moi 5 idées créatives' },
  { icon: '🏋️', text: 'Crée un programme sport pour débutant' },
  { icon: '📊', text: 'Explique-moi comment investir' },
  { icon: '🧘', text: 'Guide-moi dans une méditation rapide' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [sessionId]             = useState(() => Date.now().toString());
  const bottomRef               = useRef(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (content) => {
    if (loading) return;

    const userMsg = {
      role: 'user',
      content,
      timestamp: Date.now(),
      id: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        messages: newMessages.map(({ role, content }) => ({ role, content })),
      });

      const assistantMsg = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: Date.now(),
        id: Date.now() + 1,
      };

      setMessages([...newMessages, assistantMsg]);
    } catch (e) {
      const errMsg = {
        role: 'assistant',
        content: '❌ ' + (e.response?.data?.error || 'Erreur de connexion au serveur.'),
        timestamp: Date.now(),
        id: Date.now() + 1,
        isError: true,
      };
      setMessages([...newMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => sendMessage(text);

  const clearChat = () => {
    setMessages([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="chat-layout">

      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-header-logo">✦</div>
          <div>
            <div className="chat-header-title">ORION</div>
            <div className="chat-header-sub">
              <span className="online-dot" />
              Gemini 2.0 Flash
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {messages.length > 0 && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowClearConfirm(true)}
              title="Nouvelle conversation"
            >
              ✚ Nouveau
            </button>
          )}
        </div>
      </div>

      {/* Confirmation effacement */}
      {showClearConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 28, maxWidth: 380, width: '90%',
          }}>
            <h3 style={{ marginBottom: 10 }}>Nouvelle conversation</h3>
            <p style={{ marginBottom: 20 }}>L'historique sera effacé. Continuer ?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowClearConfirm(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={clearChat}>
                Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages ou état vide */}
      {messages.length === 0 ? (
        <div className="chat-empty">
          <div className="chat-empty-logo">✦</div>
          <h2>Comment puis-je t'aider ?</h2>
          <p>Je suis ORION, ton assistant IA tout-en-un.</p>

          <div className="suggestions-grid">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="suggestion-card"
                onClick={() => handleSuggestion(s.text)}
              >
                <span className="suggestion-icon">{s.icon}</span>
                <span className="suggestion-text">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-messages">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}
