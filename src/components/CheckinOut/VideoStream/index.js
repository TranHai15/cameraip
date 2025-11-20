import React from "react";
import { VideoStreamWrapper } from "./style";
import StatusMessage2 from "../StatusMessage2";

const VideoStream = ({
  videoUrl,
  faceStatus = { status: "idle", message: "" },
  width = 240,
  height = 240,
}) => {
  return (
    <>
      <VideoStreamWrapper width={width} height={height}>
        <div className="video-container">
          <img
            src={videoUrl}
            alt="Video feed"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              objectFit: "cover",
            }}
            onError={(e) => {
              console.error("Error loading video feed:", e);
              e.target.src = "";
            }}
          />
        </div>
      </VideoStreamWrapper>
    </>
  );
};

export default VideoStream;
