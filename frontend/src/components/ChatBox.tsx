/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  getChatHistory, 
  sendChatMessage, 
  storeChatInteraction,
  ChatInteraction 
} from '../api/index';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface ChatBoxProps {
  projectId: number | string;
  projectName?: string;
  onClose: () => void;
}

interface MessageBubble {
  sender: 'user' | 'hermes';
  text: string;
  timestamp: string;
}

export default function ChatBox({ projectId, projectName, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat history when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Load chat history when opened
  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      setError(null);
      try {
        const history = await getChatHistory(projectId);
        
        // Convert stored interactions into chat bubbles
        const bubbles: MessageBubble[] = [];
        history.forEach((interaction) => {
          if (interaction.user_message) {
            bubbles.push({
              sender: 'user',
              text: interaction.user_message,
              timestamp: interaction.created_at || new Date().toISOString()
            });
          }
          if (interaction.hermes_answer) {
            bubbles.push({
              sender: 'hermes',
              text: interaction.hermes_answer,
              timestamp: interaction.created_at || new Date().toISOString()
            });
          }
        });

        setMessages(bubbles);
      } catch (err: any) {
        console.error('Failed to load chat history:', err);
        setError('Failed to load previous chat history. Starting fresh session.');
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [projectId]);

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setSending(true);
    setError(null);

    // 1. Append user message immediately
    const userBubble: MessageBubble = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userBubble]);

    try {
      // 2. Call chat endpoint
      const result = await sendChatMessage(projectId, userText);
      
      // 3. Append Hermes response
      const hermesBubble: MessageBubble = {
        sender: 'hermes',
        text: result.answer,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, hermesBubble]);

      // 4. Store chat interaction in database asynchronously
      try {
        await storeChatInteraction(projectId, userText, result.answer);
      } catch (storeErr) {
        console.warn('Failed to store chat interaction in memory:', storeErr);
      }

    } catch (err: any) {
      console.error('Chat request failed:', err);
      setError('Hermes is momentarily unresponsive. Please try again.');
      
      // Remove last user message or show error notice
      setMessages((prev) => [
        ...prev,
        {
          sender: 'hermes',
          text: '⚠️ System Error: I could not process your query. Please check your database/API connectivity and try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div 
      id="chat-box-overlay" 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <div 
        id="chat-box-modal" 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                Hermes Chat Assistant
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase rounded tracking-wider border border-emerald-100">
                  Online
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1 truncate max-w-[280px]">
                {projectName ? `Context: ${projectName}` : 'Project Intelligence Context'}
              </p>
            </div>
          </div>
          <button 
            id="close-chat-btn-top"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-150 hover:text-slate-700 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages Log area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-4 custom-scrollbar">
          {loadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center space-y-2">
              <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
              <span className="text-[11px] text-slate-500 font-medium">Restoring chat logs from memory...</span>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-2.5 bg-amber-50 border border-amber-150 rounded-lg flex items-center gap-2 text-[11px] text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <MessageSquare className="h-8 w-8 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">No Chat Logs Found</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Ask any questions about this project's scheduling details, milestones, meeting notes, or budget alerts.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Avatar for Hermes */}
                      {!isUser && (
                        <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg border border-purple-200 shrink-0">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}

                      <div className={`max-w-[80%] space-y-0.5 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                        {/* Bubble */}
                        <div 
                          className={`p-3 rounded-xl text-xs leading-relaxed shadow-3xs ${
                            isUser 
                              ? 'bg-purple-600 text-white rounded-tr-none font-medium' 
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none font-normal'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {/* Timestamp */}
                        <span className="text-[9px] font-medium text-slate-400 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString(undefined, { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>

                      {/* Avatar for User */}
                      {isUser && (
                        <div className="p-1.5 bg-slate-200 text-slate-600 rounded-lg border border-slate-300 shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {sending && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg border border-purple-200 shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200/80 p-3 rounded-xl rounded-tl-none shadow-3xs">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Loader2 className="h-3 w-3 text-purple-600 animate-spin" />
                      <span>Hermes is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar form */}
        <form 
          id="chat-box-form" 
          onSubmit={handleSendMessage}
          className="bg-slate-50 border-t border-slate-200 p-3 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loadingHistory || sending}
            placeholder={loadingHistory ? "Restoring connection..." : "Ask Hermes about the project..."}
            className="flex-1 bg-white border border-slate-250 hover:border-slate-300 focus:border-purple-500 rounded-lg px-3.5 py-2.5 text-xs focus:outline-hidden disabled:opacity-65 shadow-inner transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending || loadingHistory}
            className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg transition-colors cursor-pointer shrink-0 disabled:cursor-not-allowed shadow-xs"
          >
            {sending ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Send className="h-4.5 w-4.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
