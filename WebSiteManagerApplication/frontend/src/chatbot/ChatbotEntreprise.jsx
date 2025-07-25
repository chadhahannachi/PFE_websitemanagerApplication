import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Icon } from '@iconify/react';

const defaultPrefs = {
  chatbotMainColor: '#007bff',
  chatbotFontFamily: 'inherit',
  chatbotUserBgColor: '#d1e7dd',
  chatbotBotBgColor: '#e2e3e5',
  chatbotBorderRadius: 16,
  chatbotMessagesBgColor: '#f9f9f9',
  chatbotMessagesBgImage: '',
};

const ChatbotEntreprise = ({ entrepriseId, livePrefs }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [chatbotPrefs, setChatbotPrefs] = useState(defaultPrefs);
  const inputRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`).then(res => {
      const styles = res.data.preferences?.chatbot?.styles || defaultPrefs;
      setChatbotPrefs({
        chatbotMainColor: styles.chatbotMainColor || defaultPrefs.chatbotMainColor,
        chatbotFontFamily: styles.chatbotFontFamily || defaultPrefs.chatbotFontFamily,
        chatbotUserBgColor: styles.chatbotUserBgColor || defaultPrefs.chatbotUserBgColor,
        chatbotBotBgColor: styles.chatbotBotBgColor || defaultPrefs.chatbotBotBgColor,
        chatbotBorderRadius: typeof styles.chatbotBorderRadius === 'number' ? styles.chatbotBorderRadius : defaultPrefs.chatbotBorderRadius,
        chatbotMessagesBgColor: styles.chatbotMessagesBgColor || defaultPrefs.chatbotMessagesBgColor,
        chatbotMessagesBgImage: styles.chatbotMessagesBgImage || defaultPrefs.chatbotMessagesBgImage,
      });
    }).catch(() => setChatbotPrefs(defaultPrefs));
  }, [entrepriseId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/chatbot/${entrepriseId}`,
        { question: input },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Erreur lors de la récupération de la réponse.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Appliquer livePrefs si fourni
  const effectivePrefs = livePrefs || chatbotPrefs;

  return (
    <>
      {/* Boule flottante */}
      <div
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: effectivePrefs.chatbotMainColor,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          fontFamily: effectivePrefs.chatbotFontFamily,
        }}
        title="Ouvrir le chatbot"
      >
        {/* Icône chat Iconify */}
        <Icon icon="token:chat" width="32" height="32" color="#fff" />
      </div>

      {/* Fenêtre de chat */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 350,
            maxWidth: '90vw',
            height: 480,
            background: '#fff',
            borderRadius: effectivePrefs.chatbotBorderRadius,
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: effectivePrefs.chatbotFontFamily,
          }}
        >
          {/* Header */}
          <div style={{
            background: effectivePrefs.chatbotMainColor,
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: effectivePrefs.chatbotFontFamily,
          }}>
            <span style={{ fontWeight: 'bold' }}>Chatbot Entreprise</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 22,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              title="Fermer"
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div style={{
            flex: 1,
            padding: 16,
            background: undefined, // on va gérer tout dans backgroundImage
            backgroundImage: effectivePrefs.chatbotMessagesBgImage && effectivePrefs.chatbotMessagesBgColor
              ? `linear-gradient(${effectivePrefs.chatbotMessagesBgColor}, ${effectivePrefs.chatbotMessagesBgColor}), url(${effectivePrefs.chatbotMessagesBgImage})`
              : effectivePrefs.chatbotMessagesBgImage
                ? `url(${effectivePrefs.chatbotMessagesBgImage})`
                : effectivePrefs.chatbotMessagesBgColor
                  ? effectivePrefs.chatbotMessagesBgColor
                  : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontFamily: effectivePrefs.chatbotFontFamily,
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                textAlign: msg.sender === 'user' ? 'right' : 'left'
              }}>
                <span style={{
                  background: msg.sender === 'user' ? effectivePrefs.chatbotUserBgColor : effectivePrefs.chatbotBotBgColor,
                  padding: '6px 12px',
                  borderRadius: 16,
                  display: 'inline-block',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  fontFamily: effectivePrefs.chatbotFontFamily,
                }}>
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div style={{ color: '#888' }}>...</div>}
          </div>
          {/* Input */}
          <div style={{
            display: 'flex',
            gap: 8,
            padding: 12,
            borderTop: '1px solid #eee',
            background: '#fff',
            fontFamily: effectivePrefs.chatbotFontFamily,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez une question sur l'entreprise..."
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 50,
                border: '1px solid #ccc',
                fontFamily: effectivePrefs.chatbotFontFamily,
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 50,
                background: effectivePrefs.chatbotMainColor,
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon icon="streamline:send-email" width="20" height="20" color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotEntreprise;