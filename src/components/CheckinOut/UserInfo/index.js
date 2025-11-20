import React from "react";
import { CreditCardOutlined, ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { UserInfoWrapper } from "./style";

const shortenNumberString = (str) => {
  if (!str) return "";
  if (str.length <= 6) return str;
  return str.slice(0, 3) + "........." + str.slice(-3);
};

const UserInfo = ({ hoVaTen, soCMND, checkinAt, statusMessage }) => {
  return (
    <UserInfoWrapper>
      <div className="greeting-name">{hoVaTen || ""}</div>
      <div className="greeting-cccd">
        <CreditCardOutlined /> Thẻ căn cước:{" "}
        {soCMND ? shortenNumberString(soCMND) : "........."}
      </div>
      <div className="greeting-checkin">
        <ClockCircleOutlined /> Giờ checkin:{" "}
        <span className="checkin-time">
          {checkinAt ? moment(checkinAt).format("HH:mm") : "........."}
        </span>
      </div>
      {statusMessage}
    </UserInfoWrapper>
  );
};

export default UserInfo;

