import { useState } from 'react';

// ── BUTTON ────────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', size = '', loading, full, onClick, disabled, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${full ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
}

// ── INPUT ─────────────────────────────────────────────────────────────────────
export function Input({ label, error, type = 'text', className = '', ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

// ── TEXTAREA ──────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea
        className={`input textarea ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
}

// ── SELECT ────────────────────────────────────────────────────────────────────
export function Select({ label, options, value, onChange, className = '' }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select className={`select ${className}`} value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── CHIPS ─────────────────────────────────────────────────────────────────────
export function Chips({ label, options, value, onChange }) {
  return (
    <div className="tool-section">
      {label && <div className="tool-section-label">{label}</div>}
      <div className="chips">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            className={`chip ${value === opt ? 'active' : ''}`}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── RESULT BOX ────────────────────────────────────────────────────────────────
export function ResultBox({ result, onCopy, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  if (!result) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="result-header">
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Résultat</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {onRegenerate && (
            <Button variant="ghost" size="sm" onClick={onRegenerate}>
              🔄 Régénérer
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? '✅ Copié !' : '📋 Copier'}
          </Button>
        </div>
      </div>
      <div className="result-box">{result}</div>
    </div>
  );
}

// ── ALERT ─────────────────────────────────────────────────────────────────────
export function Alert({ type = 'error', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

// ── SPINNER ───────────────────────────────────────────────────────────────────
export function Spinner({ accent }) {
  return <span className={`spinner ${accent ? 'spinner-accent' : ''}`} />;
}

// ── BADGE ─────────────────────────────────────────────────────────────────────
export function Badge({ children, type = 'accent' }) {
  return <span className={`badge badge-${type}`}>{children}</span>;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose, actions }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div className="modal">
        {title && <div className="modal-title">{title}</div>}
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${pct}%`, background: color || 'var(--accent)' }}
      />
    </div>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

// ── TOOL FORM WRAPPER ─────────────────────────────────────────────────────────
export function ToolForm({ children }) {
  return <div className="tool-form">{children}</div>;
}

export function ToolSection({ label, children }) {
  return (
    <div className="tool-section">
      {label && <div className="tool-section-label">{label}</div>}
      {children}
    </div>
  );
}

// ── PAGE HEADER ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, back, onBack, actions }) {
  return (
    <div className="page-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button className="btn btn-ghost btn-icon" onClick={onBack}>←</button>
        )}
        <div>
          <div className="page-title">{title}</div>
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>
      {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
    </div>
  );
}
