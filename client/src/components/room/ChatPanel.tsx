import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { ChatMessageDTO, CONSTANTS } from '@watchparty/shared';
import { useAuth } from '../../context/AuthContext';

interface ChatPanelProps {
  messages: ChatMessageDTO[];
  onSendMessage: (text: string) => void;
}

function formatMessageTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(trimmed);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="p-3.5 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-black" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-black">Party Chat</h3>
        </div>
        <span className="text-[11px] font-mono text-black font-bold">{messages.length} messages</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[220px] max-h-[420px] lg:max-h-none">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-black border-2 border-black border-dashed">
            <MessageSquare className="w-8 h-8 mb-2 text-black" />
            <p className="text-xs font-bold uppercase">No messages yet.</p>
            <p className="text-[11px] text-black font-bold mt-0.5">Say hello to start the party!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[11px]">
                  <span className={`font-bold ${isMe ? 'text-black' : 'text-black'}`}>
                    {isMe ? 'You' : msg.username}
                  </span>
                  <span className="text-[10px] text-black font-bold">{formatMessageTime(msg.createdAt)}</span>
                </div>
                <div
                  className={`px-3.5 py-2 text-xs max-w-[85%] break-words leading-relaxed border-2 border-black ${
                    isMe
                      ? 'bg-black text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t-2 border-black bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={CONSTANTS.MAX_MESSAGE_LENGTH}
          className="flex-1 px-3.5 py-2 bg-white border-2 border-black text-xs text-black placeholder:text-gray-500 font-bold focus:outline-none focus:bg-gray-100 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 bg-black hover:bg-white hover:text-black border-2 border-black disabled:opacity-50 text-white transition-all"
        >
          <Send className="w-3.5 h-3.5 fill-current" />
        </button>
      </form>
    </div>
  );
};
