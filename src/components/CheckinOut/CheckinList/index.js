import React from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { CheckinListWrapper } from "./style";
import defaultUser from "../../../assets/images/user.jpg";

const shortenNumberString = (str) => {
  if (!str) return "";
  if (str.length <= 6) return str;
  return str.slice(0, 3) + "........." + str.slice(-3);
};

const CheckinList = ({
  listCheckin = [],
  loading = false,
  onScroll,
  defaultUserImage = defaultUser,
}) => {
  return (
    <CheckinListWrapper>
      <div className="list-title">Danh sách khách đã checkin</div>
      <div
        className={`customer-list ${
          listCheckin.length === 0 ? "customer-list__empty" : ""
        }`}
        onScroll={onScroll}
      >
        {listCheckin.length === 0 ? (
          <></>
        ) : (
          listCheckin.map((item) => (
            <div className="customer-card" key={item.id}>
              <img
                src={
                  item.AnhChanDungBase64 !== ""
                    ? item.AnhChanDungBase64
                    : defaultUserImage
                }
                alt=""
                className="customer-avatar"
              />
              <div className="customer-info">
                <div className="info">
                  <div className="customer-name">{item.HoVaTen}</div>
                  <div className="customer-cccd">
                    {shortenNumberString(item.SoCMND)}
                  </div>
                  <div className="customer-checkin">
                    <ClockCircleOutlined />{" "}
                    {moment(item.GioVao).format("HH:mm ")}
                  </div>
                </div>
                <div className="status">
                  <p className="status-customer__checkin">Đã vào</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </CheckinListWrapper>
  );
};

export default CheckinList;

