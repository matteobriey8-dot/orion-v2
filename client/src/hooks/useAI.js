import { useState } from 'react';
import api from 'utils/api';

export function useAI() {
  const [result, setResult]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const generate = async (prompt, tool = null) => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await api.post('/chat/tool', { prompt, tool });
      setResult(res.data.reply);
      return res.data.reply;
    } catch (e) {
      const msg = e.response?.data?.error || 'Erreur de connexion au serveur.';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(''); setError(''); };

  return { result, loading, error, generate, reset };
}

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);

  const sendMessage = async (content, systemPrompt = null) => {
    const userMsg = { role: 'user', content, id: Date.now() };
    const msgs = [...messages, userMsg];
    setMessages(msgs);
    setLoading(true);

    try {
      const payload = systemPrompt
        ? [{ role: 'user', content: systemPrompt }, { role: 'assistant', content: 'Compris.' }, ...msgs]
        : msgs;

      const res = await api.post('/chat', {
        messages: payload.map(({ role, content }) => ({ role, content }))
      });

      const assistantMsg = { role: 'assistant', content: res.data.reply, id: Date.now() + 1 };
      setMessages([...msgs, assistantMsg]);
      return res.data.reply;
    } catch (e) {
      const errMsg = { role: 'assistant', content: '❌ Erreur de connexion.', id: Date.now() + 1 };
      setMessages([...msgs, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => setMessages([]);

  return { messages, loading, sendMessage, clearMessages };
}
