import { Item } from "@/model/news.model";
import React from "react";
import CustomImage from "../custom/CustomImage";
import { decodeHtmlEntities, DescriptionDateTime } from "@/shared/utils/ultils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { useTheme } from "@/app/(provider)/ThemeProvider";
import Link from "next/link";

type CardLargeItem = {
  data?: Item;
  className?: string;
  page?: boolean;
};

export default function CardLargeItem(props: CardLargeItem) {
  const { data, page = false } = props;
  const { themeData, setCurrentTheme } = useTheme();

  return (
    <>
      {data && (
        <Link href={data.link || data.guid} target="_blank">
          <div className={`card-item cursor-pointer`}>
            <div
              className="w-full shrink-0"
              style={{
                overflow: "hidden",
              }}
            >
              <div
                className="cursor-pointer shrink-0"
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
                style={{
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <CustomImage src={data?.enclosure?.url || ""} rate={"16:9"} />
              </div>
            </div>
            <div
              className={`py-[12px] ${page && "px-[14px]"}`}
              style={{ background: themeData.bgColor }}
            >
              <p
                className="font-bold text-ellipsis overflow-hidden hover:opacity-80 text-[22px] text-hover"
                // style={
                //   {
                //     "--hover-color": themeData.colorPrimary,
                //     "--color": themeData.colorTextPrimary,
                //   } as React.CSSProperties
                // }
                style={{ color: themeData.colorPrimary }}
              >
                {decodeHtmlEntities(data?.title) || ""}
              </p>
              <div
                className={
                  "text-[14px] my-2 mt-2 flex items-center justify-between font-quicksand-semibold"
                }
              >
                <DescriptionDateTime data={data?.isoDate ?? data?.pubDate} />
                <div className="flex items-center ">
                  <FontAwesomeIcon icon={faEye} className={"text-[12px]"} />
                  <span className="ml-1">{0}</span>
                </div>
              </div>
              <span
                className={
                  "card-desc text-ellipsis overflow-hidden md:line-clamp-3 mt-2 font-quicksand-medium"
                }
              >
                {decodeHtmlEntities(data?.contentSnippet) || ""}
              </span>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
