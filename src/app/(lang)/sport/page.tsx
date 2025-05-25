import NewsEvent from "../news/newsEvent/NewsEvent";
import { TypePage } from "@/service/TypePage";

const PageNews = async () => {
  return (
    <>
      <NewsEvent lang="vi" type={TypePage.SPORT} />
    </>
  );
};
export default PageNews;
