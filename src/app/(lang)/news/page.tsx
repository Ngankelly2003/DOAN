import NewsEvent from "./newsEvent/NewsEvent";
import { TypePage } from "@/service/TypePage";

const PageNews = async () => {
  return (
    <>
      <NewsEvent lang="vi" type={TypePage.HOT_NEWS} />
    </>
  );
};
export default PageNews;
