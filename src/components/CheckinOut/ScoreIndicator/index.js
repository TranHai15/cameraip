import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ScoreIndicatorWrapper } from "./style";

const ScoreIndicator = ({ score, threshold = 60, type }) => {
  const hasScore = score >= 0 && typeof score === "number";
  const isMatch = score >= threshold;

  return (
    <ScoreIndicatorWrapper
      className={`score ${
        type === "ERROR"
          ? "score-fail"
          : type === "SUCCESS"
          ? "score-success"
          : ""
      }`}
    >
      <div className={hasScore ? "score-circle" : ""}>
        {hasScore &&
          (isMatch ? <CheckCircleOutlined /> : <CloseCircleOutlined />)}
      </div>
      <p style={{ color: isMatch ? "green" : "black" }}>
        {hasScore ? (isMatch ? "Khớp" : "Không khớp") : ""}
      </p>
    </ScoreIndicatorWrapper>
  );
};

export default ScoreIndicator;

