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
          <div style={{ padding: "60px", borderRadius: "50%" }}>
            <img
              // size={size}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "50%",
              }}
              src={imageSrc}
              // className="captured-avatar"
              // shape="circle"
            />
          </div>
        </div>
      )}
      {/* <p>Ảnh chụp</p> */}
    </CapturedImageWrapper>
  );
};

export default CapturedImage;
