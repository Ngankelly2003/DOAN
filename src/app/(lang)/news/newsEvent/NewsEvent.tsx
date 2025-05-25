"use client";
import { useEffect, useMemo, useState } from "react";
import { Row, Col, Typography, Pagination } from "antd";
import { TypePage } from "@/service/TypePage";
import CardItem from "@/components/card/RSSCardItem";
import MostReadNews from "../components/NewsBlock";
import CardLargeItem from "@/components/card/RSSCardLargeItem";
import { Item } from "rss-parser";
import {
  getArticleSegment,
  HeadingPage,
  processRSSData,
} from "@/shared/utils/ultils";
import { useTheme } from "@/app/(provider)/ThemeProvider";
import {
  LatestNews_Business,
  LatestNews_confide,
  LatestNews_Education,
  LatestNews_Entertainment,
  LatestNews_Life,
  LatestNews_New,
  LatestNews_Science,
  LatestNews_Sport,
  LatestNews_Toursm,
  LatestNews_World,
} from "@/service/store/news/news.api";

const { Title } = Typography;

type NewsEventProps = {
  type: TypePage;
  lang: string;
};

export default function NewsEvent({ type, lang }: NewsEventProps) {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataList, setDataList] = useState<any>([]);
  const [totalElements, setTotalElements] = useState<number>(0);

  const { themeData, setCurrentTheme } = useTheme();
  const [processedNews, setProcessedNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;
        switch (type) {
          case TypePage.THOISU:
          case TypePage.NEWS:
          case TypePage.HOT_NEWS:
          case TypePage.MOST_VIEW_NEWS:
          case TypePage.LATEST_NEWS:
            data = await LatestNews_New();
            break;
          case TypePage.WORLD:
            data = await LatestNews_World();
            break;
          case TypePage.BUSINESS:
            data = await LatestNews_Business();
            break;
          case TypePage.ENTERTAINMENT:
            data = await LatestNews_Entertainment();
            break;
          case TypePage.TOURISM:
            data = await LatestNews_Toursm();
            break;
          case TypePage.LIFE:
            data = await LatestNews_Life();
            break;
          case TypePage.SCIENCE:
            data = await LatestNews_Science();
            break;
          case TypePage.SPORT:
            data = await LatestNews_Sport();
            break;
          case TypePage.EDUCATION:
            data = await LatestNews_Education();
            break;
          case TypePage.CONFIDE:
            data = await LatestNews_confide();
            break;
          default:
            data = await LatestNews_New();
        }

        const processedData = processRSSData(data);
        setProcessedNews(processedData);
        setTotalElements(processedData?.length);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };
    fetchData();
  }, [type]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return processedNews?.slice(startIndex, endIndex);
  }, [page, pageSize, processedNews]);

  const mappingPostTitle: { [key in TypePage]: string } = {
    [TypePage.THOISU]: "Thời sự",
    [TypePage.WORLD]: "Thế giới",
    [TypePage.PERSPECTIVE]: "Góc nhìn",
    [TypePage.BUSINESS]: "Kinh doanh",
    [TypePage.SPORT]: "Thể thao",
    [TypePage.LIFE]: "Đời sống",
    [TypePage.ENTERTAINMENT]: "Giải trí",
    [TypePage.CONFIDE]: "Tâm sự",
    [TypePage.EDUCATION]: "Giáo dục",
    [TypePage.SCIENCE]: "Khoa học",
    [TypePage.START_UP]: "Start up",
    [TypePage.TOURISM]: "Du lịch",
    [TypePage.NEWS]: "Tin tức",
    [TypePage.HOT_NEWS]: "Tin nổi bật",
    [TypePage.MOST_VIEW_NEWS]: "Tin đọc nhiều nhất",
    [TypePage.LATEST_NEWS]: "Tin mới nhất",
  };

  return (
    <div className="container news-event-layout mt-2">
      <div>
        <HeadingPage
          // icon={mappingPostIcon[type]}
          title={mappingPostTitle[type]}
          breadcrumb={[{ label: mappingPostTitle[type], path: `/${type}` }]}
        />
      </div>
      <Row gutter={[16, 16]}>
        <Col lg={12}>
          <div style={{ backgroundColor: themeData.colorInfoBg }}>
            <CardLargeItem page={true} data={processedNews?.[0]} />
          </div>
        </Col>
        <Col lg={12}>
          <Row gutter={[0, 0.5]}>
            {processedNews?.slice?.(1, 4)?.map((ele: Item, index: number) => (
              <Col span={24} key={index}>
                <CardItem
                  page={true}
                  horizontalLines={false}
                  data={ele as any}
                />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ margin: "20px 0" }}>
        <Col xs={24} lg={16}>
          {paginatedArticles?.map((ele: Item, index: number) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <CardItem horizontalLines={false} data={ele as any} />
            </div>
          ))}
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalElements}
            onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }}
            style={{ textAlign: "center", marginTop: "16px" }}
          />
        </Col>
        <Col xs={24} lg={8}>
          <div className="mb-4">
            <MostReadNews
              processedNews={getArticleSegment(processedNews, 15, 20)}
              heading="Tin mới nhất"
            />
          </div>
          <MostReadNews
            processedNews={getArticleSegment(processedNews, 20, 25)}
            heading="Tin xem nhiều"
          />
        </Col>
      </Row>
    </div>
  );
}
