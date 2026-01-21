import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  productId?: number;
  productTitle?: string;
}

interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: Message;
  unreadCount: number;
  productId?: number;
  productTitle?: string;
}

interface ChatContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  unreadCount: number;
  sendMessage: (receiverId: string, receiverName: string, content: string, productId?: number, productTitle?: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversation: (userId1: string, userId2: string, productId?: number) => Conversation | null;
  createConversation: (userId: string, userName: string, productId?: number, productTitle?: string) => string;
  startConversation: (receiverId: string, receiverName: string, productId?: number, productTitle?: string) => string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});

  // Load chat data from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadChatData();
    } else {
      // Clear chat data when user logs out
      setConversations([]);
      setMessages({});
    }
  }, [user]);

  // Save chat data to localStorage whenever conversations or messages change
  useEffect(() => {
    if (user) {
      saveChatData();
    }
  }, [conversations, messages, user]);

  const loadChatData = () => {
    if (!user) return;

    try {
      const savedConversations = localStorage.getItem(`conversations_${user.id}`);
      const savedMessages = localStorage.getItem(`messages_${user.id}`);
      
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations);
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsedConversations.map((conv: any) => ({
          ...conv,
          lastMessage: conv.lastMessage ? {
            ...conv.lastMessage,
            timestamp: new Date(conv.lastMessage.timestamp)
          } : undefined
        }));
        setConversations(conversationsWithDates);
      }
      
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects for all messages
        const messagesWithDates: { [conversationId: string]: Message[] } = {};
        
        Object.keys(parsedMessages).forEach(conversationId => {
          messagesWithDates[conversationId] = parsedMessages[conversationId].map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        });
        
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      // Reset to empty state if there's an error
      setConversations([]);
      setMessages({});
    }
  };

  const saveChatData = () => {
    if (!user) return;

    try {
      localStorage.setItem(`conversations_${user.id}`, JSON.stringify(conversations));
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  const getConversation = (userId1: string, userId2: string, productId?: number): Conversation | null => {
    return conversations.find(conv => 
      conv.participants.includes(userId1) && 
      conv.participants.includes(userId2) &&
      (!productId || conv.productId === productId)
    ) || null;
  };

  const createConversation = (userId: string, userName: string, productId?: number, productTitle?: string): string => {
    if (!user) return '';

    const conversationId = `${user.id}_${userId}_${productId || 'general'}_${Date.now()}`;
    const newConversation: Conversation = {
      id: conversationId,
      participants: [user.id, userId],
      participantNames: [user.username, userName],
      unreadCount: 0,
      productId,
      productTitle
    };

    setConversations(prev => [...prev, newConversation]);
    setMessages(prev => ({ ...prev, [conversationId]: [] }));
    
    return conversationId;
  };

  const startConversation = (receiverId: string, receiverName: string, productId?: number, productTitle?: string): string => {
    if (!user) return '';

    // Check if conversation already exists
    let conversation = getConversation(user.id, receiverId, productId);
    
    if (!conversation) {
      // Create new conversation
      return createConversation(receiverId, receiverName, productId, productTitle);
    }
    
    return conversation.id;
  };

  const sendMessage = (receiverId: string, receiverName: string, content: string, productId?: number, productTitle?: string) => {
    if (!user) return;

    let conversation = getConversation(user.id, receiverId, productId);
    let conversationId: string;

    if (!conversation) {
      conversationId = createConversation(receiverId, receiverName, productId, productTitle);
    } else {
      conversationId = conversation.id;
    }

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: user.id,
      senderName: user.username,
      receiverId,
      receiverName,
      content,
      timestamp: new Date(),
      read: false,
      productId,
      productTitle
    };

    // Add message to messages
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    // Update conversation with last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, lastMessage: newMessage }
        : conv
    ));
  };

  const markAsRead = (conversationId: string) => {
    if (!user) return;

    setMessages(prev => ({
      ...prev,
      [conversationId]: prev[conversationId]?.map(msg => 
        msg.receiverId === user.id ? { ...msg, read: true } : msg
      ) || []
    }));

    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const unreadCount = conversations.reduce((total, conv) => {
    const convMessages = messages[conv.id] || [];
    const unread = convMessages.filter(msg => 
      msg.receiverId === user?.id && !msg.read
    ).length;
    return total + unread;
  }, 0);

  const value = {
    conversations,
    messages,
    unreadCount,
    sendMessage,
    markAsRead,
    getConversation,
    createConversation,
    startConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};