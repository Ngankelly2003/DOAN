import { useEffect, useState } from "react";
import emptyImg from "../../assets/img/image-news.jpg";
import { StaticImageData } from "next/image";

interface ICustomImageProps {
  src: string | StaticImageData;
  rate?: "1:1" | "16:9" | "4:3";
  object?: "contain" | "cover";
  scaleWhenHover?: boolean;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  alt?: string;
}

const CustomImage = ({
  src,
  rate = "4:3",
  object = "cover",
  scaleWhenHover = true,
  onClick,
  alt = "",
}: ICustomImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [emptyImage, setEmptyImage] = useState(false);

  const [horizontal, vertical] = rate.split(":");
  const paddingTop = (+vertical / +horizontal) * 100;

  useEffect(() => {
    if (!src || src === "") {
      setEmptyImage(true);
    } else {
      setImageError(false);
      setEmptyImage(false);
    }
  }, [src]);

  const handleImageError = () => {
    console.error("Image failed to load:", src);
    setImageError(true);
  };

  const getImageSrc = (src: string | StaticImageData): string => {
    if (typeof src === "string") {
      // Check if the URL is valid
      if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
      }
      return emptyImg.src;
    }
    return src.src;
  };

  return (
    <div
      style={{ width: "100%", paddingTop: `${paddingTop}%` }}
      className="relative overflow-hidden"
    >
      <img
        src={getImageSrc(!imageError && !emptyImage ? src : emptyImg)}
        alt={alt}
        onClick={onClick}
        onError={handleImageError}
        className={`absolute w-full h-full inset-0 ${
          scaleWhenHover ? "hover:scale-110 duration-500" : ""
        }`}
        style={{ objectFit: object }}
      />
    </div>
  );
};

export default CustomImage;
