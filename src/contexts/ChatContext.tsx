import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

export interface ProfessorLite {
  id: string;
  name: string;
}

interface ChatContextType {
  conversations: Conversation[];
  loading: boolean;
  getOrCreateConversation: (professor: ProfessorLite) => Promise<Conversation>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  getConversation: (conversationId: string) => Conversation | undefined;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAll = useCallback(async () => {
    if (!user) {
      setConversations([]);
      return;
    }
    setLoading(true);
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, teacher_id, created_at, teachers(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!convs) {
      setLoading(false);
      return;
    }

    const convIds = convs.map((c: any) => c.id);
    const { data: msgs } = convIds.length
      ? await supabase
          .from("messages")
          .select("*")
          .in("conversation_id", convIds)
          .order("created_at", { ascending: true })
      : { data: [] as any[] };

    const mapped: Conversation[] = convs.map((c: any) => {
      const conversationMsgs = (msgs ?? [])
        .filter((m: any) => m.conversation_id === c.id)
        .map((m: any) => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.message,
          timestamp: new Date(m.created_at),
          type: m.sender_id === user.id ? ("sent" as const) : ("received" as const),
        }));
      return {
        id: c.id,
        professorId: c.teacher_id,
        professorName: c.teachers?.name ?? "Professor",
        messages: conversationMsgs,
        lastActivity: conversationMsgs.length
          ? conversationMsgs[conversationMsgs.length - 1].timestamp
          : new Date(c.created_at),
      };
    });
    setConversations(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m: any = payload.new;
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== m.conversation_id) return c;
              if (c.messages.find((x) => x.id === m.id)) return c;
              return {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: m.id,
                    senderId: m.sender_id,
                    text: m.message,
                    timestamp: new Date(m.created_at),
                    type: m.sender_id === user.id ? "sent" : "received",
                  },
                ],
                lastActivity: new Date(m.created_at),
              };
            })
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getOrCreateConversation: ChatContextType["getOrCreateConversation"] = useCallback(
    async (professor) => {
      if (!user) throw new Error("Not authenticated");

      // Resolve teacher UUID: if id looks like UUID use it, otherwise lookup by name
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        professor.id
      );
      let teacherId = professor.id;
      if (!isUuid) {
        const { data: t } = await supabase
          .from("teachers")
          .select("id")
          .eq("name", professor.name)
          .maybeSingle();
        if (!t) throw new Error("Professor não encontrado no sistema");
        teacherId = t.id;
      }

      const existing = conversations.find((c) => c.professorId === teacherId);
      if (existing) return existing;

      const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id, teacher_id: teacherId })
        .select("id, teacher_id, created_at")
        .single();

      if (error || !data) {
        await loadAll();
        const found = conversations.find((c) => c.professorId === teacherId);
        if (found) return found;
        throw error ?? new Error("Falha ao criar conversa");
      }

      const newConv: Conversation = {
        id: data.id,
        professorId: data.teacher_id,
        professorName: professor.name,
        messages: [],
        lastActivity: new Date(data.created_at),
      };
      setConversations((prev) => [newConv, ...prev]);
      return newConv;
    },
    [user, conversations, loadAll]
  );

  const sendMessage = useCallback(
    async (conversationId: string, text: string) => {
      if (!user) return;
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        message: text,
      });
      // Realtime will push the row; no local optimistic needed (kept simple)
    },
    [user]
  );

  const deleteConversation = useCallback(async (conversationId: string) => {
    await supabase.from("conversations").delete().eq("id", conversationId);
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
  }, []);

  const getConversation = useCallback(
    (conversationId: string) => conversations.find((c) => c.id === conversationId),
    [conversations]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        loading,
        getOrCreateConversation,
        sendMessage,
        deleteConversation,
        getConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
