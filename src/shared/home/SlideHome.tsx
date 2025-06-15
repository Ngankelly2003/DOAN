"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { IAdvertisement } from "@/model/advertisement.model";
import { useEffect } from "react";
import {
  getAdvertimentHome,
} from "@/service/store/advertiment/advertiment.api";
import { RootState } from "@/service/store/reducers";

const SlideHome = () => {
  const dispatch = useDispatch();
  const { advertisementHome } = useSelector(
    (state: RootState) => state.advertiment.initialState
  );

  console.log("Advertisement Home Data:", advertisementHome);

  const bannerApproval = advertisementHome.filter(
    (item: IAdvertisement) => item.advertisementPosition === "center"
  );

  console.log("Banner Approval Data:", bannerApproval);

  useEffect(() => {
    dispatch(getAdvertimentHome() as any);
  }, []);

  if (bannerApproval.length === 0) {
    return null;
  }

  const bannerSrc = bannerApproval[0]?.advertisementLink || "";

  return (
    <div className="w-full h-[300px] relative">
      {bannerSrc && (
        <Image
          src={bannerSrc}
          alt="Advertisement Banner"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default SlideHome;
