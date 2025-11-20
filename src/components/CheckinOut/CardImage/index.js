import React from "react";
import { Avatar } from "antd";
import { CardImageWrapper } from "./style";

const CardImage = ({ imageSrc, size = 240 }) => {
  return (
    <CardImageWrapper>
      <Avatar size={size} src={imageSrc} className="card-avatar" />
      <p>Ảnh thẻ CCCD</p>
    </CardImageWrapper>
  );
};

export default CardImage;

