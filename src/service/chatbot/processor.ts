import { generateGeminiResponse, createSystemPrompt } from './gemini.config';

interface ChatBotResponse {
  intent: 'search' | 'chat';
  topics: string[];
  keywords: string[];
  response: string;
  suggestions: string[];
  searchDescription?: string;
  context?: string;
}

export async function processUserQuery(message: string): Promise<ChatBotResponse> {
  try {
    // Tạo prompt với instruction rõ ràng
    const fullMessage = `${createSystemPrompt()}\n\nCâu hỏi của người dùng: "${message}"`;
    
    // Gọi Gemini API
    const response = await generateGeminiResponse(fullMessage);
    console.log('Raw Gemini response:', response);

    // Làm sạch response (loại bỏ markdown hoặc text thừa)
    let cleanResponse = response.trim();
    
    // Nếu response có ```json, loại bỏ nó
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
    }
    
    // Nếu response có ```{, loại bỏ nó
    if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    // Parse JSON response
    try {
      const parsedResponse = JSON.parse(cleanResponse);
      
      return {
        intent: parsedResponse.intent,
        topics: Array.isArray(parsedResponse.topics) ? parsedResponse.topics : [],
        keywords: Array.isArray(parsedResponse.keywords) ? parsedResponse.keywords : [],
        response: typeof parsedResponse.response === 'string' ? parsedResponse.response : "Tôi đã hiểu câu hỏi của bạn!",
        suggestions: Array.isArray(parsedResponse.suggestions) ? parsedResponse.suggestions : [],
        searchDescription: parsedResponse.searchDescription,
        context: parsedResponse.context
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.log('Cleaned response that failed to parse:', cleanResponse);
      
      // Nếu không parse được JSON, tạo response mặc định dựa trên message
      const defaultTopics = extractTopicsFromMessage(message);
      const defaultKeywords = extractKeywordsFromMessage(message);
      
      return {
        intent: 'chat',
        topics: defaultTopics,
        keywords: defaultKeywords,
        response: typeof response === 'string' ? response : "Tôi sẽ tìm kiếm thông tin liên quan đến câu hỏi của bạn!",
        suggestions: [],
        searchDescription: undefined,
        context: undefined
      };
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return {
      intent: 'chat',
      topics: [],
      keywords: [],
      response: `Xin lỗi, có lỗi khi kết nối với AI: ${error.message}`,
      suggestions: [],
      searchDescription: undefined,
      context: undefined
    };
  }
}

// Hàm hỗ trợ trích xuất topics từ message
function extractTopicsFromMessage(message: string): string[] {
  const topics = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('thể thao') || lowerMessage.includes('bóng đá') || lowerMessage.includes('tennis')) {
    topics.push('thể thao');
  }
  if (lowerMessage.includes('kinh tế') || lowerMessage.includes('chứng khoán') || lowerMessage.includes('tài chính')) {
    topics.push('kinh tế');
  }
  if (lowerMessage.includes('công nghệ') || lowerMessage.includes('ai') || lowerMessage.includes('điện tử')) {
    topics.push('công nghệ');
  }
if (lowerMessage.includes('chính trị') || lowerMessage.includes('chính phủ')) {
    topics.push('chính trị');
  }
  
  return topics.length > 0 ? topics : ['tin tức'];
}

// Hàm hỗ trợ trích xuất keywords từ message
function extractKeywordsFromMessage(message: string): string[] {
  // Tách từ và lọc những từ quan trọng
  const words = message.toLowerCase().split(/\s+/);
  const stopWords = ['tôi', 'muốn', 'biết', 'về', 'của', 'và', 'có', 'là', 'trong', 'với'];
  
  return words.filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    !/^\d+$/.test(word)
  ).slice(0, 5);
}