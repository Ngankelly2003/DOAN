import { faEye } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import React, { ReactNode } from "react";
import icon_zalo from "@/assets/img/icon_zalo.png";
import Image from "next/image";
import { useTheme } from "@/app/(provider)/ThemeProvider";
import { KEYS_STORAGE } from "@/service/host";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { Feed } from "@/model/rss";

export const HeadingPage = ({
  icon,
  title,
  path,
}: {
  icon?: ReactNode;
  title: string;
  path?: string;
  breadcrumb?: BreadcrumbItemType[];
}) => {
  const { themeData } = useTheme();
  return (
    <>
      {/*<div className={'mb-4'}>{breadcrumb && <Breadcrumb breadcrumb={breadcrumb} />}</div>*/}
      <div className="flex items-center gap-3 mb-[10px]">
        {icon}
        <div
          // link={path}
          className="uppercase text-[20px] md:text-[20px] lg:text-[24px] font-medium cursor-pointer"
          style={{ color: themeData.colorPrimary }}
        >
          {title}
        </div>
      </div>
    </>
  );
};

export const DescriptionDateTime = ({ data }: { data: any }) => {
  const { themeData, setCurrentTheme } = useTheme();
  return (
    <div
      className="flex items-center gap-1"
      style={{
        color: `${themeData.colorTextSecondary}`,
      }}
    >
      <FontAwesomeIcon icon={faEye} />
      <span className="text-[14px]">
        ngày: {dayjs(data).format("DD/MM/YYYY")}
      </span>
    </div>
  );
};

export const DescriptionTimeViewCount = ({
  data,
  margin,
}: {
  data: any;
  margin?: string;
}) => {
  const { themeData, setCurrentTheme } = useTheme();
  return (
    <div
      className={`text-[14px] ${
        margin ? margin : "my-2"
      } flex items-center justify-between font-quicksand-semibold`}
    >
      <DescriptionDateTime
        data={data?.displayTime ?? data?.publishTime ?? data?.createTime}
      />
    </div>
  );
};

export type BreadcrumbItemType = { label: string; path?: string };

export function processContent(content: any) {
  if (!content) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  doc.querySelectorAll("img").forEach((img) => {
    const dataSrc = img.getAttribute("data-src");
    if (dataSrc) {
      img.setAttribute("src", dataSrc);
      img.removeAttribute("data-src");
    }
    img.removeAttribute("loading");
  });

  return doc.body.innerHTML;
}

export const ZaloShareButton = () => {
  const handleZaloShare = () => {
    window.open(`https://id.zalo.me/`, "_blank");
  };

  return (
    <button onClick={handleZaloShare}>
      <Image
        src={icon_zalo}
        alt={"icon zalo"}
        width={18}
        height={20}
        className="sm:w-[22px] sm:h-[24px] cursor-pointer"
      />
    </button>
  );
};

export default ZaloShareButton;

export const setDataStorage = (Key: string, value?: any): boolean => {
  try {
    if (value) {
      localStorage.setItem(Key, JSON.stringify(value));
    } else {
      localStorage.removeItem(Key);
    }
    return true;
  } catch (error) {
    console.log("Error saving data storage");
    return false;
  }
};

export const setDataCookie = (name: KEYS_STORAGE, value?: any): boolean => {
  try {
    if (value) {
      setCookie(name, JSON.stringify(value));
    } else {
      deleteCookie(name);
    }
    return true;
  } catch (error) {
    console.log("Error saving cookie");
    return false;
  }
};

export const getDataCookie = (name: KEYS_STORAGE) => {
  try {
    const data = getCookie(name);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error retrieving data cookie");
  }
};

export const transformDataRss = (data: any): Feed => {
  return {
    items: data.item.map((item: any) => ({
      title: item.title,
      link: item?.link,
      pubDate: item?.pubDate,
      enclosure: {
        type: item.enclosure ? item.enclosure.type : "image/jpeg",
        length: item.enclosure ? item.enclosure.length : "1200",
        url: item.enclosure ? item.enclosure.url : "",
      },
      content: item.description,
      contentSnippet: item.description.replace(/<.*?>/g, ""), // remove HTML tags
      guid: item.guid,
      isoDate: new Date(item.pubDate).toISOString(),
    })),
    image: {
      link: data.image?.link,
      url: data.image?.url,
      title: data.image?.title,
    },
    title: data.title,
    description: data.description,
    pubDate: data.pubDate,
    generator: data.generator,
    link: data.link,
  };
};

export const processRSSData = (rssSources: any) => {
  const allArticles = rssSources?.flatMap((source: any) =>
    source.items.map((item: any) => ({
      ...item,
      sourceTitle: source.title,
      pubDate: new Date(item.pubDate),
    }))
  );

  allArticles?.sort((a: any, b: any) => b.pubDate - a.pubDate);

  const uniqueArticles = allArticles?.reduce((acc: any, current: any) => {
    const x = acc?.find((item: any) => item.title === current.title);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  return uniqueArticles;
};

export const getArticleSegment = (articles: any, start: any, end: any) => {
  return articles?.slice(start, end);
};

export const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};
