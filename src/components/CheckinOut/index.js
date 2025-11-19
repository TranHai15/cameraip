import React, { useEffect, useState, useRef } from "react";
import { MainWrapper } from "./style";
import { Avatar, Spin, message } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CreditCardOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import defaultUser from "../../assets/images/user.jpg";
import settings from "../../config/settings";
import checkinApi from "../../services/checkinApi";
import faceServerService from "../../services/faceServerService";

const TYPE = {
  ERROR: 1,
  SUCCESS: 2,
};

const STATE_SCAN = {
  ERROR: 1,
  SUCCESS: 2,
};

export default function CheckinOut() {
  const socketRef = useRef();
  const [listCheckin, setListCheckin] = useState([]);
  const [loadingCheckIn, setLoadingCheckIn] = useState(false);
  const [loadingDataScan, setLoadingDataScan] = useState(false);
  const [currentCheckin, setCurrentCheckin] = useState({});
  const [filterData, setFilterData] = useState({
    PageNumber: 1,
    PageSize: 10,
    TotalRow: null,
  });
  const [StateScan, setStateScan] = useState(0);
  const [isCallingApi, setIsCallingApi] = useState(false);
  const [delayCC, setdelayCC] = useState(0);
  const [totalCheckInOut, setTotalCheckinOut] = useState({
    checkIn: 0,
    checkOut: 0,
  });
  const [statusRes, setStatusRes] = useState({
    message: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
    type: TYPE.ERROR,
    Score: null,
  });
  const [faceStatus, setFaceStatus] = useState({
    status: "idle", // idle, waiting, adjusting, ready, capturing, error
    message: "Chờ quét thẻ...",
  });

  const listCheckinRef = useRef(listCheckin);
  const currentRefCheckin = useRef(null);
  const filterDataRef = useRef(filterData);
  const refCallingApi = useRef(isCallingApi);
  const delayDetectFace = useRef(delayCC);
  const scoreCompareFace = 60;
  let delayChamCong = null;

  useEffect(() => {
    listCheckinRef.current = listCheckin;
  }, [listCheckin]);

  useEffect(() => {
    delayDetectFace.current = delayCC;
  }, [delayCC]);

  useEffect(() => {
    refCallingApi.current = isCallingApi;
  }, [isCallingApi]);

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(() => {
    const container = document.getElementsByClassName("customer-list");
    if (container[0]) {
      container[0].addEventListener("scroll", ScrollContainer);
    }

    GetListCheckin(filterData);
    handleConnectSocketScan();

    // Kết nối face-server
    faceServerService.connect(
      // onCaptureSuccess: Khi nhận được ảnh từ face-server
      (base64Image) => {
        console.log("📸 Received image from face-server");
        if (!refCallingApi.current && currentRefCheckin.current) {
          handleCompareFace(base64Image, currentRefCheckin.current);
        }
      },
      // onError: Xử lý lỗi kết nối
      (error) => {
        console.error("❌ Face-server error:", error);
        message.warning(
          "Không thể kết nối đến face-server. Vui lòng kiểm tra lại."
        );
      },
      // onFaceStatus: Nhận status và message từ BE
      (data) => {
        if (data && data.status && data.message) {
          setFaceStatus({
            status: data.status,
            message: data.message,
          });
        }
      }
    );

    delayChamCong = setInterval(() => {
      setdelayCC((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    getTotalCheckInOut();

    return () => {
      if (delayChamCong) clearInterval(delayChamCong);
      if (socketRef.current) {
        socketRef.current.close();
      }
      // Disconnect face-server
      faceServerService.disconnect();
    };
  }, []);

  const getTotalCheckInOut = () => {
    checkinApi
      .TongHopNgay()
      .then((res) => {
        if (res && res.data && res.data.Status > 0) {
          const data = res.data.Data;
          setTotalCheckinOut({
            checkIn: data.Tong,
            checkOut: data.DaVe,
          });
        } else {
          message.destroy();
          message.warning(res?.data?.Message || "Lỗi khi lấy thống kê");
        }
      })
      .catch((err) => {
        message.destroy();
        message.warning(err.toString());
      });
  };

  const isJsonString = (str) => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === "object" && parsed !== null;
    } catch (e) {
      return false;
    }
  };

  const handleConnectSocketScan = () => {
    const socket = new WebSocket(`ws://localhost:${settings.socketPort}`);
    socketRef.current = socket;
    console.log("start connect websocket");

    socket.onopen = () => {
      console.log("socket connected port ", settings.socketPort);
    };

    socketRef.current.onmessage = (event) => {
      const data = isJsonString(event.data) ? JSON.parse(event.data) : {};

      if (data.EventName === "READ") {
        setLoadingDataScan(true);
      }

      if (data.NewState === "EMPTY") {
        console.log("set empty");
        setCurrentCheckin({});
        currentRefCheckin.current = null;
        setStatusRes({
          message: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
          type: TYPE.ERROR,
          Score: null,
        });
        setStateScan(null);
        // Dừng chụp ảnh khi thẻ đã lấy ra
        faceServerService.stopCapture();
      }

      if (data.EventName === "CARD_RESULT") {
        setLoadingDataScan(false);
        const checkinAt = Date.now();
        const dataReaded = {
          HoVaTen: data.PersonalInfo.personName,
          GioiTinh: data.PersonalInfo.gender,
          SoCMND: data.PersonalInfo.idCode,
          LoaiGiayTo: "CCCD",
          HoKhau: data.PersonalInfo.residencePlace,
          imageChanDung: data.ChipFace,
          NgayCapCMND: data.PersonalInfo.issueDate,
          NgaySinh: data.PersonalInfo.dateOfBirth,
          checkinAt,
          LyDoGap: 1,
          FaceImg: "", // Reset ảnh chụp
        };
        setStatusRes({
          message: "Vui lòng đưa mặt vào khung để chụp ảnh",
          type: null,
          Score: null,
        });
        setStateScan(null);
        console.log("set success");
        setCurrentCheckin(dataReaded);
        currentRefCheckin.current = dataReaded;

        // Gửi lệnh bắt đầu chụp ảnh từ face-server ngay lập tức (bỏ delay)
        faceServerService.startCapture();
        console.log("📢 Started face capture");
      }

      if (data.Status === "FAILURE") {
        setLoadingDataScan(false);
        setStatusRes({
          message:
            "Xảy ra lỗi trong quá trình đọc thông tin thẻ căn cước, vui lòng thử lại!",
          type: TYPE.ERROR,
          Score: null,
        });
        setStateScan(null);
      }
    };

    socketRef.current.onerror = (error) => {
      setLoadingDataScan(false);
      console.log("❌ Lỗi: ", error);
    };

    socketRef.current.onclose = (event) => {
      setLoadingDataScan(false);
      logEventErrorSocket(event);
      console.log("🔌 Kết nối đã đóng");
    };
  };

  const ScrollContainer = (e) => {
    const container = e.target;
    const isBottom =
      container.scrollTop === container.scrollHeight - container.clientHeight;

    if (isBottom) {
      let newFilterData = { ...filterDataRef.current };

      if (listCheckinRef.current.length < filterDataRef.current.TotalRow) {
        newFilterData.PageNumber = filterDataRef.current.PageNumber + 1;
        setFilterData(newFilterData);
        GetListCheckin({
          ...newFilterData,
          PageNumber: newFilterData.PageNumber,
        });
      }
    }
  };

  const GetListCheckin = (filterData) => {
    setLoadingCheckIn(true);
    checkinApi
      .GetList({
        PageSize: filterData.PageSize,
        PageNumber: filterData.PageNumber,
      })
      .then((response) => {
        setLoadingCheckIn(false);
        if (response && response.data && response.data.Status > 0) {
          let newListCheckin = [...listCheckinRef.current];

          if (filterData.PageNumber === 1) {
            newListCheckin = response.data.Data;
          } else {
            response.data.Data.forEach((item) => newListCheckin.push(item));
          }
          const TotalRow = response.data.TotalRow;
          setListCheckin(newListCheckin);
          setFilterData((prevFilter) => ({ ...prevFilter, TotalRow }));
        }
      })
      .catch((err) => {
        setLoadingCheckIn(false);
        message.destroy();
        console.log("error notification");
        message.warning(err.toString());
      });
  };

  const CheckIn = (currentCheckin, score) => {
    const param = { ...currentCheckin };
    param.NgaySinh =
      param.NgaySinh !== ""
        ? moment(param.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.NgayCapCMND =
      param.NgayCapCMND !== "" && param.NgayCapCMND
        ? moment(param.NgayCapCMND, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.AnhChanDungBase64 = param.imageChanDung;
    console.log(param.LyDoGap, "param.LyDoGap", currentCheckin);
    delete param.GioVao;

    if (param.LyDoGap === undefined) {
      message.destroy();
      message.warning("Chưa chọn lý do vào cơ quan");
      return;
    } else {
      if (param.LyDoGap === 2) {
        if (param.GapCanBo === undefined) {
          message.destroy();
          message.warning("Chưa chọn đối tượng gặp");
          return;
        } else {
          const arr = param.GapCanBo.split("_");
          param.GapCanBo = arr[0];
          param.DonViCaNhan = arr[1];
        }
      } else {
        param.GapCanBo = 0;
        param.DonViCaNhan = 0;
      }
    }

    checkinApi
      .Checkinv4(param)
      .then((response) => {
        if (response && response.data && response.data.Status > 0) {
          setLoadingDataScan(false);
          setStatusRes({
            message: "Checkin thành công!",
            type: TYPE.SUCCESS,
            Score: score,
          });
          refCallingApi.current = false;
          setIsCallingApi(false);
          getTotalCheckInOut();
          setFilterData((prevFilter) => ({ ...prevFilter, PageNumber: 1 }));
          GetListCheckin({
            ...filterData,
            PageNumber: 1,
          });

          // Dọn dẹp: Reset ảnh và thông tin sau khi check-in thành công
          setTimeout(() => {
            setCurrentCheckin({});
            currentRefCheckin.current = null;
            setStatusRes({
              message:
                "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
              type: TYPE.ERROR,
              Score: null,
            });
            setStateScan(null);
            setFaceStatus({
              status: "idle",
              message: "Chờ quét thẻ...",
            });
            // Dừng capture nếu đang chạy
            faceServerService.stopCapture();
          }, 3000); // Sau 3 giây hiển thị thông báo thành công
        } else {
          refCallingApi.current = false;
          setIsCallingApi(false);
          setLoadingDataScan(false);
          setStatusRes({
            message: response?.data?.Message || "Lỗi khi check-in",
            type: TYPE.ERROR,
            Score: score,
          });
        }
      })
      .catch((error) => {
        console.log("error checkin");
        setLoadingDataScan(false);
        message.destroy();
        message.error(error.toString());
        refCallingApi.current = false;
        setIsCallingApi(false);
      });
  };

  const logEventErrorSocket = (event) => {
    let reason = "";
    if (event.code === 1000) reason = "Normal closure";
    else if (event.code === 1001) reason = 'An endpoint is "going away"';
    else if (event.code === 1002)
      reason =
        "An endpoint is terminating the connection due to a protocol error";
    else if (event.code === 1006)
      reason = "The connection was closed abnormally";
    else reason = "Unknown reason";
    console.log(reason);
    return reason;
  };

  const handleRetryDelay = () => {
    setdelayCC(1);
    console.log("delay detect face");
    setTimeout(() => {
      setdelayCC(0);
    }, 5000);
  };

  const handleCompareFace = async (img, currentCheckin) => {
    setLoadingDataScan(true);
    setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: img });
    refCallingApi.current = true;
    setIsCallingApi(true);

    checkinApi
      .CompareFace({
        AnhCCCD: currentCheckin.imageChanDung,
        AnhChanDung: img,
      })
      .then((res) => {
        if (res && res.data && res.data.Score > scoreCompareFace) {
          setStateScan(STATE_SCAN.SUCCESS);
          CheckIn(currentCheckin, res.data.Score);
        } else {
          console.log("set compare face fail");
          handleRetryDelay();
          setTimeout(() => {
            setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: "" });
            setStateScan(STATE_SCAN.ERROR);
            setLoadingDataScan(false);
            refCallingApi.current = false;
            setIsCallingApi(false);
            setStatusRes({
              message:
                res?.data?.Status || "Khuôn mặt không khớp. Vui lòng thử lại.",
              type: TYPE.ERROR,
              Score: res?.data?.Score,
            });
            setLoadingCheckIn(false);
            // Cho phép chụp lại sau khi thất bại
            setTimeout(() => {
              if (
                currentRefCheckin.current &&
                currentRefCheckin.current.SoCMND
              ) {
                faceServerService.startCapture();
              }
            }, 3000);
          }, 2000);
        }
      })
      .catch((err) => {
        handleRetryDelay();
        refCallingApi.current = false;
        setIsCallingApi(false);
        setLoadingDataScan(false);
        // Cho phép chụp lại sau khi lỗi
        setTimeout(() => {
          if (currentRefCheckin.current && currentRefCheckin.current.SoCMND) {
            faceServerService.startCapture();
          }
        }, 3000);
      });
  };

  // Video stream từ face-server - Hiển thị ngay khi mount
  const videoFeedUrl = faceServerService.getVideoFeedUrl();

  // Hàm lấy màu theo status
  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "#ff4d4f"; // Đỏ
      case "adjusting":
        return "#faad14"; // Vàng
      case "ready":
        return "#52c41a"; // Xanh
      case "capturing":
        return "#1890ff"; // Xanh dương
      case "error":
        return "#ff4d4f"; // Đỏ
      default:
        return "#8c8c8c"; // Xám
    }
  };

  const cameraContentScan = (
    <div
      className={"camera-container"}
      style={{
        width: 240,
        height: 240,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={videoFeedUrl}
        alt="Video feed"
        style={{
          width: "240px",
          height: "240px",
          objectFit: "cover",
        }}
        onError={(e) => {
          console.error("Error loading video feed:", e);
          e.target.src = ""; // Clear src on error
        }}
      />
      {/* Overlay message từ BE */}
      {faceStatus.status !== "idle" && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: getStatusColor(faceStatus.status),
            padding: "8px 12px",
            textAlign: "center",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
            zIndex: 10,
          }}
        >
          {faceStatus.message}
        </div>
      )}
    </div>
  );

  const shortenNumberString = (str) => {
    if (!str) return "";
    if (str.length <= 6) return str;
    return str.slice(0, 3) + "........." + str.slice(-3);
  };

  const COLOR_SUCCESS = "#fff";
  const COLOR_ERROR = "#fff";
  const checkResultScore =
    statusRes.Score >= 0 && typeof statusRes.Score === "number";

  return (
    <div>
      <MainWrapper>
        <div className="left-panel">
          <div className="left-panel__top">
            {loadingDataScan ? (
              <div className="spin-container">
                <Spin size="large" />
              </div>
            ) : null}

            <div className="greeting-title" style={{ color: COLOR_SUCCESS }}>
              Xin chào quý khách
            </div>
            <div className="greeting-body">
              <>
                <div className="empty"></div>
                <div className="face-wrapper">
                  <div className="card">
                    <Avatar
                      size={240}
                      src={currentCheckin.imageChanDung}
                      className="greeting-avatar"
                    />
                    <p>Ảnh thẻ CCCD</p>
                  </div>

                  <div
                    className={`score ${
                      statusRes.type === TYPE.ERROR
                        ? "score-fail"
                        : statusRes.type === TYPE.SUCCESS
                        ? "score-success"
                        : ""
                    }`}
                  >
                    <div className={checkResultScore ? "score-circle" : ""}>
                      {checkResultScore ? (
                        statusRes.Score >= scoreCompareFace ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      ) : null}
                    </div>
                    <p
                      style={{
                        color:
                          statusRes.Score >= scoreCompareFace
                            ? "green"
                            : "black",
                      }}
                    >
                      {checkResultScore
                        ? statusRes.Score >= scoreCompareFace
                          ? "Khớp"
                          : "Không khớp"
                        : ""}
                    </p>
                  </div>
                  <div className="card-liveview">
                    {!currentCheckin.FaceImg ? (
                      // Hiển thị video stream ngay cả khi chưa có thẻ
                      <div className={`screen-wrapper`}>
                        {cameraContentScan}
                      </div>
                    ) : (
                      <Avatar
                        size={240}
                        src={currentCheckin.FaceImg}
                        className="greeting-avatar"
                      />
                    )}
                    <p>Ảnh chụp</p>
                  </div>
                </div>

                <div className="face-info">
                  <div className="greeting-name">{currentCheckin.HoVaTen}</div>
                  <div className="greeting-cccd">
                    <CreditCardOutlined /> Thẻ căn cước:{" "}
                    {currentCheckin.SoCMND
                      ? shortenNumberString(currentCheckin.SoCMND)
                      : "........."}
                  </div>
                  <div className="greeting-checkin">
                    <ClockCircleOutlined /> Giờ checkin:{" "}
                    <span className="checkin-time">
                      {currentCheckin.checkinAt
                        ? moment(currentCheckin.checkinAt).format("HH:mm")
                        : "........."}
                    </span>
                  </div>
                  {statusRes.message ? (
                    <h1
                      className={`${
                        statusRes.type === TYPE.ERROR ? "error" : ""
                      } status-checkin`}
                      style={{
                        color:
                          statusRes.type === TYPE.ERROR
                            ? COLOR_ERROR
                            : COLOR_SUCCESS,
                      }}
                    >
                      {statusRes.type === TYPE.ERROR ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )}
                      {statusRes.message}
                    </h1>
                  ) : null}
                </div>
              </>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">
                <UserAddOutlined className="stat-label__icon" /> Tổng số đã
                checkin
              </span>
              <p className="stat-count">{totalCheckInOut.checkIn}</p>
              <UserAddOutlined className="blur-icon" />
            </div>
            <div className="stat-card">
              <span className="stat-label">
                <UserDeleteOutlined className="stat-label__icon" /> Đã checkout
              </span>
              <p className="stat-count">{totalCheckInOut.checkOut}</p>
              <UserDeleteOutlined className="blur-icon" />
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="list-title">Danh sách khách đã checkin</div>
          <div
            className={`customer-list ${
              listCheckin.length === 0 ? "customer-list__empty" : ""
            }`}
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
                        : defaultUser
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
        </div>
      </MainWrapper>
    </div>
  );
}
