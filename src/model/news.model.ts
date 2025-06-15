export interface Item {
  title: string;
  content: string;
  contentSnippet: string;
  enclosure: {
    length: string;
    type: string;
    url: string;
  };
  guid: string;
  isoDate: string;
  link: string;
  pubDate: string;
}
export interface INews {
  id: string | number;
  title: string;
  description?: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  category?: string;
  url?: string;
  imageUrl?: string;
  source?: string;
  sourceTitle?: string;
  newsId: string;
  image: {
    link: string;
    title: string;
    url: string;
  };
  generator: string;
  items: Item[];
  link: string;
  pubDate: string;
}