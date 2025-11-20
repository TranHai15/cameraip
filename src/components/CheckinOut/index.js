import React, { useEffect, useState, useRef } from "react";
import { MainWrapper } from "./style";
import { Spin, message } from "antd";
import moment from "moment";
import settings from "../../config/settings";
import checkinApi from "../../services/checkinApi";
import faceServerService from "../../services/faceServerService";

// Import các component con
import CardImage from "./CardImage";
import VideoStream from "./VideoStream";
import CapturedImage from "./CapturedImage";
import ScoreIndicator from "./ScoreIndicator";
import UserInfo from "./UserInfo";
import StatusMessage from "./StatusMessage";
import Statistics from "./Statistics";
import CheckinList from "./CheckinList";

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
    message: settings.defaultMessages.waitingCard,
    type: TYPE.ERROR,
    Score: null,
  });
  const [faceStatus, setFaceStatus] = useState({
    status: "idle", // idle, waiting, adjusting, ready, capturing, error
    message: settings.defaultMessages.waitingFaceServer,
  });
  const [showCardImage, setShowCardImage] = useState(false); // Hiển thị ảnh thẻ trong 2s sau khi quét

  const listCheckinRef = useRef(listCheckin);
  const currentRefCheckin = useRef(null);
  const filterDataRef = useRef(filterData);
  const refCallingApi = useRef(isCallingApi);
  const delayDetectFace = useRef(delayCC);
  const scoreCompareFace = settings.scoreCompare;
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
          message: settings.defaultMessages.waitingCard,
          type: TYPE.ERROR,
          Score: null,
        });
        setStateScan(null);
        setShowCardImage(false); // Ẩn ảnh thẻ khi thẻ đã lấy ra
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
          message: settings.defaultMessages.waitingFace,
          type: null,
          Score: null,
        });
        setStateScan(null);
        console.log("set success");
        setCurrentCheckin(dataReaded);
        currentRefCheckin.current = dataReaded;

        // Hiển thị ảnh thẻ trong 2 giây, sau đó ẩn đi
        setShowCardImage(true);
        setTimeout(() => {
          setShowCardImage(false);
        }, 2000); // 2 giây

        // Gửi lệnh bắt đầu chụp ảnh từ face-server ngay lập tức (bỏ delay)
        faceServerService.startCapture();
        console.log("📢 Started face capture");
      }

      if (data.Status === "FAILURE") {
        setLoadingDataScan(false);
          setStatusRes({
            message: settings.defaultMessages.cardError,
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
            message: settings.defaultMessages.checkinSuccess,
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
              message: settings.defaultMessages.waitingCard,
              type: TYPE.ERROR,
              Score: null,
            });
            setStateScan(null);
            setShowCardImage(false); // Ẩn ảnh thẻ
            setFaceStatus({
              status: "idle",
              message: settings.defaultMessages.waitingFaceServer,
            });
            // Dừng capture nếu đang chạy
            faceServerService.stopCapture();
          }, settings.successMessageDelay); // Sau khi hiển thị thông báo thành công
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
              message: res?.data?.Status || settings.defaultMessages.faceNotMatch,
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
            }, settings.retryCaptureDelay);
          }, settings.compareFaceDelay);
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
        }, settings.retryCaptureDelay);
      });
  };

  // Video stream từ face-server
  const videoFeedUrl = faceServerService.getVideoFeedUrl();

  // Logic hiển thị:
  // 1. Mặc định: Không hiển thị gì (chưa có dữ liệu thẻ)
  // 2. Có dữ liệu thẻ, showCardImage = true (2s đầu): Chỉ CardImage (chưa hiển thị VideoStream)
  // 3. Có dữ liệu thẻ, showCardImage = false (sau 2s): Chỉ VideoStream (ẩn CardImage)
  // 4. Có ảnh chụp: Chỉ CapturedImage (ẩn CardImage và VideoStream)
  // 5. Có ảnh chụp và thành công: CapturedImage có CSS success
  // 6. Có ảnh chụp nhưng thất bại: Quay lại chỉ VideoStream (FaceImg đã được reset)
  
  const hasCardData = !!currentCheckin.imageChanDung;
  const hasCapturedImage = !!currentCheckin.FaceImg;
  const isSuccess = statusRes.type === TYPE.SUCCESS && hasCapturedImage;
  // Hiển thị CardImage chỉ trong 2s đầu sau khi quét thẻ, và khi có ảnh chụp thì không hiển thị
  const shouldShowCardImage = showCardImage && !hasCapturedImage;
  // Chỉ hiển thị VideoStream sau khi ẩn CardImage (sau 2s) và chưa có ảnh chụp
  const shouldShowVideo = hasCardData && !hasCapturedImage && !showCardImage;
  const shouldShowScore = hasCapturedImage;

  const COLOR_SUCCESS = "#fff";
  const COLOR_ERROR = "#fff";

  return (
    <div>
      <MainWrapper>
        <div className="left-panel">
          <div className="left-panel__top">
            {loadingDataScan && (
              <div className="spin-container">
                <Spin size="large" />
              </div>
            )}

            <div className="greeting-title" style={{ color: COLOR_SUCCESS }}>
              Xin chào quý khách
            </div>
            
            <div className="greeting-body">
              <div className="empty"></div>
              
              <div className="face-wrapper">
                {/* Module 1: Ảnh căn cước - Chỉ hiển thị trong 2s đầu sau khi quét thẻ */}
                {shouldShowCardImage && (
                  <CardImage
                    imageSrc={currentCheckin.imageChanDung}
                    size={settings.avatarSize}
                  />
                )}

                {/* Module 4: Score Indicator - Chỉ hiển thị khi có ảnh chụp */}
                {shouldShowScore && (
                  <ScoreIndicator
                    score={statusRes.Score}
                    threshold={scoreCompareFace}
                    type={statusRes.type === TYPE.SUCCESS ? "SUCCESS" : statusRes.type === TYPE.ERROR ? "ERROR" : null}
                  />
                )}

                {/* Module 2 & 3: Video hoặc Ảnh chụp */}
                {shouldShowVideo ? (
                  // Hiển thị VideoStream khi có dữ liệu thẻ nhưng chưa có ảnh chụp
                  <VideoStream
                    videoUrl={videoFeedUrl}
                    faceStatus={faceStatus}
                    width={settings.cameraWidth}
                    height={settings.cameraHeight}
                  />
                ) : hasCapturedImage ? (
                  // Hiển thị CapturedImage khi đã có ảnh chụp
                  <CapturedImage
                    imageSrc={currentCheckin.FaceImg}
                    size={settings.avatarSize}
                    isSuccess={isSuccess}
                  />
                ) : null}
              </div>

              {/* Module 5: Thông tin user + Module 6: Status message */}
              <UserInfo
                hoVaTen={currentCheckin.HoVaTen}
                soCMND={currentCheckin.SoCMND}
                checkinAt={currentCheckin.checkinAt}
                statusMessage={
                  <StatusMessage
                    message={statusRes.message}
                    type={statusRes.type === TYPE.SUCCESS ? "SUCCESS" : statusRes.type === TYPE.ERROR ? "ERROR" : null}
                    colorSuccess={COLOR_SUCCESS}
                    colorError={COLOR_ERROR}
                  />
                }
              />
            </div>
          </div>

          {/* Module 7: Thống kê */}
          <Statistics
            checkIn={totalCheckInOut.checkIn}
            checkOut={totalCheckInOut.checkOut}
          />
        </div>

        {/* Module 8: Danh sách check-in */}
        <CheckinList
          listCheckin={listCheckin}
          loading={loadingCheckIn}
          onScroll={ScrollContainer}
        />
      </MainWrapper>
    </div>
  );
}
