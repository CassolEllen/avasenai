import React, { createContext, useContext, useState, useCallback } from "react";
import type { Professor } from "@/data/professors";

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: "sent" | "received";
}

export interface Conversation {
  id: string;
  professorId: string;
  professorName: string;
  messages: ChatMessage[];
  lastActivity: Date;
}

interface ChatContextType {
  conversations: Conversation[];
  getOrCreateConversation: (professor: Professor) => Conversation;
  sendMessage: (conversationId: string, text: string) => void;
  deleteConversation: (conversationId: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};

const professorReplies: Record<string, string[]> = {
  default: [
    "Obrigado pela mensagem! Vou verificar e te respondo em breve.",
    "Recebi sua mensagem. Pode contar comigo!",
    "Ótima pergunta! Vamos discutir na próxima aula.",
  ],
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const getOrCreateConversation = useCallback((professor: Professor) => {
    const existing = conversations.find(c => c.professorId === professor.id);
    if (existing) return existing;
    const newConv: Conversation = {
      id: `chat-${professor.id}`,
      professorId: professor.id,
      professorName: professor.name,
      messages: [],
      lastActivity: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    return newConv;
  }, [conversations]);

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "student",
      text,
      timestamp: new Date(),
      type: "sent",
    };
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== conversationId) return c;
        return { ...c, messages: [...c.messages, userMsg], lastActivity: new Date() };
      })
    );

    // Simulate professor reply
    setTimeout(() => {
      const replies = professorReplies.default;
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        senderId: conversationId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date(),
        type: "received",
      };
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== conversationId) return c;
          return { ...c, messages: [...c.messages, replyMsg], lastActivity: new Date() };
        })
      );
    }, 1500 + Math.random() * 2000);
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
  }, []);

  const getConversation = useCallback((conversationId: string) => {
    return conversations.find(c => c.id === conversationId);
  }, [conversations]);

  return (
    <ChatContext.Provider value={{ conversations, getOrCreateConversation, sendMessage, deleteConversation, getConversation }}>
      {children}
    </ChatContext.Provider>
  );
};
