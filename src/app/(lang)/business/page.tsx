import { LatestNews } from "@/service/store/news/news.api";
import NewsEvent from "../news/newsEvent/NewsEvent";
import { TypePage } from "@/service/TypePage";

const PageNews = async () => {
  const rawResult = await LatestNews();

  return (
    <>
      <NewsEvent lang="vi" type={TypePage.BUSINESS} />
    </>
  );
};
export default PageNews;
