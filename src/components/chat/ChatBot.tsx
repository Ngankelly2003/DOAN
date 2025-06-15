"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, List, Typography, Spin, Badge, Tag, Avatar } from 'antd';
import { SendOutlined, MessageOutlined, CloseOutlined, SearchOutlined, UserOutlined, RobotOutlined, AudioOutlined } from '@ant-design/icons';
import { INews } from '@/model/news.model';

interface Message {
  content: string;
  type: 'user' | 'bot';
  articles?: INews[];
  suggestions?: string[];
}

const SUGGESTIONS = [
  'Tin tức bóng đá',
  'Kinh tế Việt Nam',
  'Công nghệ AI',
  'Giải trí showbiz',
  'Chứng khoán',
  'Thời sự quốc tế',
  'Tin giáo dục',
  'Du lịch hè',
];

const WELCOME_MESSAGE =
  'Xin chào! Tôi là trợ lý AI tin tức. Bạn muốn tìm hiểu về chủ đề nào? Hãy chọn một gợi ý bên dưới hoặc nhập câu hỏi của bạn!';

const LOCAL_STORAGE_KEY = 'chatbot_history';

const ChatBot = () => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { content: WELCOME_MESSAGE, type: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if we should show the chatbot
  const shouldShowChatbot = () => {
    if (!mounted) return false;
    const pathname = window.location.pathname;
    return !(
      pathname.includes('/login') || 
      pathname === '/login' || 
      pathname.includes('/cms/') ||
      pathname.includes('/admin') ||
      pathname.includes('/user') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/user')
    );
  };

  // Load history from localStorage
  useEffect(() => {
    if (mounted) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        try {
          const savedMessages = JSON.parse(saved);
          setMessages(savedMessages);
        } catch (error) {
          console.error('Failed to parse chat history:', error);
        }
      }
    }
  }, [mounted]);

  // Save history to localStorage
  useEffect(() => {
    if (mounted && messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Tự động cuộn xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Gợi ý thông minh sau mỗi câu trả lời
  const getSmartSuggestions = (msg: string): string[] => {
    if (msg.toLowerCase().includes('bóng đá')) return ['V-League', 'Đội tuyển Việt Nam', 'Ngoại hạng Anh'];
    if (msg.toLowerCase().includes('ai')) return ['OpenAI', 'Ứng dụng AI', 'Tin tức AI mới nhất'];
    if (msg.toLowerCase().includes('chứng khoán')) return ['VN-Index', 'Cổ phiếu nổi bật', 'Dự báo thị trường'];
    if (msg.toLowerCase().includes('giải trí')) return ['Showbiz Việt', 'Phim chiếu rạp', 'Nhạc hot'];
    return SUGGESTIONS.slice(0, 3);
  };

  // Gửi tin nhắn
  const handleSend = async (customInput?: string) => {
    const question = customInput || input;
    if (!question.trim()) return;

    setMessages(prev => [...prev, { content: question, type: 'user' }]);
    setLoading(true);
    setShowSuggestions(false);
    setIsTyping(true);

    // const apiUrl = "https://doan-ten.vercel.app/";
    try {
      // Hiệu ứng typing
      setTimeout(async () => {
        const response = await fetch(`/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question })
        });
        console.log(response);
        
        const data = await response.json();
        setIsTyping(false);
        if (data.success) {
          // Gợi ý thông minh dựa trên câu trả lời
          const smartSuggestions = getSmartSuggestions(data.data.response);
          setMessages(prev => [...prev, {
            content: data.data.response,
            type: 'bot',
            articles: data.data.suggestedArticles || [],
            suggestions: smartSuggestions
          }]);
        } else {
          throw new Error(data.message || 'Error processing request');
        }
        setLoading(false);
        setInput('');
      }, 800); // delay typing
    } catch (error) {
      setIsTyping(false);
      setLoading(false);
      setMessages(prev => [...prev, {
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
        type: 'bot'
      }]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput('');
    handleSend(suggestion);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowSuggestions(true);
  };

  // Voice input (Web Speech API)
  const handleVoiceInput = () => {
    if (!mounted) return;
    
    if (!('webkitSpeechRecognition' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ nhập bằng giọng nói!');
      return;
    }
    
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  if (!mounted || !shouldShowChatbot()) {
    return null;
  }

  return (
    <>
      {/* Chat Icon */}
      <div 
        className={`fixed bottom-20 right-8 cursor-pointer transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}
        onClick={toggleChat}
        style={{ zIndex: 9999 }}
      >
        <Badge count={messages.length > 1 ? messages.length - 1 : 0}>
          <Button 
            type="primary" 
            shape="circle" 
            size="large"
            icon={<MessageOutlined style={{ fontSize: '24px' }} />}
            className="w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          />
        </Badge>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-20 right-8 transition-all duration-300 ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{ zIndex: 9999 }}
      >
        <Card 
          className="shadow-lg"
          style={{ width: '380px' }}
          bodyStyle={{ padding: '12px' }}
          title={
            <div className="flex justify-between items-center">
              <span>Chat với AI</span>
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={toggleChat}
                className="hover:text-red-500"
              />
            </div>
          }
          extra={<Typography.Text type="secondary"></Typography.Text>}
        >
          <div className="h-[400px] overflow-y-auto mb-4 p-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'bot' && (
                  <Avatar icon={<RobotOutlined />} className="mr-2 bg-blue-100 text-blue-600" />
                )}
                <div 
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100'
                  }`}
                >
                  <Typography.Text 
                    className={msg.type === 'user' ? 'text-white' : ''}
                  >
                    {msg.content}
                  </Typography.Text>
                  
                  {msg.articles && msg.articles.length > 0 && (
                    <div className="mt-3">
                      <Typography.Text className="text-sm font-medium">
                        Bài viết liên quan ({msg.articles.length}):
                      </Typography.Text>
                      <List
                        className="mt-2"
                        size="small"
                        dataSource={msg.articles}
                        renderItem={(article, index) => (
                          <List.Item key={index} className="p-2 border-b border-gray-200 last:border-b-0">
                            <div className="w-full">
                              <a 
                                href={article.url || article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm font-medium block mb-1"
                              >
                                {article.title}
                              </a>
                              <Typography.Text type="secondary" className="text-xs">
                                {article.sourceTitle}
                              </Typography.Text>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                  
                  {/* Gợi ý thông minh sau mỗi câu trả lời của bot */}
                  {msg.suggestions && msg.suggestions.length > 0 && msg.type === 'bot' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, idx) => (
                        <Tag
                          key={idx}
                          color="geekblue"
                          className="cursor-pointer hover:opacity-80"
                          icon={<SearchOutlined />}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {msg.articles && msg.articles.length === 0 && msg.type === 'bot' && (
                    <div className="mt-2 text-sm text-gray-500">
                      Không tìm thấy bài viết phù hợp.
                    </div>
                  )}
                </div>
                {msg.type === 'user' && (
                  <Avatar icon={<UserOutlined />} className="ml-2 bg-gray-200 text-blue-500" />
                )}
              </div>
            ))}
            {/* Hiệu ứng typing */}
            {isTyping && (
              <div className="flex items-center mb-4">
                <Avatar icon={<RobotOutlined />} className="mr-2 bg-blue-100 text-blue-600" />
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Spin size="small" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {/* Gợi ý tìm kiếm ban đầu */}
            {showSuggestions && (
              <div className="mt-4">
                <Typography.Text type="secondary" className="block mb-2">
                  Gợi ý tìm kiếm:
                </Typography.Text>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <Tag
                      key={index}
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={() => handleSend()}
              placeholder="Nhập tin nhắn..."
              disabled={loading}
              suffix={
                <Button
                  type="text"
                  icon={<AudioOutlined />}
                  onClick={handleVoiceInput}
                  className="hover:text-blue-500"
                />
              }
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              loading={loading}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

export default ChatBot; 