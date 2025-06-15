import axios from 'axios';

interface NewsApiResponse {
  articles: Article[];
  status: string;
  totalResults: number;
}

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

const NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // Thay thế bằng API key của bạn
const NEWS_API_URL = 'https://newsapi.org/v2';

export const searchNews = async (query: string, limit: number = 5) => {
  try {
    const response = await axios.get<NewsApiResponse>(`${NEWS_API_URL}/everything`, {
      params: {
        q: query,
        language: 'vi',
        sortBy: 'publishedAt',
        pageSize: limit,
        apiKey: NEWS_API_KEY
      }
    });

    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      sourceName: article.source.name
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}; 