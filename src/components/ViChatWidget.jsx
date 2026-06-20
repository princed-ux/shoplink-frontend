import { useState, useRef, useEffect } from 'react';
import { 
  X, Sparkles, Loader2, ChevronLeft, 
  MoreHorizontal, ArrowUp, Maximize2, Minimize2
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';

// The exact SVG you inspected for the close/collapse chevron
const IntercomChevronIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M18.601 8.39897C18.269 8.06702 17.7309 8.06702 17.3989 8.39897L12 13.7979L6.60099 8.39897C6.26904 8.06702 5.73086 8.06702 5.39891 8.39897C5.06696 8.73091 5.06696 9.2691 5.39891 9.60105L11.3989 15.601C11.7309 15.933 12.269 15.933 12.601 15.601L18.601 9.60105C18.9329 9.2691 18.9329 8.73091 18.601 8.39897Z" fill="currentColor"></path>
  </svg>
);

// Custom SVG with the new "talking/smiling" animation loop
const SmileBubbleIcon = () => (
  <svg viewBox="0 0 28 28" className="w-[34px] h-[34px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 8.5C25 5.462 22.538 3 19.5 3H8.5C5.462 3 3 5.462 3 8.5V17.5C3 20.538 5.462 23 8.5 23H13.5V27L17.5 23H19.5C22.538 23 25 20.538 25 17.5V8.5Z" fill="white"/>
    <path d="M8.5 14C10.5 17 13.5 17 15.5 14" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <animate 
        attributeName="d" 
        dur="4s" 
        repeatCount="indefinite"
        values="M8.5 14C10.5 17 13.5 17 15.5 14; M8.5 14C10.5 21 13.5 21 15.5 14; M8.5 14C10.5 17 13.5 17 15.5 14; M8.5 14C10.5 17 13.5 17 15.5 14"
        keyTimes="0; 0.1; 0.2; 1"
      />
    </path>
  </svg>
);

export default function ViChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const location = useLocation();

  // CHAT MEMORY
  const [messages, setMessages] = useState(() => {
    const savedChat = sessionStorage.getItem('vi_chat_history');
    if (savedChat) {
      return JSON.parse(savedChat);
    }
    return [{ 
      role: 'ai', 
      content: "Hi there! You're speaking with Vi AI Agent. I'm well trained and ready to assist you today but you can ask for the team at any time." 
    },
    {
      role: 'ai',
      content: "How can I help you scale your store today?"
    }];
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    sessionStorage.setItem('vi_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-vi-ai', {
        body: { query: userMsg }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (error) {
      console.error("Vi AI Error:", error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "Sorry, I'm having trouble connecting right now. Please try again or contact human support!" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Hide on storefront
  if (location.pathname.startsWith('/shop.vi')) {
    return null; 
  }

  // ACCURATE WIDTH CLASSES (Desktop Only)
  const desktopWidth = isExpanded ? "sm:w-[800px]" : "sm:w-[480px]"; 

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div className={`fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[99999] w-full h-[100dvh] sm:h-[700px] sm:max-h-[calc(100vh-110px)] ${desktopWidth} bg-white dark:bg-slate-900 sm:rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-0 sm:border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 sm:origin-bottom-right transition-all ease-in-out`}>
          
          {/* ── HEADER ── */}
          <div className="bg-white dark:bg-slate-900 px-5 py-4 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800 z-20 shadow-sm relative">
            <div className="flex items-center gap-3">
              {/* Bot Avatar - Emerald */}
              <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight">Vi AI</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[13px]">The team can also help</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 relative">
              {/* 3 Dots Menu - HIDDEN ON MOBILE */}
              <div className="hidden sm:block relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 rounded-md transition-colors outline-none ${showMenu ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-20 animate-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => {
                          setIsExpanded(!isExpanded);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-[14px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors"
                      >
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        {isExpanded ? 'Collapse window' : 'Expand window'}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Close Button - VISIBLE EVERYWHERE */}
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-colors outline-none"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ── CHAT AREA ── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f9fafb] dark:bg-slate-950 custom-scrollbar z-10">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 ${isExpanded ? 'max-w-[60%]' : 'max-w-[85%]'} ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar for AI only */}
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={12} className="text-slate-600 dark:text-slate-400" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-[1.2rem] rounded-tr-sm'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-[1.2rem] rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    {/* Timestamp mockup for AI */}
                    {msg.role === 'ai' && idx === messages.length - 1 && !isTyping && (
                      <span className="text-[11px] text-slate-400 mt-1 ml-1 font-medium">Vi • Just now</span>
                    )}
                  </div>

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex gap-2 max-w-[85%] flex-row">
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles size={12} className="text-slate-600 dark:text-slate-400" />
                  </div>
                  <div className="px-5 py-4 rounded-[1.2rem] rounded-tl-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT AREA ── */}
          <div className="p-4 bg-[#f9fafb] dark:bg-slate-950 pb-2 z-10">
            <form 
              onSubmit={handleSendMessage} 
              className="bg-white dark:bg-slate-900 border-2 border-emerald-500 rounded-[1.5rem] p-1.5 shadow-sm transition-all focus-within:shadow-md flex flex-col"
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask a question..."
                disabled={isTyping}
                rows={1}
                className="w-full bg-transparent border-none resize-none py-3 px-3 text-[15px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 disabled:opacity-50 min-h-[44px] max-h-[120px] custom-scrollbar"
              />
              
              <div className="flex items-center justify-end px-2 pb-1 pt-1">
                {/* Send Button */}
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    inputValue.trim() && !isTyping 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md active:scale-95' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isTyping ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={16} strokeWidth={3} />}
                </button>
              </div>
            </form>
            
            {/* Powered By Footer */}
            <div className="text-center mt-3 flex justify-center items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2 sm:mb-0">
              <Sparkles size={10} /> Powered by Vi AI
            </div>
          </div>

        </div>
      )}

      {/* ── FLOATING TOGGLE BUTTON (64px width/height) ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[99999] w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 
        ${isOpen 
          ? 'hidden sm:flex bg-emerald-500 text-white' 
          : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'}`}
      >
        {isOpen ? <IntercomChevronIcon /> : <SmileBubbleIcon />}
      </button>
    </>
  );
}