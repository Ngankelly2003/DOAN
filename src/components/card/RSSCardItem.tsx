import React from "react";
import CustomImage from "../custom/CustomImage";
import {
  decodeHtmlEntities,
  DescriptionTimeViewCount,
} from "@/shared/utils/ultils";
import { Item } from "@/model/news.model";
import { FormCardItem } from "@/shared/home/News/ViewLayout/form";
import { useTheme } from "@/app/(provider)/ThemeProvider";
import Link from "next/link";

type CardItemProps = {
  data: Item;
  className?: string;
  vertical?: boolean;
  formCard?: FormCardItem;
  horizontalLines?: boolean;
  page?: boolean;
};

const CardItem: React.FC<CardItemProps> = ({
  data,
  className = "p-0",
  page = false,
  horizontalLines = true,
  vertical,
  formCard,
}) => {
  const { themeData } = useTheme();

  const getFlexDirection = () => {
    if (formCard === FormCardItem.COL_REVERSE) return "flex-col-reverse";
    if (formCard === FormCardItem.ROW_REVERSE) return "flex-row-reverse";
    return vertical
      ? "flex-col"
      : "flex-col sm:flex-col md:flex-row lg:flex-row";
  };

  return (
    <>
    <div className="text-pink-500 text-[13px]">{data?.sourceTitle}</div>
    <Link href={data.link || data.guid} target="_blank">
      <div
        style={{ borderBottom: `${horizontalLines ? "1px solid #eee" : ""}` }}
        className={`card-item flex ${getFlexDirection()} items-start justify-center gap-3 cursor-pointer mb-[12px] ${className}`}
      >
        <div
          className={`w-full h-full shrink-0 ${
            !vertical
              ? "md:w-[120px] xl:w-[100px] w-full h-full"
              : "w-full h-full"
          } ${
            page ? "md:w-[190px] xl:w-[190px]" : "md:w-[120px] xl:w-[100px]"
          }`}
          style={{
            overflow: "hidden",
          }}
        >
          <div
            className="cursor-pointer shrink-0"
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              transition: "all 0.3s ease-in-out",
            }}
          >
            <CustomImage
              src={data?.enclosure?.url || ""}
              rate={vertical ? "16:9" : "4:3"}
            />
          </div>
        </div>
        <div className="w-full" style={{ background: themeData.bgColor }}>
          <div
            className="text-[16px] font-bold overflow-hidden md:line-clamp-2 text-hover"
            style={{ color: themeData?.colorPrimary }}
          >
            {decodeHtmlEntities(data?.title) || ""}
          </div>
          {formCard !== FormCardItem.NO_DATE && (
            <div className="text-[14px] font-semibold flex items-center justify-between font-quicksand-semibold">
              <DescriptionTimeViewCount data={data?.isoDate} />
            </div>
          )}
          <span className="text-[14px] text-ellipsis overflow-hidden md:line-clamp-3 font-quicksand-medium">
            {decodeHtmlEntities(data?.contentSnippet) || ""}
          </span>
        </div>
      </div>
    </Link>
    </>
  );
};

export default CardItem;
