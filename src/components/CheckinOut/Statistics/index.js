import React from "react";
import { UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { StatisticsWrapper } from "./style";

const Statistics = ({ checkIn = 0, checkOut = 0 }) => {
  return (
    <StatisticsWrapper>
      <div className="stat-card stat-card-checkin">
        <span className="stat-label">
          <UserAddOutlined className="stat-label__icon" /> Tổng số đã checkin
        </span>
        <p className="stat-count">{checkIn}</p>
        <UserAddOutlined className="blur-icon" />
      </div>
      <div className="stat-card stat-card-checkout">
        <span className="stat-label">
          <UserDeleteOutlined className="stat-label__icon" /> Đã checkout
        </span>
        <p className="stat-count">{checkOut}</p>
        <UserDeleteOutlined className="blur-icon" />
      </div>
    </StatisticsWrapper>
  );
};

export default Statistics;

