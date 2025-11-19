# Hệ thống Check-in Standalone

Dự án này là phiên bản standalone của chức năng CheckinOutV5, được tách ra từ dự án ClientV2 để tạo thành một ứng dụng độc lập, dễ quản lý và bảo trì.

## 📋 Chức năng

### 1. **Kết nối WebSocket để quét thẻ CCCD**
   - Kết nối với máy quét thẻ qua WebSocket (port 8000)
   - Nhận dữ liệu từ chip thẻ CCCD (thông tin cá nhân, ảnh chân dung)

### 2. **Hiển thị thông tin người dùng**
   - Hiển thị ảnh chân dung từ thẻ CCCD
   - Hiển thị thông tin: Họ tên, số CCCD, ngày sinh, ngày cấp, hộ khẩu

### 3. **Chụp ảnh khuôn mặt bằng Webcam**
   - Sử dụng webcam để chụp ảnh khuôn mặt người dùng
   - Tự động phát hiện khuôn mặt bằng face-api.js

### 4. **So sánh khuôn mặt**
   - So sánh ảnh chụp với ảnh trên thẻ CCCD
   - Sử dụng API so sánh khuôn mặt (port 8010)
   - Ngưỡng khớp: Score ≥ 60

### 5. **Thực hiện Check-in**
   - Tự động check-in khi khuôn mặt khớp
   - Lưu thông tin vào hệ thống
   - Hiển thị thông báo kết quả

### 6. **Danh sách người đã check-in**
   - Hiển thị danh sách người đã check-in
   - Hỗ trợ phân trang và scroll infinite
   - Hiển thị thời gian check-in

### 7. **Thống kê**
   - Tổng số người đã check-in trong ngày
   - Tổng số người đã checkout trong ngày

## 🚀 Cài đặt

### Yêu cầu
- Node.js >= 14.x
- npm hoặc yarn

### Các bước cài đặt

1. **Clone hoặc copy dự án**
   ```bash
   cd checkin-standalone
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Copy các file tài nguyên**
   
   Bạn cần copy các file sau từ dự án ClientV2:
   
   - **Face-api.js models**: Copy thư mục `ClientV2/public/model/` → `checkin-standalone/public/model/`
   - **CSS files**: Copy các file CSS từ `ClientV2/public/css/` → `checkin-standalone/public/css/`
   - **Images**: Copy file `ClientV2/src/image/user.jpg` → `checkin-standalone/src/assets/images/user.jpg`
   - **Favicon**: Copy `ClientV2/public/favicon.png` → `checkin-standalone/public/favicon.png`

4. **Cấu hình**
   
   Chỉnh sửa file `src/config/settings.js` để cấu hình:
   - API endpoints
   - Socket ports
   - Score threshold

5. **Chạy ứng dụng**
   ```bash
   npm start
   # hoặc
   yarn start
   ```

   Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📁 Cấu trúc dự án

```
checkin-standalone/
├── public/
│   ├── model/              # Face-api.js models (cần copy từ ClientV2)
│   ├── css/                # CSS files (cần copy từ ClientV2)
│   ├── favicon.png         # Favicon (cần copy từ ClientV2)
│   └── index.html          # HTML template
├── src/
│   ├── assets/
│   │   └── images/         # Images (cần copy user.jpg)
│   ├── components/
│   │   └── CheckinOut/     # Component chính
│   │       ├── index.js    # Component logic
│   │       └── style.js    # Styled components
│   ├── config/
│   │   └── settings.js     # Cấu hình
│   ├── redux/
│   │   └── auth/           # Redux auth (đơn giản hóa)
│   ├── services/
│   │   ├── api.js          # API helpers
│   │   └── checkinApi.js   # Check-in API
│   ├── App.js              # App component
│   ├── index.js            # Entry point
│   └── store.js            # Redux store
├── config-overrides.js      # React-app-rewired config
├── package.json
└── README.md
```

## ⚙️ Cấu hình

### Settings (`src/config/settings.js`)

```javascript
export default {
  // API endpoints
  apiInOut: "https://apigocheckinv4.gosol.com.vn/api/v1/",
  apiInOutv4: "https://apigocheckinv4.gosol.com.vn/api/v4/",
  
  // Socket configuration
  socketPort: "8000",        // Port cho WebSocket quét thẻ
  socketAPIPort: "8010",    // Port cho API so sánh khuôn mặt
  
  // Face comparison threshold
  scoreCompare: 60,          // Ngưỡng điểm khớp khuôn mặt
};
```

## 🔌 Kết nối

### WebSocket (Quét thẻ CCCD)
- **Port**: 8000
- **Protocol**: WebSocket
- **Events**:
  - `READ`: Đang đọc thẻ
  - `CARD_RESULT`: Kết quả đọc thẻ thành công
  - `EMPTY`: Thẻ đã được lấy ra
  - `FAILURE`: Lỗi đọc thẻ

### API (So sánh khuôn mặt)
- **Endpoint**: `http://localhost:8010/api/v4/compare`
- **Method**: POST
- **Body**:
  ```json
  {
    "AnhCCCD": "base64_image_from_card",
    "AnhChanDung": "base64_image_from_webcam"
  }
  ```
- **Response**:
  ```json
  {
    "Score": 85,
    "Status": "Success"
  }
  ```

## 🛠️ Build cho production

```bash
npm run build
# hoặc
yarn build
```

File build sẽ được tạo trong thư mục `build/`

## 📝 Ghi chú

- Dự án này chỉ giữ lại chức năng CheckinOutV5, đã loại bỏ các dependencies không cần thiết
- Redux được đơn giản hóa, chỉ giữ lại phần auth cần thiết
- Cần đảm bảo máy quét thẻ và API so sánh khuôn mặt đang chạy trước khi sử dụng
- Face-api.js models cần được copy từ dự án gốc để hoạt động

## 🐛 Troubleshooting

### Lỗi không load được face-api models
- Kiểm tra xem đã copy thư mục `model/` vào `public/` chưa
- Kiểm tra console để xem lỗi cụ thể

### Lỗi kết nối WebSocket
- Kiểm tra máy quét thẻ có đang chạy không
- Kiểm tra port 8000 có bị chiếm dụng không
- Kiểm tra CORS settings

### Lỗi API so sánh khuôn mặt
- Kiểm tra API server có đang chạy tại port 8010 không
- Kiểm tra network tab trong DevTools

## 📄 License

Giữ nguyên license từ dự án gốc.

