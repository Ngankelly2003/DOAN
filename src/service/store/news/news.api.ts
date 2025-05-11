import { transformDataRss } from "@/shared/utils/ultils";

export const LatestNews = async () => {
  try {
    const response = await fetch("/api/rss/latest");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_New = async () => {
  try {
    const response = await fetch("/api/rss/news");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_World = async () => {
  try {
    const response = await fetch("/api/rss/world");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Business = async () => {
  try {
    const response = await fetch("/api/rss/business");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Entertainment = async () => {
  try {
    const response = await fetch("/api/rss/entertainment");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Toursm = async () => {
  try {
    const response = await fetch("/api/rss/toursm");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Life = async () => {
  try {
    const response = await fetch("/api/rss/life");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Science = async () => {
  try {
    const response = await fetch("/api/rss/science");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Education = async () => {
  try {
    const response = await fetch("/api/rss/education");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_confide = async () => {
  try {
    const response = await fetch("/api/rss/confide");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};

export const LatestNews_Sport = async () => {
  try {
    const response = await fetch("/api/rss/sport");

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const { data } = await response.json();

    return data.map((item: any) => transformDataRss(item?.rss?.channel));
  } catch (error) {
    console.error("Lỗi khi tải RSS abc:", error);
  }
};
