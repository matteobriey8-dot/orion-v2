import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function TypingIndicator() {
  return (
    <div className="message-row">
      <div className="message-avatar orion">✦</div>
      <div className="message-bubble orion">
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

export function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`message-row ${isUser ? 'user' : ''}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user' : 'orion'}`}>
        {isUser ? '👤' : '✦'}
      </div>

      {/* Contenu */}
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '70%' }}>
        <div
          className={`message-bubble ${isUser ? 'user' : message.isError ? 'error' : 'orion'}`}
          onDoubleClick={handleCopy}
          title="Double-clic pour copier"
        >
          {isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>
        <div className="message-time">
          {copied ? '✅ Copié !' : formatTime(message.timestamp || Date.now())}
        </div>
      </div>
    </div>
  );
}
