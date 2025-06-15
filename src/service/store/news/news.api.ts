import { transformDataRss } from "@/shared/utils/ultils";

const getBaseUrl = () => {
  const isServer = typeof window === "undefined";
  return isServer ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000" : "";
};

export const LatestNews = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/latest`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_New = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/news`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_World = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/world`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Business = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/business`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Entertainment = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/entertainment`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Toursm = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/toursm`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Life = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/life`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Science = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/science`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Education = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/education`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_confide = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/confide`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};

export const LatestNews_Sport = async () => {
  try {
    const response = await fetch(`${getBaseUrl()}/api/rss/sport`);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();
    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
    return [];
  }
};
