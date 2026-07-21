"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const messagesEndRef = useRef(null);
  const { lang } = useLanguage();

  // Check if API key is set by checking our mock flag (or we can track it with state)
  // We'll just keep our banner visible until we get a non-mock response
  useEffect(() => {
    if (isOpen) {
      // Try to get initial API key status by checking a flag, but for now we'll default to true
    }
  }, [isOpen]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call our API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      if (data.error) {
        // Check if error is API key related
        if (data.error.includes("API key")) {
          setApiKeyMissing(true);
        } else {
          setApiKeyMissing(false);
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error,
          },
        ]);
      } else {
        // Success! Real or mock response—if real, turn off apiKeyMissing!
        setApiKeyMissing(false);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, a connection error occurred. Check your internet and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Welcome message
  const welcomeMessage = "Hi! I'm Egypt Guide, your smart travel guide. How can I help you discover the best of Egypt today?";

  return (
    <div className={styles.chatbotContainer}>
      {/* Floating button to open chatbot */}
      <motion.button
        className={styles.floatingButton}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X size={24} strokeWidth={2.5} />
        ) : (
          <MessageCircle size={24} strokeWidth={2.5} />
        )}
        {!isOpen && (
          <motion.div
            className={styles.buttonBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
          >
            <Sparkles size={14} fill="#fff" />
          </motion.div>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Chat header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>
                  <Bot size={24} strokeWidth={2} />
                </div>
                <div className={styles.headerText}>
                  <h3>Egypt Guide</h3>
                  <span className={styles.statusIndicator}>
                    <span className={styles.statusDot} />
                    Online now
                  </span>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* API Key Reminder Banner */}
            {apiKeyMissing && (
              <div className={styles.apiKeyBanner}>
                <AlertCircle size={20} />
                <div className={styles.apiKeyBannerContent}>
                  <h4>⚠️ API Key Missing!</h4>
                  <ol>
                    <li>Go to <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">platform.openai.com</a></li>
                    <li>Create a new secret key</li>
                    <li>Copy and paste it into the <code>.env.local</code> file</li>
                    <li>Restart your dev server with <code>npm run dev</code></li>
                  </ol>
                </div>
              </div>
            )}

            {/* Chat messages area */}
            <div className={styles.messagesArea}>
              {/* Welcome message */}
              <motion.div
                className={styles.messageWrapper}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className={`${styles.message} ${styles.botMessage}`}>
                  <div className={styles.messageAvatar}>
                    <Bot size={18} />
                  </div>
                  <div className={styles.messageContent}>
                    <p>{welcomeMessage}</p>
                  </div>
                </div>
              </motion.div>

              {/* All messages */}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={styles.messageWrapper}
                  data-user={msg.role === "user" ? "true" : "false"}
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`${styles.message} ${
                      msg.role === "user"
                        ? styles.userMessage
                        : styles.botMessage
                    }`}
                  >
                    <div className={styles.messageAvatar}>
                      {msg.role === "user" ? (
                        <User size={18} />
                      ) : (
                        <Bot size={18} />
                      )}
                    </div>
                    <div className={styles.messageContent}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  className={styles.messageWrapper}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={`${styles.message} ${styles.botMessage}`}>
                    <div className={styles.messageAvatar}>
                      <Bot size={18} />
                    </div>
                    <div className={styles.messageContent}>
                      <Loader2 size={20} className={styles.loader} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form className={styles.inputArea} onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Egypt..."
                className={styles.chatInput}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
