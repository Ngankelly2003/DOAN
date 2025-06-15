import ChatBot from "@/components/chat/ChatBot";


export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Chat với AI Assistant</h1>
        <div className="h-[600px]">
          <ChatBot />
        </div>
      </div>
    </div>
  );
} 