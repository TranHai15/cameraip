import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { StatusMessageWrapper } from "./style";

const StatusMessage = ({
  message,
  type,
  colorSuccess = "#fff",
  colorError = "#fff",
}) => {
  if (!message) return null;

  return (
    <StatusMessageWrapper
      className={type === "ERROR" ? "error" : ""}
      style={{
        color: type === "ERROR" ? colorError : colorSuccess,
      }}
    >
      {type === "ERROR" ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
      {message}
    </StatusMessageWrapper>
  );
};

export default StatusMessage;
