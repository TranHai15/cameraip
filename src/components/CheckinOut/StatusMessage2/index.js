import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { StatusMessageWrapper } from "./style";

const StatusMessage2 = ({ message, type }) => {
  if (!message) return null;
  const getStatusColor = (type) => {
    switch (type) {
      case "waiting":
        return {
          color: "#ffffff", // Dark Red/Orange - Đỏ cam đậm
          bg: "#fff2e8", // Light Orange Background - Nền cam nhạt
        };
      case "adjusting":
        return {
          color: "#ffffff", // Dark Orange - Cam đậm
          bg: "#fffbe6", // Light Yellow Background - Nền vàng nhạt
        };
      case "ready":
        return {
          color: "#ffffff !important", // Dark Green - Xanh lá đậm
          bg: "#f6ffed", // Light Green Background - Nền xanh nhạt
        };
      case "capturing":
        return {
          color: "#ffffff", // Dark Blue - Xanh dương đậm
          bg: "#e6f7ff", // Light Blue Background - Nền xanh dương nhạt
        };
      case "error":
        return {
          color: "#ffffff", // Dark Red - Đỏ đậm
          bg: "#fff1f0", // Light Red Background - Nền đỏ nhạt
        };
      default:
        return {
          color: "#ffffff", // Dark Gray - Xám đậm
          bg: "#f5f5f5", // Light Gray Background - Nền xám nhạt
        };
    }
  };
  const status = getStatusColor(type || "idle");

  return (
    <StatusMessageWrapper
      style={{
        color: status.color,
        backgroundColor: status.bg,
      }}
    >
      {message}
    </StatusMessageWrapper>
  );
};

export default StatusMessage2;
