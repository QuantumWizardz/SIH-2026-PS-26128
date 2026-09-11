import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { processUserMessage } from '../services/assistant';
import type { ChatMessage } from '../services/assistant';
import { RiskBadge } from '../design/RiskBadge';

export function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'assistant', text: "Hello! I'm your Pashu Rakshak assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const reply = await processUserMessage(userMsg.text);
    setIsTyping(false);
    setMessages(prev => [...prev, reply]);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-terracotta text-cream rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-cream rounded-2xl shadow-2xl flex flex-col z-50 border border-espresso/10 overflow-hidden">
          <div className="bg-espresso text-cream p-4 flex justify-between items-center">
            <h3 className="font-bold tracking-wide">Pashu Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-cream/70 hover:text-cream">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${m.sender === 'user' ? 'bg-terracotta text-cream rounded-br-sm' : 'bg-white border border-espresso/10 text-espresso rounded-bl-sm'}`}>
                  {m.text}
                </div>
                {m.ui?.type === 'disease_card' && (
                  <div className="mt-2 bg-white border border-espresso/10 p-3 rounded-lg shadow-sm w-[85%]">
                    <div className="flex justify-between items-start mb-2">
                      <strong className="text-sm">{m.ui.disease.abbreviation}</strong>
                      <RiskBadge tier={m.ui.disease.severity.toUpperCase() as any} label={m.ui.disease.severity} />
                    </div>
                    <div className="text-xs text-espresso-70 mt-1">
                      <strong>Early:</strong> {m.ui.disease.symptoms?.early?.join(', ') || 'N/A'}<br/>
                      <strong>Late:</strong> {m.ui.disease.symptoms?.late?.join(', ') || 'N/A'}
                    </div>
                  </div>
                )}
                {m.ui?.type === 'facility_card' && (
                  <div className="mt-2 bg-white border border-espresso/10 p-3 rounded-lg shadow-sm w-[85%]">
                    <strong className="text-sm">{m.ui.facility.name}</strong>
                    <div className="text-xs text-espresso-70 mt-1">
                      Distance: 4.2 km<br/>
                      Status: {m.ui.facility.availability}
                    </div>
                    <div className="mt-2 text-xs font-bold text-espresso">Why recommended:</div>
                    <ul className="text-xs text-espresso-70 list-disc pl-4 mt-1">
                      {m.ui.whyRecommended.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                {m.ui?.type === 'draft_report' && (
                  <div className="mt-2 bg-risk-watch/10 border border-risk-watch/30 p-3 rounded-lg shadow-sm w-[85%]">
                    <strong className="text-sm text-risk-watch">Draft Report</strong>
                    <div className="text-xs mt-1">
                      Species: {m.ui.species}<br/>
                      Symptom: {m.ui.symptom}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start">
                <div className="bg-white border border-espresso/10 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <div className="w-2 h-2 bg-espresso-40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-espresso-40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-espresso-40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-espresso/10 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none border border-espresso/20 rounded-full px-4 py-2 text-sm focus:border-terracotta"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 bg-terracotta text-cream rounded-full flex items-center justify-center hover:bg-clay transition-colors disabled:opacity-50"
              disabled={!input.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
