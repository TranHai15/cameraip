import React, { useMemo } from "react";
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
  // Tìm item mới nhất dựa vào GioVao
  const newestItemId = useMemo(() => {
    if (listCheckin.length === 0) return null;

    // Sắp xếp theo GioVao giảm dần (mới nhất trước)
    const sorted = [...listCheckin].sort((a, b) => {
      const timeA = moment(a.GioVao).valueOf();
      const timeB = moment(b.GioVao).valueOf();
      return timeB - timeA; // Mới nhất trước
    });

    // Lấy item mới nhất (đầu tiên sau khi sort)
    return sorted[0]?.GioVao || null;
  }, [listCheckin]);
  const gender = (key) => {
    switch (key) {
      case "Nam":
        return "Ông";
      case "Nữ":
        return "Bà";
      default:
        return "Khách";
    }
  };
  return (
    <CheckinListWrapper>
      <div className="list-title">Danh sách khách đã Đăng ký</div>
      <div
        className={`customer-list ${
          listCheckin.length === 0 ? "customer-list__empty" : ""
        }`}
        onScroll={onScroll}
      >
        {listCheckin.length === 0 ? (
          <></>
        ) : (
          listCheckin.map((item, index) => {
            const isNewest = item.GioVao === newestItemId;
            return (
              <div
                className={`customer-card ${
                  isNewest ? "customer-card--new" : ""
                }`}
                key={index}
              >
                {isNewest && <span className="new-badge">Mới</span>}
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
                    <div className="customer-name">
                      {gender(item.GioiTinh)} {item.HoVaTen}
                    </div>
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
            );
          })
        )}
      </div>
    </CheckinListWrapper>
  );
};

export default CheckinList;
