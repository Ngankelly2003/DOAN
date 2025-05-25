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
  title: string;
  newsId: string;
  image: {
    link: string;
    title: string;
    url: string;
  };
  generator: string;
  description: string;
  items: Item[];
  link: string;
  pubDate: string;
}
