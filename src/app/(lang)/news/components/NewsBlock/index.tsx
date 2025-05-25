"use client";
import React from "react";
import CustomImage from "@/components/custom/CustomImage";
import { DescriptionDateTime } from "@/shared/utils/ultils";
import { Item } from "@/model/news.model";
import { useTheme } from "@/app/(provider)/ThemeProvider";

type MostReadNewsProps = {
  heading: string;
  processedNews: any;
};

export default function MostReadNews(props: MostReadNewsProps) {
  const { heading, processedNews } = props;

  const { themeData, setCurrentTheme } = useTheme();

  return (
    <div
      className="p-[16px]"
      style={{ backgroundColor: themeData.colorInfoBg }}
    >
      <div>
        <p
          className="pb-[10px] font-bold"
          style={{ color: themeData.colorPrimary }}
        >
          {heading}
        </p>
      </div>
      <div className="flex flex-col items-start gap-3">
        {processedNews?.length > 0 ? (
          processedNews?.map((ele: Item, index: number) => (
            <div key={index} className="flex gap-2 grow w-full">
              <div
                className="w-[100px] shrink-0"
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
                  <CustomImage src={ele?.enclosure?.url || ""} rate={"16:9"} />
                </div>
              </div>
              <div className="grow w-full">
                <p
                  className="text-[14px] cursor-pointer font-semibold overflow-hidden md:line-clamp-3 text-hover"
                  style={
                    {
                      "--color": themeData.colorTextPrimary,
                      "--hover-color": themeData.colorPrimary,
                    } as React.CSSProperties
                  }
                >
                  {ele?.title}
                </p>
                <div
                  className={
                    "text-[12px] flex items-center justify-between font-quicksand-semibold"
                  }
                >
                  <DescriptionDateTime data={ele.isoDate} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[14px] w-full text-center">không có dữ liệu</div>
        )}
      </div>
    </div>
  );
}
