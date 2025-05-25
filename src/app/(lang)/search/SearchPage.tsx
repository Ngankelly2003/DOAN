"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LatestNews } from "@/service/store/news/news.api";
import { processRSSData } from "@/shared/utils/ultils";
import CardItem from "@/components/card/RSSCardItem";
import { Pagination } from "antd";

interface NewsItem {
  title: string;
  link: string;
  id: string;
}

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [processedNews, setProcessedNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await LatestNews();
        const processedData = processRSSData(data);
        setProcessedNews(processedData);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (query && processedNews.length > 0) {
      const lowercaseQuery = query.toLowerCase();
      const filtered = processedNews.filter((item) =>
        item.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredNews(filtered);
      setCurrentPage(1);
    } else {
      setFilteredNews([]);
    }
  }, [query, processedNews]);

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    return filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, filteredNews, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm: "{query}"</h2> */}
      <p style={{ fontSize: "14px", fontWeight: 500 }} className="mb-4">
        {filteredNews.length > 0
          ? `Đã tìm thấy ${filteredNews.length} tin tức`
          : "Không tìm thấy tin tức nào"}
      </p>
      {filteredNews.length > 0 ? (
        <>
          <ul className="space-y-4 mb-4">
            {currentItems.map((item: NewsItem) => (
              <CardItem key={item.id || item.link} data={item as any} />
            ))}
          </ul>
          <Pagination
            current={currentPage}
            total={filteredNews.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total) => `Tổng ${total} tin tức`}
          />
        </>
      ) : (
        // <p>Không tìm thấy kết quả nào cho "{query}"</p>
        <></>
      )}
    </div>
  );
};

export default SearchPage;
