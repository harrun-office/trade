import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Package } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId?: string;
  sellerName?: string;
  productId?: number;
  productTitle?: string;
}

const ChatModal: React.FC<ChatModalProps> = ({ 
  isOpen, 
  onClose, 
  sellerId, 
  sellerName, 
  productId, 
  productTitle 
}) => {
  const { user } = useAuth();
  const { conversations, messages, sendMessage, markAsRead, getConversation, startConversation } = useChat();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select or create conversation when modal opens
  useEffect(() => {
    if (isOpen && user) {
      if (sellerId && sellerName) {
        // Check if conversation exists
        const existingConversation = getConversation(user.id, sellerId, productId);
        
        if (existingConversation) {
          setSelectedConversation(existingConversation.id);
          markAsRead(existingConversation.id);
        } else {
          // Start a new conversation
          const newConversationId = startConversation(sellerId, sellerName, productId, productTitle);
          setSelectedConversation(newConversationId);
        }
      } else if (conversations.length > 0) {
        // Select the first conversation if no specific seller
        setSelectedConversation(conversations[0].id);
        markAsRead(conversations[0].id);
      }
    }
  }, [isOpen, sellerId, sellerName, productId, productTitle, user, getConversation, startConversation, markAsRead, conversations]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedConversation(null);
      setMessageText('');
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const userConversations = conversations.filter(conv => 
    conv.participants.includes(user.id)
  );

  const selectedMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    if (sellerId && sellerName && selectedConversation) {
      // Send to specific seller in the selected conversation
      sendMessage(sellerId, sellerName, messageText, productId, productTitle);
    } else if (selectedConversation) {
      // Send to selected conversation
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (conversation) {
        const otherParticipantId = conversation.participants.find(p => p !== user.id);
        const otherParticipantName = conversation.participantNames.find((name, index) => 
          conversation.participants[index] !== user.id
        );
        
        if (otherParticipantId && otherParticipantName) {
          sendMessage(otherParticipantId, otherParticipantName, messageText, conversation.productId, conversation.productTitle);
        }
      }
    }

    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentConversation = selectedConversation ? conversations.find(c => c.id === selectedConversation) : null;
  const otherParticipantName = currentConversation ? 
    currentConversation.participantNames.find((name, index) => 
      currentConversation.participants[index] !== user.id
    ) : sellerName;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[600px] flex flex-col transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white">Conversations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {userConversations.length === 0 && !selectedConversation ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start chatting with sellers!</p>
                </div>
              ) : (
                <>
                  {/* Show current conversation if it's new */}
                  {selectedConversation && !userConversations.find(c => c.id === selectedConversation) && (
                    <button
                      className="w-full p-4 text-left bg-purple-50 dark:bg-purple-900 border-b border-gray-100 dark:border-gray-600 border-purple-200 dark:border-purple-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">{otherParticipantName}</span>
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                          New
                        </span>
                      </div>
                      {productTitle && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Package className="w-3 h-3 mr-1" />
                          <span className="truncate">{productTitle}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Start a conversation...
                      </p>
                    </button>
                  )}
                  
                  {userConversations.map((conversation) => {
                    const otherParticipantName = conversation.participantNames.find((name, index) => 
                      conversation.participants[index] !== user.id
                    );
                    const unreadCount = (messages[conversation.id] || []).filter(msg => 
                      msg.receiverId === user.id && !msg.read
                    ).length;

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversation(conversation.id);
                          markAsRead(conversation.id);
                        }}
                        className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 transition-colors ${
                          selectedConversation === conversation.id ? 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{otherParticipantName}</span>
                          {unreadCount > 0 && (
                            <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.productTitle && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <Package className="w-3 h-3 mr-1" />
                            <span className="truncate">{conversation.productTitle}</span>
                          </div>
                        )}
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-3">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {otherParticipantName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {otherParticipantName}
                      </h3>
                      {(productTitle || currentConversation?.productTitle) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          About: {productTitle || currentConversation?.productTitle}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p>Start your conversation with {otherParticipantName}</p>
                      <p className="text-sm">Send a message below to get started!</p>
                    </div>
                  )}
                  
                  {selectedMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user.id ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;