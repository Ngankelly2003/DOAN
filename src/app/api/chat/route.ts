import { NextResponse } from 'next/server';
import { processUserQuery } from '@/service/chatbot/processor';
import { LatestNews } from '@/service/store/news/news.api';
import { processRSSData } from '@/shared/utils/ultils';

interface NewsItem {
  title: string;
  link: string;
  id: string;
  sourceTitle?: string;
  description?: string;
  contentSnippet?: string;
  enclosure?: {
    url: string;
    type: string;
    length: string;
  };
  isoDate?: string;
  pubDate?: string;
  guid?: string;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log('API - Received message:', message);

    // Xử lý message bằng Gemini
    const chatbotResponse = await processUserQuery(message);
    console.log('API - Processed query result:', chatbotResponse);

    let suggestedArticles: NewsItem[] = [];

    try {
      // Lấy tin tức mới nhất
      const data = await LatestNews();
      console.log('API - Latest news available:', data?.length || 0);

      if (data && data.length > 0) {
        // Xử lý dữ liệu RSS giống như trong SearchPage
        const processedNews = processRSSData(data);
        console.log('API - Processed news items:', processedNews?.length || 0);

        if (processedNews && processedNews.length > 0) {
          // Xử lý và chuẩn hóa query
          const cleanMessage = message.toLowerCase()
            .replace(/tin tức về/gi, '')
            .replace(/tin tức/gi, '')
            .replace(/tìm kiếm/gi, '')
            .replace(/tin về/gi, '')
            .replace(/thông tin về/gi, '')
            .replace(/tìm tin/gi, '')
            .replace(/tìm/gi, '')
            .replace(/có tin gì về/gi, '')
            .replace(/tôi muốn đọc tin về/gi, '')
            .trim();
            
          // Tạo query từ keywords, topics và message đã được làm sạch
          const searchTerms: string[] = [
            ...chatbotResponse.keywords,
            ...chatbotResponse.topics,
            cleanMessage, 
            ...cleanMessage.split(/\s+/).filter((term: string) => term.length > 2)
          ];
          
          // Loại bỏ từ trùng lặp và từ ngừng
          const stopWords = ['tin', 'tức', 'về', 'các', 'những', 'của', 'và', 'với', 'mới', 'nhất'];
          const uniqueTerms = Array.from(new Set(searchTerms))
            .filter((term: string) => term && term.length > 1 && !stopWords.includes(term));
            
          console.log('API - Search terms:', uniqueTerms);
          
          // Tìm kiếm từng term trong title và description
          const results = processedNews.map((item: NewsItem) => {
            if (!item || !item.title) return null;
            
            const title = item.title.toLowerCase();
            const description = (item.contentSnippet || item.description || '').toLowerCase();
            
            // Tính điểm phù hợp
            let score = 0;
            let matched = false;
            
            // Tìm kiếm cả cụm từ gốc (sau khi làm sạch)
            if (cleanMessage && (title.includes(cleanMessage) || description.includes(cleanMessage))) {
              score += 3; // Ưu tiên cao nhất cho cụm từ chính xác
              matched = true;
            }
            
            // Tìm kiếm từng term riêng lẻ
            uniqueTerms.forEach(term => {
              if (title.includes(term)) {
                score += 2; // Title match có trọng số cao hơn
                matched = true;
              }
              if (description.includes(term)) {
                score += 1; // Description match có trọng số thấp hơn
                matched = true;
              }
            });
            
            // Kiểm tra từ khóa đặc biệt như "du lịch"
            const specialKeywords = ["du lịch", "thể thao", "kinh doanh", "giáo dục", "khoa học", "công nghệ"];
            for (const keyword of specialKeywords) {
              if (cleanMessage.includes(keyword) && (title.includes(keyword) || description.includes(keyword))) {
                score += 2;
                matched = true;
              }
            }
            
            return matched ? { ...item, score } : null;
          }).filter(Boolean);
          
          console.log('API - Found articles:', results.length);
          
          // Sắp xếp theo điểm số và lấy số lượng kết quả phù hợp
          const resultLimit = chatbotResponse.intent === 'search' ? 10 : 5;
          const sortedResults = results
            .sort((a: any, b: any) => b.score - a.score)
            .slice(0, resultLimit);
            
          suggestedArticles = sortedResults.map((item: any) => ({
            title: item.title || '',
            link: item.link || item.guid || '',
            id: item.guid || item.link || '',
            sourceTitle: item.sourceTitle || 'Tin tức',
            description: item.contentSnippet || item.description || '',
            enclosure: {
              url: item.enclosure?.url || '',
              type: item.enclosure?.type || 'image/jpeg',
              length: item.enclosure?.length || '1200'
            },
            isoDate: item.isoDate || new Date().toISOString(),
            pubDate: item.pubDate || new Date().toISOString()
          }));
        }
      }
    } catch (searchError) {
      console.error('API - Error during article search:', searchError);
    }

    // Trả về kết quả
    const result = {
      success: true,
      data: {
        intent: chatbotResponse.intent,
        response: chatbotResponse.response,
        suggestedArticles: suggestedArticles || [],
        suggestions: chatbotResponse.suggestions || [],
        searchDescription: chatbotResponse.searchDescription || null,
        context: chatbotResponse.context || null
      }
    };
    console.log('API - Returning result with articles:', result.data.suggestedArticles.length);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        data: {
          intent: 'chat',
          response: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn.',
          suggestedArticles: [],
          suggestions: ['Thử lại sau', 'Đặt câu hỏi khác', 'Tìm kiếm thủ công'],
          searchDescription: null,
          context: null
        }
      },
      { status: 500 }
    );
  }
} 