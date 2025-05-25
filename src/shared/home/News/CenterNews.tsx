"use client";
import CardLargeItem from "@/components/card/RSSCardLargeItem";
import { Item } from "@/model/news.model";

interface ICenterNews {
  datas: any;
}
const CenterNews = (prop: ICenterNews) => {
  const { datas } = prop;

  return (
    <div
      style={{
        padding: "0 20px",
        borderLeft: "1px solid #eee",
        borderRight: "1px solid #eee",
      }}
    >
      {datas?.map((item: Item, index: number) => {
        return <CardLargeItem key={index} data={item} />;
      })}
    </div>
  );
};
export default CenterNews;
