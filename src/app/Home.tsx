"use client";
import { IAdvertisement } from "@/model/advertisement.model";
import { getAdvertimentHome } from "@/service/store/advertiment/advertiment.api";
import { RootState } from "@/service/store/reducers";
import FooterHome from "@/shared/home/FooterHome";
import HeaderHome from "@/shared/home/HeaderHome";
import ViewLayoutDefault from "@/shared/home/News/ViewLayout/ViewLayoutDefault";
import SlideHome from "@/shared/home/SlideHome";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const { advertisementHome } = useSelector(
    (state: RootState) => state.advertiment.initialState
  );
  const bannerApprovalRight = advertisementHome?.filter(
    (item: IAdvertisement) => item.advertisementPosition === "right"
  );
  const bannerApprovalLeft = advertisementHome?.filter(
    (item: IAdvertisement) => item.advertisementPosition === "left"
  );
  useEffect(() => {
    dispatch(getAdvertimentHome() as any);
  }, []);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <SlideHome />
        <div className="flex-grow flex flex-col lg:flex-row">
          {bannerApprovalRight?.length > 0 && (
            <div className="banner-container hidden lg:block relative">
              <Image
                src={bannerApprovalRight?.[0]?.advertisementLink}
                alt="Left banner"
                layout="fill"
                objectFit="contain"
                className="w-full"
              />
            </div>
          )}

          <div className="flex-grow">
            <div className="web-container">
              <HeaderHome />
              <ViewLayoutDefault />
            </div>
          </div>
          {bannerApprovalLeft?.length > 0 && (
            <div className="banner-container hidden lg:block relative">
              <Image
                src={bannerApprovalLeft?.[0]?.advertisementLink}
                alt="Right banner"
                layout="fill"
                objectFit="contain"
                className="w-full"
              />
            </div>
          )}
        </div>
        <FooterHome />
      </div>
    </>
  );
};

export default Home;
