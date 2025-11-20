# 📋 KẾ HOẠCH REFACTOR COMPONENT CHECKINOUT

## 🎯 MỤC TIÊU

Tách component `CheckinOut` hiện tại (730 dòng code trong 1 file) thành các component nhỏ, dễ quản lý và tái sử dụng theo từng module chức năng.

---

## 📦 CẤU TRÚC THƯ MỤC MỚI

```
src/components/CheckinOut/
├── index.js                    # Component chính (container)
├── style.js                    # Styled components chung
│
├── CardImage/                  # Module 1: Ảnh căn cước
│   ├── index.js
│   └── style.js
│
├── VideoStream/                # Module 2: Video stream từ face-server
│   ├── index.js
│   └── style.js
│
├── CapturedImage/              # Module 3: Ảnh chụp từ webcam
│   ├── index.js
│   └── style.js
│
├── ScoreIndicator/             # Module 4: Hiển thị score và icon khớp
│   ├── index.js
│   └── style.js
│
├── UserInfo/                   # Module 5: Thông tin căn cước + giờ check-in
│   ├── index.js
│   └── style.js
│
├── StatusMessage/             # Module 6: Message trạng thái
│   ├── index.js
│   └── style.js
│
├── Statistics/                 # Module 7: Thống kê check-in/check-out
│   ├── index.js
│   └── style.js
│
└── CheckinList/                # Module 8: Danh sách khách đã check-in
    ├── index.js
    └── style.js
```

---

## 🔧 CHI TIẾT TỪNG COMPONENT

### 1. 📸 **CardImage** - Ảnh căn cước từ thẻ CCCD

**Vị trí**: `src/components/CheckinOut/CardImage/`

**Chức năng**:

- Hiển thị ảnh chân dung từ chip thẻ CCCD
- Hiển thị label "Ảnh thẻ CCCD"

**Props**:

```javascript
{
  imageSrc: string,        // base64 image từ currentCheckin.imageChanDung
  size: number             // Kích thước avatar (mặc định: 240)
}
```

**Code mẫu**:

```javascript
// CardImage/index.js
import React from "react";
import { Avatar } from "antd";
import { CardImageWrapper } from "./style";

const CardImage = ({ imageSrc, size = 240 }) => {
  return (
    <CardImageWrapper>
      <Avatar size={size} src={imageSrc} className="card-avatar" />
      <p>Ảnh thẻ CCCD</p>
    </CardImageWrapper>
  );
};

export default CardImage;
```

---

### 2. 🎥 **VideoStream** - Video stream từ face-server

**Vị trí**: `src/components/CheckinOut/VideoStream/`

**Chức năng**:

- Hiển thị video stream từ face-server (URL: `/video_feed`)
- Hiển thị overlay message từ BE (face_status)
- Xử lý lỗi khi không load được video

**Props**:

```javascript
{
  videoUrl: string,        // URL video feed từ face-server
  faceStatus: {            // Status từ face-server
    status: string,         // "waiting" | "adjusting" | "ready" | "capturing" | "error"
    message: string
  },
  width: number,            // Chiều rộng video
  height: number           // Chiều cao video
}
```

**Code mẫu**:

```javascript
// VideoStream/index.js
import React from "react";
import { VideoStreamWrapper } from "./style";

const VideoStream = ({ videoUrl, faceStatus, width = 240, height = 240 }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "waiting":
        return "#ff4d4f";
      case "adjusting":
        return "#faad14";
      case "ready":
        return "#52c41a";
      case "capturing":
        return "#1890ff";
      case "error":
        return "#ff4d4f";
      default:
        return "#8c8c8c";
    }
  };

  return (
    <VideoStreamWrapper width={width} height={height}>
      <img
        src={videoUrl}
        alt="Video feed"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          objectFit: "cover",
        }}
        onError={(e) => {
          console.error("Error loading video feed:", e);
          e.target.src = "";
        }}
      />
      {faceStatus.status !== "idle" && (
        <div
          className="status-overlay"
          style={{ color: getStatusColor(faceStatus.status) }}
        >
          {faceStatus.message}
        </div>
      )}
    </VideoStreamWrapper>
  );
};

export default VideoStream;
```

---

### 3. 📷 **CapturedImage** - Ảnh chụp từ webcam

**Vị trí**: `src/components/CheckinOut/CapturedImage/`

**Chức năng**:

- Hiển thị ảnh chụp từ webcam (base64 từ face-server)
- Hiển thị label "Ảnh chụp"
- Fallback về VideoStream nếu chưa có ảnh

**Props**:

```javascript
{
  imageSrc: string,        // base64 image từ currentCheckin.FaceImg
  size: number,            // Kích thước avatar
  fallbackVideo: ReactNode // Component VideoStream nếu chưa có ảnh
}
```

**Code mẫu**:

```javascript
// CapturedImage/index.js
import React from "react";
import { Avatar } from "antd";
import { CapturedImageWrapper } from "./style";

const CapturedImage = ({ imageSrc, size = 240, fallbackVideo }) => {
  return (
    <CapturedImageWrapper>
      {!imageSrc ? (
        <div className="screen-wrapper">{fallbackVideo}</div>
      ) : (
        <Avatar size={size} src={imageSrc} className="captured-avatar" />
      )}
      <p>Ảnh chụp</p>
    </CapturedImageWrapper>
  );
};

export default CapturedImage;
```

---

### 4. ✅ **ScoreIndicator** - Hiển thị score và icon khớp

**Vị trí**: `src/components/CheckinOut/ScoreIndicator/`

**Chức năng**:

- Hiển thị icon khớp (CheckCircle) hoặc không khớp (CloseCircle)
- Hiển thị text "Khớp" hoặc "Không khớp"
- Hiển thị score (nếu có)

**Props**:

```javascript
{
  score: number | null,         // Score từ API so sánh
  threshold: number,             // Ngưỡng khớp (mặc định: 60)
  type: string | null            // "SUCCESS" | "ERROR" | null
}
```

**Code mẫu**:

```javascript
// ScoreIndicator/index.js
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
```

---

### 5. 👤 **UserInfo** - Thông tin căn cước và giờ check-in

**Vị trí**: `src/components/CheckinOut/UserInfo/`

**Chức năng**:

- Hiển thị họ tên
- Hiển thị số CCCD (ẩn một phần)
- Hiển thị giờ check-in
- Hiển thị status message (từ StatusMessage component)

**Props**:

```javascript
{
  hoVaTen: string,              // Họ và tên
  soCMND: string,               // Số căn cước
  checkinAt: number | null,     // Timestamp check-in
  statusMessage: ReactNode       // Component StatusMessage
}
```

**Code mẫu**:

```javascript
// UserInfo/index.js
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
```

---

### 6. 💬 **StatusMessage** - Message trạng thái

**Vị trí**: `src/components/CheckinOut/StatusMessage/`

**Chức năng**:

- Hiển thị message trạng thái (thành công, lỗi, chờ...)
- Hiển thị icon tương ứng
- Màu sắc theo type (SUCCESS/ERROR)

**Props**:

```javascript
{
  message: string,              // Nội dung message
  type: string | null,          // "SUCCESS" | "ERROR" | null
  colorSuccess: string,         // Màu khi thành công
  colorError: string            // Màu khi lỗi
}
```

**Code mẫu**:

```javascript
// StatusMessage/index.js
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
```

---

### 7. 📊 **Statistics** - Thống kê check-in/check-out

**Vị trí**: `src/components/CheckinOut/Statistics/`

**Chức năng**:

- Hiển thị tổng số đã check-in
- Hiển thị tổng số đã checkout
- Hiển thị dạng card với icon

**Props**:

```javascript
{
  checkIn: number,              // Tổng số check-in
  checkOut: number              // Tổng số checkout
}
```

**Code mẫu**:

```javascript
// Statistics/index.js
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
```

---

### 8. 📋 **CheckinList** - Danh sách khách đã check-in

**Vị trí**: `src/components/CheckinOut/CheckinList/`

**Chức năng**:

- Hiển thị danh sách khách đã check-in
- Infinite scroll
- Hiển thị thông tin: ảnh, tên, CCCD, giờ check-in, trạng thái

**Props**:

```javascript
{
  listCheckin: Array,           // Danh sách check-in
  loading: boolean,            // Loading state
  onScroll: Function,          // Callback khi scroll
  defaultUserImage: string     // Ảnh mặc định
}
```

**Code mẫu**:

```javascript
// CheckinList/index.js
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
```

---

## 🔄 COMPONENT CHÍNH (CheckinOut/index.js) SAU KHI REFACTOR

**Cấu trúc mới**:

```javascript
import React, { useEffect, useState, useRef } from "react";
import { MainWrapper } from "./style";
import { Spin } from "antd";
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

const CheckinOut = () => {
  // ... tất cả logic hiện tại (state, useEffect, handlers)

  // Video feed URL
  const videoFeedUrl = faceServerService.getVideoFeedUrl();

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

            <div className="greeting-title">Xin chào quý khách</div>

            <div className="greeting-body">
              <div className="empty"></div>

              <div className="face-wrapper">
                {/* Module 1: Ảnh căn cước */}
                <CardImage
                  imageSrc={currentCheckin.imageChanDung}
                  size={settings.avatarSize}
                />

                {/* Module 4: Score Indicator */}
                <ScoreIndicator
                  score={statusRes.Score}
                  threshold={scoreCompareFace}
                  type={statusRes.type}
                />

                {/* Module 3: Ảnh chụp (có fallback VideoStream) */}
                <CapturedImage
                  imageSrc={currentCheckin.FaceImg}
                  size={settings.avatarSize}
                  fallbackVideo={
                    <VideoStream
                      videoUrl={videoFeedUrl}
                      faceStatus={faceStatus}
                      width={settings.cameraWidth}
                      height={settings.cameraHeight}
                    />
                  }
                />
              </div>

              {/* Module 5: Thông tin user + Module 6: Status message */}
              <UserInfo
                hoVaTen={currentCheckin.HoVaTen}
                soCMND={currentCheckin.SoCMND}
                checkinAt={currentCheckin.checkinAt}
                statusMessage={
                  <StatusMessage
                    message={statusRes.message}
                    type={statusRes.type}
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
};

export default CheckinOut;
```

---

## 📝 CÁC BƯỚC THỰC HIỆN

### **Bước 1: Tạo cấu trúc thư mục**

```bash
mkdir -p src/components/CheckinOut/{CardImage,VideoStream,CapturedImage,ScoreIndicator,UserInfo,StatusMessage,Statistics,CheckinList}
```

### **Bước 2: Tạo các component con**

- Tạo từng component theo thứ tự: CardImage → VideoStream → CapturedImage → ScoreIndicator → UserInfo → StatusMessage → Statistics → CheckinList
- Mỗi component có file `index.js` và `style.js` riêng

### **Bước 3: Tách style**

- Di chuyển các style liên quan từ `CheckinOut/style.js` vào từng component
- Giữ lại style chung trong `CheckinOut/style.js`

### **Bước 4: Refactor component chính**

- Import các component con
- Thay thế JSX cũ bằng component mới
- Giữ nguyên toàn bộ logic (state, useEffect, handlers)

### **Bước 5: Test**

- Kiểm tra từng component hoạt động đúng
- Kiểm tra toàn bộ flow check-in
- Kiểm tra responsive

---

## ✅ LỢI ÍCH SAU KHI REFACTOR

1. **Dễ bảo trì**: Mỗi component có trách nhiệm rõ ràng
2. **Tái sử dụng**: Có thể dùng lại các component ở nơi khác
3. **Dễ test**: Test từng component độc lập
4. **Code sạch hơn**: File chính ngắn gọn, dễ đọc
5. **Team work**: Nhiều người có thể làm việc song song
6. **Performance**: Có thể optimize từng component riêng

---

## 🎯 KẾT QUẢ MONG ĐỢI

- **File chính**: Giảm từ ~730 dòng xuống ~200-300 dòng
- **Mỗi component con**: ~50-100 dòng code
- **Tổng số file**: 1 file chính + 8 component con = 9 files
- **Dễ đọc và maintain hơn rất nhiều**

---

## 📌 LƯU Ý

1. **Giữ nguyên logic**: Không thay đổi business logic, chỉ tách UI
2. **Props rõ ràng**: Mỗi component nhận props cần thiết, không quá nhiều
3. **Style tách biệt**: Mỗi component có style riêng, tránh conflict
4. **Default values**: Đặt giá trị mặc định cho props
5. **Error handling**: Xử lý lỗi trong từng component

---

Bạn có muốn tôi bắt đầu tạo các component này không?
