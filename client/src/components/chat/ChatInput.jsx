import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const ref = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.min(ref.current.scrollHeight, 140) + 'px';
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (ref.current) ref.current.style.height = 'auto';
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrapper">
        <textarea
          ref={ref}
          className="chat-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Envoie un message à ORION... (Shift+Entrée pour sauter une ligne)"
          disabled={disabled}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          title="Envoyer"
        >
          {disabled ? (
            <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
          ) : '↑'}
        </button>
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        color: 'var(--text3)',
        marginTop: 6,
      }}>
        ORION peut faire des erreurs — vérifie les infos importantes.
      </div>
    </div>
  );
}
