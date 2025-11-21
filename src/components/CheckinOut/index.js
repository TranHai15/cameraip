import React, { useEffect, useState, useRef } from "react";
import { MainWrapper } from "./style";
import { Spin, message } from "antd";
import moment from "moment";
import settings from "../../config/settings";
import checkinApi from "../../services/checkinApi";
import faceServerService from "../../services/faceServerService";
import anhbg from "../../assets/insert-card-animation-gif-download-6988052.webp";
// Import các component con
import CardImage from "./CardImage";
import VideoStream from "./VideoStream";
import CapturedImage from "./CapturedImage";
import UserInfo from "./UserInfo";
import StatusMessage from "./StatusMessage";
import Statistics from "./Statistics";
import CheckinList from "./CheckinList";
import StatusMessage2 from "./StatusMessage2";

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
    console.log("📋 [INIT] Load danh sách check-in ban đầu...");
    GetListCheckin(filterData);
    console.log("🔌 [INIT] Khởi tạo kết nối WebSocket quét thẻ...");
    handleConnectSocketScan();

    // Kết nối face-server
    console.log("🔌 [INIT] Khởi tạo kết nối face-server...");
    faceServerService.connect(
      // onCaptureSuccess: Khi nhận được ảnh từ face-server
      (base64Image) => {
        console.log("📸 [INIT] Nhận ảnh từ face-server, bắt đầu so sánh...");
        if (!refCallingApi.current && currentRefCheckin.current) {
          console.log("✅ [INIT] Điều kiện hợp lệ, gọi handleCompareFace");
          handleCompareFace(base64Image, currentRefCheckin.current);
        } else {
          console.log(
            "⚠️ [INIT] Bỏ qua ảnh vì đang xử lý API hoặc chưa có thông tin thẻ"
          );
        }
      },
      // onError: Xử lý lỗi kết nối
      (error) => {
        console.error("❌ [INIT] Lỗi kết nối face-server:", error);
        message.warning(
          "Không thể kết nối đến face-server. Vui lòng kiểm tra lại."
        );
      },
      // onFaceStatus: Nhận status và message từ BE
      (data) => {
        console.log("📊 [INIT] Nhận face status:", data);
        if (data && data.status && data.message) {
          console.log(
            `🔄 [INIT] Cập nhật face status: ${data.status} - ${data.message}`
          );
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

    console.log("📊 [INIT] Load thống kê check-in/check-out ban đầu...");
    getTotalCheckInOut();

    return () => {
      console.log("🧹 [CLEANUP] Dọn dẹp resources khi component unmount...");
      if (delayChamCong) {
        console.log("⏰ [CLEANUP] Clear interval delayChamCong");
        clearInterval(delayChamCong);
      }
      if (socketRef.current) {
        console.log("🔌 [CLEANUP] Đóng kết nối WebSocket");
        socketRef.current.close();
      }
      // Disconnect face-server
      console.log("🔌 [CLEANUP] Ngắt kết nối face-server");
      faceServerService.disconnect();
      console.log("✅ [CLEANUP] Hoàn thành dọn dẹp");
    };
  }, []);

  const getTotalCheckInOut = () => {
    console.log("📊 [STATS] Lấy thống kê check-in/check-out trong ngày...");
    checkinApi
      .TongHopNgay()
      .then((res) => {
        console.log("📥 [STATS] Response thống kê:", res);
        if (res && res.data && res.data.Status > 0) {
          const data = res.data.Data;
          console.log("✅ [STATS] Thống kê thành công:", {
            tongCheckIn: data.Tong,
            daVe: data.DaVe,
          });
          setTotalCheckinOut({
            checkIn: data.Tong,
            checkOut: data.DaVe,
          });
        } else {
          console.log("❌ [STATS] Lỗi lấy thống kê:", res?.data?.Message);
          message.destroy();
          message.warning(res?.data?.Message || "Lỗi khi lấy thống kê");
        }
      })
      .catch((err) => {
        console.log("❌ [STATS] Lỗi API thống kê:", err);
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
    console.log(
      `🔌 [SOCKET_CARD] Bắt đầu kết nối WebSocket đến port ${settings.socketPort}...`
    );
    const socket = new WebSocket(`ws://localhost:${settings.socketPort}`);
    socketRef.current = socket;
    console.log("🔌 [SOCKET_CARD] WebSocket instance được tạo");

    socket.onopen = () => {
      console.log(
        `✅ [SOCKET_CARD] Kết nối WebSocket thành công đến port ${settings.socketPort}`
      );
      console.log(
        "📡 [SOCKET_CARD] Sẵn sàng nhận dữ liệu từ thiết bị quét thẻ CCCD"
      );
    };

    socketRef.current.onmessage = (event) => {
      console.log("📨 [SOCKET_CARD] Nhận message từ WebSocket:", event.data);
      const data = isJsonString(event.data) ? JSON.parse(event.data) : {};
      console.log("📨 [SOCKET_CARD] Dữ liệu đã parse:", data);

      if (data.EventName === "READ") {
        console.log("🔄 [SOCKET_CARD] Event READ - Bắt đầu đọc thẻ...");
        setLoadingDataScan(true);
      }

      if (data.NewState === "EMPTY") {
        console.log(
          "🗑️ [SOCKET_CARD] Event EMPTY - Thẻ đã được lấy ra khỏi thiết bị"
        );
        console.log("🔄 [SOCKET_CARD] Reset toàn bộ trạng thái...");
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
        console.log("⏹️ [SOCKET_CARD] Dừng capture ảnh khuôn mặt");
        faceServerService.stopCapture();
        console.log("✅ [SOCKET_CARD] Đã reset xong, chờ thẻ mới");
      }

      if (data.EventName === "CARD_RESULT") {
        console.log("✅ [SOCKET_CARD] Event CARD_RESULT - Đọc thẻ thành công!");
        console.log("📋 [SOCKET_CARD] Thông tin thẻ CCCD:", {
          hoVaTen: data.PersonalInfo.personName,
          soCMND: data.PersonalInfo.idCode,
          ngaySinh: data.PersonalInfo.dateOfBirth,
          gioiTinh: data.PersonalInfo.gender,
          hasChipFace: !!data.ChipFace,
          hasResidencePlace: !!data.PersonalInfo.residencePlace,
        });

        setLoadingDataScan(false);
        const checkinAt = Date.now();
        console.log(
          `🕐 [SOCKET_CARD] Timestamp checkin: ${checkinAt} (${new Date(
            checkinAt
          ).toLocaleString()})`
        );

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

        console.log("📝 [SOCKET_CARD] Dữ liệu checkin đã chuẩn bị:", {
          hoVaTen: dataReaded.HoVaTen,
          soCMND: dataReaded.SoCMND,
          lyDoGap: dataReaded.LyDoGap,
        });

        setStatusRes({
          message: settings.defaultMessages.waitingFace,
          type: null,
          Score: null,
        });
        setStateScan(null);
        console.log("🔄 [SOCKET_CARD] Chuyển trạng thái: chờ chụp khuôn mặt");
        setCurrentCheckin(dataReaded);
        currentRefCheckin.current = dataReaded;

        // Hiển thị ảnh thẻ trong 2 giây, sau đó ẩn đi
        console.log("🖼️ [SOCKET_CARD] Hiển thị ảnh thẻ CCCD trong 2 giây");
        setShowCardImage(true);
        setTimeout(() => {
          console.log("🖼️ [SOCKET_CARD] Ẩn ảnh thẻ, chuyển sang camera");
          setShowCardImage(false);
        }, 0); // 2 giây

        // Gửi lệnh bắt đầu chụp ảnh từ face-server ngay lập tức (bỏ delay)
        console.log("📷 [SOCKET_CARD] Khởi động face-server capture...");
        faceServerService.startCapture();
        console.log(
          "✅ [SOCKET_CARD] Đã gửi lệnh start_capture, chờ ảnh khuôn mặt"
        );
      }

      if (data.Status === "FAILURE") {
        console.log("❌ [SOCKET_CARD] Event FAILURE - Lỗi đọc thẻ CCCD");
        console.log("🔄 [SOCKET_CARD] Reset trạng thái do lỗi...");
        setLoadingDataScan(false);
        setStatusRes({
          message: settings.defaultMessages.cardError,
          type: TYPE.ERROR,
          Score: null,
        });
        setStateScan(null);
        console.log("✅ [SOCKET_CARD] Đã reset, chờ đọc thẻ lại");
      }
    };

    socketRef.current.onerror = (error) => {
      console.log("❌ [SOCKET_CARD] Lỗi WebSocket:", error);
      setLoadingDataScan(false);
    };

    socketRef.current.onclose = (event) => {
      console.log("🔌 [SOCKET_CARD] Kết nối WebSocket đã đóng");
      setLoadingDataScan(false);
      const reason = logEventErrorSocket(event);
      console.log(`🔍 [SOCKET_CARD] Lý do đóng kết nối: ${reason}`);
      console.log("⚠️ [SOCKET_CARD] Cần kiểm tra thiết bị quét thẻ CCCD");
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
    console.log("📋 [LIST] Lấy danh sách check-in...");
    console.log("🔍 [LIST] Filter:", {
      pageSize: filterData.PageSize,
      pageNumber: filterData.PageNumber,
      type: settings.checkinListType,
    });

    setLoadingCheckIn(true);
    checkinApi
      .GetList({
        PageSize: filterData.PageSize,
        PageNumber: filterData.PageNumber,
      })
      .then((response) => {
        console.log("📥 [LIST] Response danh sách:", response);
        setLoadingCheckIn(false);
        if (response && response.data && response.data.Status > 0) {
          let newListCheckin = [...listCheckinRef.current];
          const newItems = response.data.Data || [];
          const TotalRow = response.data.TotalRow;

          if (filterData.PageNumber === 1) {
            console.log("📄 [LIST] Load trang đầu tiên, thay thế danh sách");
            newListCheckin = newItems;
          } else {
            console.log(
              `📄 [LIST] Load trang ${filterData.PageNumber}, thêm vào danh sách hiện tại`
            );
            newItems.forEach((item) => newListCheckin.push(item));
          }

          console.log("✅ [LIST] Cập nhật danh sách thành công:", {
            totalItems: newListCheckin.length,
            totalRow: TotalRow,
            newItemsCount: newItems.length,
          });

          setListCheckin(newListCheckin);
          setFilterData((prevFilter) => ({ ...prevFilter, TotalRow }));
        } else {
          console.log("❌ [LIST] Lỗi lấy danh sách:", response?.data?.Message);
        }
      })
      .catch((err) => {
        console.log("❌ [LIST] Lỗi API danh sách:", err);
        setLoadingCheckIn(false);
        message.destroy();
        console.log("error notification");
        message.warning(err.toString());
      });
  };

  const CheckIn = (currentCheckin, score) => {
    console.log("📝 [CHECKIN_API] Bắt đầu xử lý check-in...");
    console.log("👤 [CHECKIN_API] Thông tin check-in:", {
      hoVaTen: currentCheckin.HoVaTen,
      soCMND: currentCheckin.SoCMND,
      lyDoGap: currentCheckin.LyDoGap,
      score: score,
      checkinAt: new Date(currentCheckin.checkinAt).toLocaleString(),
    });

    const param = { ...currentCheckin };
    console.log("🔄 [CHECKIN_API] Chuyển đổi định dạng ngày tháng...");

    param.NgaySinh =
      param.NgaySinh !== ""
        ? moment(param.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.NgayCapCMND =
      param.NgayCapCMND !== "" && param.NgayCapCMND
        ? moment(param.NgayCapCMND, "DD/MM/YYYY").format("YYYY-MM-DD")
        : "";
    param.AnhChanDungBase64 = param.imageChanDung;

    console.log("📅 [CHECKIN_API] Ngày đã chuyển đổi:", {
      ngaySinh: param.NgaySinh,
      ngayCapCMND: param.NgayCapCMND,
    });

    console.log(`🔍 [CHECKIN_API] LyDoGap: ${param.LyDoGap}`);
    delete param.GioVao;

    if (param.LyDoGap === undefined) {
      console.log("❌ [CHECKIN_API] Thiếu lý do vào cơ quan");
      message.destroy();
      message.warning("Chưa chọn lý do vào cơ quan");
      return;
    } else {
      if (param.LyDoGap === 2) {
        console.log("🔍 [CHECKIN_API] LyDoGap = 2, kiểm tra đối tượng gặp...");
        if (param.GapCanBo === undefined) {
          console.log("❌ [CHECKIN_API] Thiếu đối tượng gặp");
          message.destroy();
          message.warning("Chưa chọn đối tượng gặp");
          return;
        } else {
          console.log(
            "✅ [CHECKIN_API] Có thông tin đối tượng gặp:",
            param.GapCanBo
          );
          const arr = param.GapCanBo.split("_");
          param.GapCanBo = arr[0];
          param.DonViCaNhan = arr[1];
          console.log("📝 [CHECKIN_API] Đã parse GapCanBo:", {
            gapCanBo: param.GapCanBo,
            donViCaNhan: param.DonViCaNhan,
          });
        }
      } else {
        console.log("ℹ️ [CHECKIN_API] LyDoGap != 2, set GapCanBo = 0");
        param.GapCanBo = 0;
        param.DonViCaNhan = 0;
      }
    }

    console.log("🌐 [CHECKIN_API] Gọi API Checkinv4...");
    console.log("📤 [CHECKIN_API] Parameters gửi lên:", {
      hoVaTen: param.HoVaTen,
      soCMND: param.SoCMND,
      lyDoGap: param.LyDoGap,
      gapCanBo: param.GapCanBo,
      donViCaNhan: param.DonViCaNhan,
      ngaySinh: param.NgaySinh,
      ngayCapCMND: param.NgayCapCMND,
      hasAnhChanDung: !!param.AnhChanDungBase64,
      score: score,
    });

    checkinApi
      .Checkinv4(param)
      .then((response) => {
        console.log("📥 [CHECKIN_API] Response từ API Checkinv4:", response);
        console.log(
          "📊 [CHECKIN_API] Status:",
          response?.data?.Status,
          "Message:",
          response?.data?.Message
        );

        if (response && response.data && response.data.Status > 0) {
          console.log("✅ [CHECKIN_API] CHECK-IN THÀNH CÔNG!");
          console.log(
            "🎉 [CHECKIN_API] Người dùng đã được check-in thành công"
          );

          setLoadingDataScan(false);
          setStatusRes({
            message: settings.defaultMessages.checkinSuccess,
            type: TYPE.SUCCESS,
            Score: score,
          });
          refCallingApi.current = false;
          setIsCallingApi(false);

          console.log("📊 [CHECKIN_API] Cập nhật thống kê và danh sách...");
          getTotalCheckInOut();
          setFilterData((prevFilter) => ({ ...prevFilter, PageNumber: 1 }));
          GetListCheckin({
            ...filterData,
            PageNumber: 1,
          });

          // Dọn dẹp: Reset toàn bộ state sau khi check-in thành công
          console.log(
            `⏳ [CHECKIN_API] Chờ ${settings.successMessageDelay}ms trước khi reset...`
          );
          setTimeout(() => {
            console.log(
              "🧹 [CHECKIN_API] Reset toàn bộ trạng thái sau thành công..."
            );
            setCurrentCheckin({});
            currentRefCheckin.current = null;
            setStatusRes({
              message: settings.defaultMessages.waitingCard,
              type: TYPE.ERROR,
              Score: null,
            });
            setStateScan(0); // Reset về giá trị ban đầu
            setShowCardImage(false); // Ẩn ảnh thẻ
            setLoadingDataScan(false); // Đảm bảo không còn loading
            setdelayCC(0); // Reset delay counter
            setFaceStatus({
              status: "idle",
              message: settings.defaultMessages.waitingFaceServer,
            });
            // Dừng capture nếu đang chạy
            faceServerService.stopCapture();
            console.log(
              "✅ [CHECKIN_API] Đã reset xong, sẵn sàng cho người dùng tiếp theo"
            );
          }, settings.successMessageDelay); // Sau khi hiển thị thông báo thành công
        } else {
          console.log("❌ [CHECKIN_API] CHECK-IN THẤT BẠI!");
          console.log(
            "📝 [CHECKIN_API] Lỗi:",
            response?.data?.Message || "Lỗi không xác định"
          );

          refCallingApi.current = false;
          setIsCallingApi(false);
          setLoadingDataScan(false);
          setStatusRes({
            message: response?.data?.Message || "Lỗi khi check-in",
            type: TYPE.ERROR,
            Score: score,
          });

          // Reset toàn bộ dữ liệu khi check-in thất bại để chuẩn bị cho lần mới
          console.log("🧹 [CHECKIN_API] Reset trạng thái sau thất bại...");
          setTimeout(() => {
            setCurrentCheckin({}); // Reset hoàn toàn thông tin người dùng
            currentRefCheckin.current = null;
            setStateScan(0); // Reset về giá trị ban đầu
            setdelayCC(0); // Reset delay counter
            setFaceStatus({
              status: "idle",
              message: settings.defaultMessages.waitingFaceServer,
            });
            // Dừng capture và chờ quét thẻ mới
            faceServerService.stopCapture();
            console.log(
              "✅ [CHECKIN_API] Đã reset xong, chờ người dùng thử lại"
            );
          }, 2000); // Hiển thị lỗi trong 2 giây rồi reset
        }
      })
      .catch((error) => {
        console.log("❌ [CHECKIN_API] LỖI API Checkinv4:", error);
        console.log("🔧 [CHECKIN_API] Kiểm tra kết nối đến API server");
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
    else reason = `Unknown reason (code: ${event.code})`;
    console.log(`🔌 [SOCKET_ERROR] WebSocket đóng kết nối: ${reason}`);
    return reason;
  };

  const handleRetryDelay = () => {
    console.log("⏳ [RETRY] Bắt đầu delay retry cho face detection...");
    console.log("🔄 [RETRY] Set delay counter = 1, sẽ reset sau 5 giây");
    setdelayCC(1);
    setTimeout(() => {
      console.log("✅ [RETRY] Reset delay counter về 0, cho phép retry");
      setdelayCC(0);
    }, 5000);
  };

  const handleCompareFace = async (img, currentCheckin) => {
    console.log("🔍 [FACE_COMPARE] Bắt đầu so sánh khuôn mặt...");
    console.log("👤 [FACE_COMPARE] Thông tin người dùng:", {
      hoVaTen: currentCheckin.HoVaTen,
      soCMND: currentCheckin.SoCMND,
      hasAnhCCCD: !!currentCheckin.imageChanDung,
      hasAnhChanDung: !!img,
    });

    setLoadingDataScan(true);
    setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: img });
    refCallingApi.current = true;
    setIsCallingApi(true);

    console.log(
      `🌐 [FACE_COMPARE] Gọi API CompareFace đến port ${settings.socketAPIPort}...`
    );
    const compareParams = {
      AnhCCCD: currentCheckin.imageChanDung,
      AnhChanDung: img,
    };
    console.log("📤 [FACE_COMPARE] Parameters:", {
      anhCCCDLength: compareParams.AnhCCCD?.length || 0,
      anhChanDungLength: compareParams.AnhChanDung?.length || 0,
    });

    checkinApi
      .CompareFace(compareParams)
      .then((res) => {
        console.log("📥 [FACE_COMPARE] Response từ API CompareFace:", res);
        console.log("🔍 [FACE_COMPARE] Debug response structure:");
        console.log("- res exists:", !!res);
        console.log("- res.data exists:", !!res?.data);
        console.log("- res.data.Score:", res?.data?.Score);
        console.log("- res.data.Score type:", typeof res?.data?.Score);
        console.log("- Full res.data:", JSON.stringify(res?.data, null, 2));

        const score = res?.data?.Score;
        const scoreNum = Number(score); // Convert to number just in case
        console.log(
          `🎯 [FACE_COMPARE] Điểm số so khớp: ${score} (type: ${typeof score})`
        );
        console.log(
          `🔢 [FACE_COMPARE] Score as number: ${scoreNum} (type: ${typeof scoreNum})`
        );
        console.log(
          `📊 [FACE_COMPARE] So sánh: ${scoreNum} > ${scoreCompareFace} = ${
            scoreNum > scoreCompareFace
          }`
        );

        // Use scoreNum for comparison instead of score
        if (res && res.data && scoreNum > scoreCompareFace) {
          console.log("✅ [FACE_COMPARE] So khớp khuôn mặt THÀNH CÔNG!");
          console.log("🔄 [FACE_COMPARE] Chuyển sang xử lý check-in...");
          setStateScan(STATE_SCAN.SUCCESS);
          // Set status thành công ngay lập tức để hiển thị CSS success
          setStatusRes({
            message: "Đang xử lý check-in...",
            type: TYPE.SUCCESS,
            Score: scoreNum,
          });
          CheckIn(currentCheckin, scoreNum);
        } else {
          console.log("❌ [FACE_COMPARE] So khớp khuôn mặt THẤT BẠI");
          console.log(
            `📊 [FACE_COMPARE] Điểm số quá thấp: ${scoreNum} <= ${scoreCompareFace}`
          );
          console.log(
            `⚠️ [FACE_COMPARE] Debug: scoreNum=${scoreNum}, scoreCompareFace=${scoreCompareFace}, comparison=${
              scoreNum > scoreCompareFace
            }`
          );
          handleRetryDelay();
          setTimeout(() => {
            console.log("🔄 [FACE_COMPARE] Reset ảnh và trạng thái...");
            setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: "" });
            setStateScan(STATE_SCAN.ERROR);
            setLoadingDataScan(false);
            refCallingApi.current = false;
            setIsCallingApi(false);
            setStatusRes({
              message:
                res?.data?.Status || settings.defaultMessages.faceNotMatch,
              type: TYPE.ERROR,
              Score: scoreNum,
            });
            setLoadingCheckIn(false);
            // Cho phép chụp lại sau khi thất bại
            console.log(
              `⏳ [FACE_COMPARE] Chờ ${settings.retryCaptureDelay}ms trước khi chụp lại...`
            );
            setTimeout(() => {
              if (
                currentRefCheckin.current &&
                currentRefCheckin.current.SoCMND
              ) {
                console.log(
                  "📷 [FACE_COMPARE] Khởi động capture lại sau thất bại"
                );
                faceServerService.startCapture();
              }
            }, settings.retryCaptureDelay);
          }, settings.compareFaceDelay);
        }
      })
      .catch((err) => {
        console.log("❌ [FACE_COMPARE] Lỗi API CompareFace:", err);
        console.log("🔧 [FACE_COMPARE] Kiểm tra API server trên port 8010");
        handleRetryDelay();
        refCallingApi.current = false;
        setIsCallingApi(false);
        setLoadingDataScan(false);
        // Cho phép chụp lại sau khi lỗi
        console.log(
          `⏳ [FACE_COMPARE] Chờ ${settings.retryCaptureDelay}ms trước khi chụp lại...`
        );
        setTimeout(() => {
          if (currentRefCheckin.current && currentRefCheckin.current.SoCMND) {
            console.log("📷 [FACE_COMPARE] Khởi động capture lại sau lỗi");
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

  // Ưu tiên SUCCESS trước, sau đó mới đến ERROR
  const isSuccess = statusRes.type === TYPE.SUCCESS && hasCapturedImage;
  const isError =
    !isSuccess &&
    statusRes.type === TYPE.ERROR &&
    hasCapturedImage &&
    statusRes.Score !== null;

  // Debug log
  if (hasCapturedImage) {
    console.log("🔍 Debug CapturedImage:", {
      hasCapturedImage,
      statusType: statusRes.type,
      TYPE_SUCCESS: TYPE.SUCCESS,
      TYPE_ERROR: TYPE.ERROR,
      isSuccess,
      isError,
      score: statusRes.Score,
      message: statusRes.message,
    });
  }
  // Hiển thị CardImage chỉ trong 2s đầu sau khi quét thẻ, và khi có ảnh chụp thì không hiển thị
  const shouldShowCardImage = showCardImage && !hasCapturedImage;
  // Chỉ hiển thị VideoStream sau khi ẩn CardImage (sau 2s) và chưa có ảnh chụp
  const shouldShowVideo = hasCardData && !hasCapturedImage && !showCardImage;

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
                {!shouldShowVideo && !hasCapturedImage && (
                  <div style={{ marginBottom: "50px" }}>
                    <img
                      src={anhbg}
                      alt="ảnh căn cước"
                      style={{
                        transform: "rotate(180deg)",
                        marginBottom: "10px",
                      }}
                    />
                  </div>
                )}
                {/* Module 1: Ảnh căn cước - Chỉ hiển thị trong 2s đầu sau khi quét thẻ */}
                {/* {shouldShowCardImage && (
                  <CardImage
                    imageSrc={currentCheckin.imageChanDung}
                    size={settings.avatarSize}
                  />
                )} */}

                {/* Module 2 & 3: Video hoặc Ảnh chụp */}
                {shouldShowVideo ? (
                  // Hiển thị VideoStream khi có dữ liệu thẻ nhưng chưa có ảnh chụp
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <VideoStream
                      videoUrl={videoFeedUrl}
                      faceStatus={faceStatus}
                      width={settings.cameraWidth}
                      height={settings.cameraHeight}
                    />
                  </div>
                ) : hasCapturedImage ? (
                  // Hiển thị CapturedImage khi đã có ảnh chụp (với CSS success/error)
                  <CapturedImage
                    imageSrc={currentCheckin.FaceImg}
                    size={settings.avatarSize}
                    isSuccess={isSuccess}
                    isError={isError}
                  />
                ) : null}
              </div>
            </div>

            {/* Thông báo status - Luôn dùng relative để nằm trong flow, không chồng lên */}
            <div className="status-message-container">
              {!shouldShowVideo ? (
                <StatusMessage
                  message={statusRes.message}
                  type={
                    statusRes.type === TYPE.SUCCESS
                      ? "SUCCESS"
                      : statusRes.type === TYPE.ERROR
                      ? "ERROR"
                      : null
                  }
                  colorSuccess={COLOR_SUCCESS}
                  colorError={COLOR_ERROR}
                />
              ) : (
                <StatusMessage2
                  message={faceStatus.message}
                  type={faceStatus.status}
                />
              )}
            </div>

            {/* Module 5: Thông tin user */}
            <div className="user-info-container">
              <UserInfo
                hoVaTen={currentCheckin.HoVaTen}
                soCMND={currentCheckin.SoCMND}
                checkinAt={currentCheckin.checkinAt}
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
