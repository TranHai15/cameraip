import React from "react";
import { Avatar } from "antd";
import { CapturedImageWrapper } from "./style";

const CapturedImage = ({
  imageSrc,
  size = 240,
  fallbackVideo,
  isSuccess = false,
  isError = false,
}) => {
  return (
    <CapturedImageWrapper>
      {!imageSrc ? (
        <div className="screen-wrapper">{fallbackVideo}</div>
      ) : (
        <div
          className={`captured-image-container ${
            isSuccess ? "success" : isError ? "error" : ""
          }`}
        >
          <Avatar
            size={size}
            src={imageSrc}
            style={{ padding: "60px", borderRadius: "50%" }}
            className="captured-avatar"
            shape="circle"
          />
        </div>
      )}
      {/* <p>Ảnh chụp</p> */}
    </CapturedImageWrapper>
  );
};

export default CapturedImage;
