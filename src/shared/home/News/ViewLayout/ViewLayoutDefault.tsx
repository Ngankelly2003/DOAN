"use client";
import React, { useEffect, useState } from "react";
import CenterNews from "../CenterNews";
import LeftNews from "../LeftNews";
import { FormCardItem } from "./form";
import { LatestNews } from "@/service/store/news/news.api";
import { getArticleSegment, processRSSData } from "@/shared/utils/ultils";

const ViewLayoutDefault = () => {
  const [processedNews, setProcessedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await LatestNews();
        const processedData = processRSSData(data);
        setProcessedNews(processedData);
        setLoading(false);
      } catch (error) {
        setLoading(true);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {!loading && processedNews && (
        <>
          {/* Section 1 */}
          <div
            className="flex gap-2 mt-2"
            style={{ borderBottom: "4px solid #f1f1f1" }}
          >
            <div className="w-1/5">
              <LeftNews
                datas={getArticleSegment(processedNews, 0, 2)}
                size={2}
                vertical={true}
                page={true}
              />
            </div>
            <div className="flex-1">
              <CenterNews datas={getArticleSegment(processedNews, 2, 3)} />
            </div>
            <div className="w-1/4">
              <LeftNews
                form={FormCardItem.ROW_REVERSE}
                datas={getArticleSegment(processedNews, 3, 7)}
              />
            </div>
          </div>

          {/* Section 2 */}
          <div
            className="flex flex-col sm:flex-row gap-2 mt-2 p-2"
            style={{ borderBottom: "4px solid #f1f1f1" }}
          >
            <div className="w-2/6">
              <LeftNews
                datas={getArticleSegment(processedNews, 7, 12)}
                size={5}
                classname="pr-[10px] md:border-r md:border-gray-200"
                vertical={true}
                page={true}
              />
            </div>
            <div className="w-2/5">
              <LeftNews
                datas={getArticleSegment(processedNews, 12, 20)}
                size={8}
                classname="md:border-r md:border-gray-200"
              />
            </div>

            <div style={{ width: "36%" }}>
              <LeftNews
                datas={getArticleSegment(processedNews, 48, 56)}
                size={8}
                classname="md:border-r md:border-gray-200"
              />
            </div>
          </div>

          {/* Section 3 */}
          <div
            className="flex gap-2 mt-2 p-2"
            style={{ borderBottom: "4px solid #f1f1f1" }}
          >
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="w-1/4">
                <LeftNews
                  datas={getArticleSegment(
                    processedNews,
                    20 + index * 6,
                    20 + (index + 1) * 6
                  )}
                  size={6}
                  classname={`pr-[10px] ${
                    index < 3 ? "md:border-r md:border-gray-200" : ""
                  }`}
                  vertical={true}
                  page={true}
                />
              </div>
            ))}
          </div>

          {/* Section 4 */}
          <div
            className="flex gap-2 mt-2"
            style={{ borderBottom: "4px solid #f1f1f1" }}
          >
            <div className="w-1/5">
              <LeftNews
                datas={getArticleSegment(processedNews, 42, 44)}
                size={2}
                vertical={true}
                page={true}
              />
            </div>
            <div className="flex-1">
              <CenterNews datas={getArticleSegment(processedNews, 44, 45)} />
            </div>
            <div className="w-1/4">
              <LeftNews
                form={FormCardItem.ROW_REVERSE}
                datas={getArticleSegment(processedNews, 45, 49)}
                size={4}
              />
            </div>
          </div>

          {/* Section 5 */}
          <div
            className="flex gap-2 mt-2"
            style={{ borderBottom: "4px solid #f1f1f1" }}
          >
            <div className="w-1/5">
              <LeftNews
                datas={getArticleSegment(processedNews, 49, 51)}
                size={2}
                vertical={true}
                page={true}
              />
            </div>
            <div className="flex-1">
              <CenterNews datas={getArticleSegment(processedNews, 51, 52)} />
            </div>
            <div className="w-1/4">
              <LeftNews
                form={FormCardItem.ROW_REVERSE}
                datas={getArticleSegment(processedNews, 52, 56)}
                size={4}
              />
            </div>
          </div>

          {/* Section 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 p-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`mb-4 sm:mb-0 ${
                  index < 3
                    ? "border-b sm:border-b-0 sm:border-r border-gray-200"
                    : ""
                }`}
              >
                <LeftNews
                  datas={getArticleSegment(
                    processedNews,
                    56 + index * 4,
                    56 + (index + 1) * 4
                  )}
                  size={4}
                  classname="pr-[10px] h-full pb-4 sm:pb-0"
                  form={FormCardItem.NO_DATE}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ViewLayoutDefault;
