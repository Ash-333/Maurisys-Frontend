import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, Loader2, RotateCcw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const STARTERS = [
  'Get a price estimate',
  'What services do you offer?',
  'Show me your recent work',
];

const GREETING = {
  role: 'assistant',
  content:
    "Hi! Ask me about our services and past projects, or describe what you'd like built and I'll give you a ballpark estimate.",
  sources: [],
};

/** Stable per-visitor id so the server can hold the conversation history. */
const getSessionId = () => {
  try {
    let id = localStorage.getItem('chatSessionId');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('chatSessionId', id);
    }
    return id;
  } catch {
    // Private browsing / storage blocked — fall back to a per-page-load id.
    return crypto.randomUUID();
  }
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel, matching the admin dialogs.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || sending) return;

    setInput('');
    setError('');
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setSending(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, sessionId: getSessionId() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        // 429 carries a human-readable reason worth showing as-is.
        setError(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.data.answer,
          sources: data.data.sources || [],
        },
      ]);
    } catch {
      setError('Could not reach the assistant. Please check your connection.');
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    try {
      localStorage.removeItem('chatSessionId');
    } catch {
      /* storage unavailable — the new id is generated per load anyway */
    }
    setMessages([GREETING]);
    setError('');
  };

  // Unique pages referenced by an answer, so one answer doesn't list the same
  // page three times because three of its chunks matched.
  const uniqueSources = (sources = []) => {
    const seen = new Set();
    return sources.filter((s) => {
      if (!s.url || seen.has(s.url)) return false;
      seen.add(s.url);
      return true;
    });
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-primary-800 text-white shadow-elevated flex items-center justify-center hover:bg-primary-900 transition-all hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[min(600px,calc(100vh-8rem))] bg-white rounded-2xl shadow-elevated border border-slate-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary-900 text-white shrink-0">
            <p className="font-semibold text-sm">Maurisys AI Assistant</p>
            <button
              onClick={reset}
              title="Start a new conversation"
              className="p-1.5 rounded-md hover:bg-white/10 text-primary-200 hover:text-white transition-colors"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-800 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {uniqueSources(m.sources).length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex flex-wrap gap-1.5">
                      {uniqueSources(m.sources).slice(0, 3).map((s) => (
                        <Link
                          key={s.url}
                          to={s.url}
                          onClick={() => setOpen(false)}
                          className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200 text-primary-700 hover:border-primary-300 transition-colors"
                        >
                          {s.title || s.url}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Starters only while the conversation is untouched */}
            {messages.length === 1 && !sending && (
              <div className="flex flex-wrap gap-2 pt-1">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-2 text-slate-500">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Thinking…</span>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="p-3 border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Ask a question…"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-primary-400 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-10 h-10 shrink-0 rounded-full bg-primary-800 text-white flex items-center justify-center hover:bg-primary-900 disabled:opacity-40 disabled:hover:bg-primary-800 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
