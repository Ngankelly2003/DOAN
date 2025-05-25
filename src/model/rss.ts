export interface Enclosure {
  type: string;
  length: string;
  url: string;
}

export interface Item {
  title: string;
  link: string;
  pubDate: string;
  enclosure: Enclosure;
  content: string;
  contentSnippet: string;
  guid: string;
  isoDate: string;
}

export interface Image {
  link: string;
  url: string;
  title: string;
}

export interface Feed {
  items: Item[];
  image: Image;
  title: string;
  description: string;
  pubDate: string;
  generator: string;
  link: string;
}
