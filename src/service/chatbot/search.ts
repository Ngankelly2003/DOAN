import { INews } from '@/model/news.model';
import { LatestNews, LatestNews_Business, LatestNews_Sport, LatestNews_Science, LatestNews_Entertainment } from '@/service/store/news/news.api';

interface SearchParams {
  topics: string[];
  keywords: string[];
  limit?: number;
  page?: number;
}

export async function searchArticles({
  topics,
  keywords,
  limit = 5,
  page = 1
}: SearchParams): Promise<INews[]> {
  try {
    console.log('Searching articles with:', { topics, keywords });
    
    // Láº¥y dá»¯ liá»‡u tá»« cÃ¡c nguá»"n RSS phÃ¹ há»£p vá»›i topics
    const newsSources = await getRelevantNewsSources(topics);
    
    // Táº¡o tá»« khÃ³a tÃ¬m kiáº¿m tá»« topics vÃ  keywords
    const searchTerms = [...topics, ...keywords].map(term => term.toLowerCase());
    console.log('Search terms:', searchTerms);
    
    // TÃ¬m kiáº¿m trong táº¥t cáº£ bÃ i viáº¿t
    const relevantArticles = findRelevantArticles(newsSources, searchTerms);
    
    // Sáº¯p xáº¿p theo Ä'á»™ liÃªn quan vÃ  giá»›i háº¡n káº¿t quáº£
    const rankedArticles = rankArticlesByRelevance(relevantArticles, searchTerms);
    
    // PhÃ¢n trang vÃ  giá»›i háº¡n sá»' lÆ°á»£ng
    const startIndex = (page - 1) * limit;
    const result = rankedArticles.slice(startIndex, startIndex + limit);
    
    console.log(`Found ${relevantArticles.length} relevant articles, returning ${result.length}`);
    return result;
    
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

// Láº¥y nguá»"n tin tá»©c phÃ¹ há»£p vá»›i chá»§ Ä'á»
async function getRelevantNewsSources(topics: string[]): Promise<any[]> {
  const allSources = [];
  let foundByTopic = false;
  
  try {
    // Luôn lấy tin tức mới nhất
    const latestNews = await LatestNews();
    if (latestNews) allSources.push(...latestNews);
    console.log('[DEBUG] LatestNews count:', latestNews ? latestNews.length : 0);
    
    // Lấy theo từng chủ đề cụ thể
    for (const topic of topics) {
      const lowerTopic = topic.toLowerCase();
      
      if (lowerTopic.includes('thể thao') || lowerTopic.includes('bóng đá') || lowerTopic.includes('sport')) {
        const sportNews = await LatestNews_Sport();
        console.log('[DEBUG] LatestNews_Sport count:', sportNews ? sportNews.length : 0);
        if (sportNews && sportNews.length > 0) {
          allSources.push(...sportNews);
          foundByTopic = true;
        }
      }
      
      if (lowerTopic.includes('kinh doanh') || lowerTopic.includes('kinh tế') || lowerTopic.includes('business')) {
        const businessNews = await LatestNews_Business();
        console.log('[DEBUG] LatestNews_Business count:', businessNews ? businessNews.length : 0);
        if (businessNews && businessNews.length > 0) {
          allSources.push(...businessNews);
          foundByTopic = true;
        }
      }
      
      if (lowerTopic.includes('công nghệ') || lowerTopic.includes('khoa học') || lowerTopic.includes('science')) {
        const scienceNews = await LatestNews_Science();
        console.log('[DEBUG] LatestNews_Science count:', scienceNews ? scienceNews.length : 0);
        if (scienceNews && scienceNews.length > 0) {
          allSources.push(...scienceNews);
          foundByTopic = true;
        }
      }
      
      if (lowerTopic.includes('giải trí') || lowerTopic.includes('entertainment')) {
        const entertainmentNews = await LatestNews_Entertainment();
        console.log('[DEBUG] LatestNews_Entertainment count:', entertainmentNews ? entertainmentNews.length : 0);
        if (entertainmentNews && entertainmentNews.length > 0) {
          allSources.push(...entertainmentNews);
          foundByTopic = true;
        }
      }
    }
    
    // Nếu không tìm thấy nguồn theo chủ đề, fallback sang toàn bộ nguồn LatestNews
    if (!foundByTopic && (!allSources || allSources.length === 0)) {
      const fallbackNews = await LatestNews();
      console.log('[DEBUG] Fallback LatestNews count:', fallbackNews ? fallbackNews.length : 0);
      if (fallbackNews) allSources.push(...fallbackNews);
    }
    
    console.log('[DEBUG] Tổng số nguồn tin lấy được:', allSources.length);
    if (allSources.length > 0) {
      console.log('[DEBUG] Ví dụ 1 nguồn:', allSources[0]);
    }
    return allSources;
  } catch (error) {
    console.error('Error fetching news sources:', error);
    return [];
  }
}

// TÃ¬m cÃ¡c bÃ i viáº¿t liÃªn quan
function findRelevantArticles(newsSources: any[], searchTerms: string[]): INews[] {
  const articles: INews[] = [];
  console.log('[DEBUG] Tổng số nguồn truyền vào:', newsSources.length);
  console.log('[DEBUG] Search terms:', searchTerms);

  
  newsSources.forEach(source => {
    if (source && source.items) {
      source.items.forEach((item: any, index: number) => {
        const title = (item.title || '').toLowerCase();
        const content = (item.contentSnippet || item.content || '').toLowerCase();
        const isAllMatch = searchTerms.every(term => title.includes(term) || content.includes(term));
        if (isAllMatch) {
          articles.push({
            id: item.guid || `${source.title}-${index}`,
            title: item.title || '',
            description: item.contentSnippet || item.content || '',
            content: item.content || item.contentSnippet || '',
            url: item.link || '',
            imageUrl: item.enclosure?.url || '',
            source: source.title || 'RSS Feed',
            createdAt: new Date(item.pubDate || item.isoDate),
            newsId: item.guid || `${source.title}-${index}`,
            image: {
              link: item.enclosure?.url || '',
              url: item.enclosure?.url || '',
              title: item.title || ''
            },
            generator: source.generator || 'RSS',
            items: [],
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || new Date().toISOString()
          });
        }
      });
    }
  });
  console.log('[DEBUG] Số bài viết khớp tất cả từ khóa:', articles.length);

  if (articles.length === 0 && searchTerms.length > 0) {
    newsSources.forEach(source => {
      if (source && source.items) {
        source.items.forEach((item: any, index: number) => {
          const title = (item.title || '').toLowerCase();
          const content = (item.contentSnippet || item.content || '').toLowerCase();
          const isAnyMatch = searchTerms.some(term => title.includes(term) || content.includes(term));
          if (isAnyMatch) {
            articles.push({
              id: item.guid || `${source.title}-${index}`,
              title: item.title || '',
              description: item.contentSnippet || item.content || '',
              content: item.content || item.contentSnippet || '',
              url: item.link || '',
              imageUrl: item.enclosure?.url || '',
              source: source.title || 'RSS Feed',
              createdAt: new Date(item.pubDate || item.isoDate),
              newsId: item.guid || `${source.title}-${index}`,
              image: {
                link: item.enclosure?.url || '',
                url: item.enclosure?.url || '',
                title: item.title || ''
              },
              generator: source.generator || 'RSS',
              items: [],
              link: item.link || '',
              pubDate: item.pubDate || item.isoDate || new Date().toISOString()
            });
          }
        });
      }
    });
    console.log('[DEBUG] Số bài viết khớp bất kỳ từ khóa:', articles.length);
  }

  if (articles.length === 0) {
    newsSources.forEach(source => {
      if (source && source.items) {
        source.items.forEach((item: any, index: number) => {
          articles.push({
            id: item.guid || `${source.title}-${index}`,
            title: item.title || '',
            description: item.contentSnippet || item.content || '',
            content: item.content || item.contentSnippet || '',
            url: item.link || '',
            imageUrl: item.enclosure?.url || '',
            source: source.title || 'RSS Feed',
            createdAt: new Date(item.pubDate || item.isoDate),
            newsId: item.guid || `${source.title}-${index}`,
            image: {
              link: item.enclosure?.url || '',
              url: item.enclosure?.url || '',
              title: item.title || ''
            },
            generator: source.generator || 'RSS',
            items: [],
            link: item.link || '',
            pubDate: item.pubDate || item.isoDate || new Date().toISOString()
          });
        });
      }
    });
    console.log('[DEBUG] Số bài viết fallback (mới nhất):', articles.length);
  }

  if (articles.length > 0) {
    console.log('[DEBUG] Ví dụ bài viết đầu tiên:', articles[0]);
  }

  return articles;
}

function calculateRelevanceScore(article: any, searchTerms: string[]): number {
  let score = 0;
  
  const title = (article.title || '').toLowerCase();
  const content = (article.contentSnippet || article.content || '').toLowerCase();
  
  searchTerms.forEach(term => {
    if (title.includes(term)) {
      score += 3;
    }
    
   
    if (content.includes(term)) {
      score += 1;
    }
   
    const titleMatches = (title.match(new RegExp(term, 'g')) || []).length;
    const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
    
    score += titleMatches * 2;
    score += contentMatches * 0.5;
  });
  
  return score;
}

// Sáº¯p xáº¿p bÃ i viáº¿t theo Ä'á»™ liÃªn quan
export function rankArticlesByRelevance(articles: INews[], searchTerms: string[]): INews[] {
  return articles.sort((a, b) => {
    const scoreA = calculateRelevanceScore({
      title: a.title,
      contentSnippet: a.description,
      content: a.content 
    }, searchTerms);
    
    const scoreB = calculateRelevanceScore({
      title: b.title,
      contentSnippet: b.description,
      content: b.content 
    }, searchTerms);
    

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    const dateA = new Date(a.pubDate || 0).getTime();
    const dateB = new Date(b.pubDate || 0).getTime();
    return dateB - dateA;
  });
} 