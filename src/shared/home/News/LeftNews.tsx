import React from "react";
import CardItem from "@/components/card/RSSCardItem";
import { Item } from "@/model/news.model";
import { FormCardItem } from "./ViewLayout/form";

interface ILeftNews {
  size?: number;
  vertical?: boolean;
  classname?: string;
  form?: FormCardItem;
  page?: boolean;
  datas: any;
}

const LeftNews: React.FC<ILeftNews> = ({
  size,
  vertical,
  classname,
  form,
  page,
  datas,
}) => {
  return (
    <div className={`${classname}`}>
      {datas?.map((item: Item, index: number) => (
        <div
          key={index}
          style={{
            padding: "0 10px",
            marginBottom: "10px",
          }}
        >
          <CardItem
            key={index}
            data={item}
            formCard={form}
            page={page}
            vertical={vertical}
          />
        </div>
      ))}
    </div>
  );
};

export default LeftNews;
