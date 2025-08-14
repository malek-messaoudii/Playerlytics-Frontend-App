import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from '../types';
import { Bot, User, Send, BookOpen, ArrowLeft } from 'lucide-react';
import './Chatbot.css';
import logo from '../assets/logo.png'

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBack = () => {
    window.history.back(); // Retour à la page précédente
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatSources = (sources: any[]) => {
    if (!sources || sources.length === 0) return null;
    
    /*return (
      <div className="sources-container">
        <div className="sources-header">
          <BookOpen size={16} className="sources-icon" />
          <span>Sources utilisées :</span>
        </div>
        <ul className="sources-list">
          {sources.map((source, index) => (
            <li key={index} className="source-item">
              <span className="source-title">{source.title}</span>
              <span className="source-page">(Page {source.page})</span>
            </li>
          ))}
        </ul>
      </div>
    );*/
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;
  
    // Clear input and add user message
    setInput('');
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage 
    }]);
    
    setIsLoading(true);
  
    try {
      // API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
      const response = await fetch('http://127.0.0.1:7000/chat/chatbot/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ question: userMessage }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
  
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || 
          `Request failed with status ${response.status}`
        );
      }
  
      const data: ChatResponse = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        sources: data.sources || [] // Ensure sources exists
      }]);
      
    } catch (error) {
      console.error('API Error:', error);
      
      // User-friendly error messages
      let errorMessage = "Je suis désolé, une erreur est survenue. Veuillez réessayer.";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "La requête a pris trop de temps. Veuillez réessayer.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }
  
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        sources: [] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} /> Retour
      </button>
      <header className="chatbot-header">
        <h1>Votre Assistant IA du football africaine</h1>
          <img src={logo} alt="Logo" height={45} />
      </header>

      <main className="chatbot-main">
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <div className={`message ${message.role}`}>
                <div className="message-icon">
                  {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content">
                  {message.content}
                  {message.role === 'assistant' && message.sources && formatSources(message.sources)}
                </div>
              </div>
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="chatbot-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ici..."
            className="chatbot-input"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="chatbot-send">
            <Send size={20} />
          </button>
        </form>
      </main>
    </div>
  );
}

export default Chatbot;