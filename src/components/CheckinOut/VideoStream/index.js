import React from "react";
import { VideoStreamWrapper } from "./style";

const VideoStream = ({ videoUrl, faceStatus = { status: "idle", message: "" }, width = 240, height = 240 }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "#ff4d4f";
      case "adjusting":
        return "#faad14";
      case "ready":
        return "#52c41a";
      case "capturing":
        return "#1890ff";
      case "error":
        return "#ff4d4f";
      default:
        return "#8c8c8c";
    }
  };

  return (
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
        {faceStatus.status && faceStatus.status !== "idle" && (
          <div
            className="status-overlay"
            style={{ color: getStatusColor(faceStatus.status) }}
          >
            {faceStatus.message}
          </div>
        )}
      </div>
      <p>Ảnh chụp</p>
    </VideoStreamWrapper>
  );
};

export default VideoStream;

