# 🔄 Hướng dẫn tích hợp Face-Server thay thế Face-api.js

## 📊 PHÂN TÍCH FACE-SERVER

### Cách hoạt động hiện tại của face-server:

1. **Video Stream (HTTP)**
   - Endpoint: `GET http://localhost:5000/video_feed`
   - Format: MJPEG stream (multipart/x-mixed-replace)
   - Hiển thị video từ camera RTSP với overlay (khung hướng dẫn, thông báo)

2. **Socket.IO Communication**
   - Server: Flask-SocketIO chạy trên port 5000
   - Events:
     - **Client → Server**: `start_capture` (bật chế độ chụp)
     - **Server → Client**: `capture_success` (trả về URL ảnh đã chụp)
   - Khi nhận `start_capture`:
     - Server bật MediaPipe face detection
     - Kiểm tra điều kiện: 1 người, trong zone, đúng khoảng cách, căn giữa
     - Sau 60 frame liên tiếp → Tự động chụp và cắt ảnh
     - Gửi URL ảnh về client qua `capture_success`
     - Tự động tắt chế độ chụp

3. **Face Detection Logic**
   - Sử dụng **MediaPipe** (thay vì face-api.js)
   - Kiểm tra:
     - Mặt nằm trong Safe Zone (180x260px, căn giữa)
     - Chỉ 1 người trong khung
     - Khoảng cách phù hợp (MIN_FACE_RATIO - MAX_FACE_RATIO)
     - Căn giữa (CENTER_TOLERANCE = 50px)
   - Sau 60 frame liên tiếp đạt điều kiện → Chụp ảnh

4. **Ảnh trả về**
   - Lưu tại: `captured_faces/face_{timestamp}.jpg`
   - URL: `http://localhost:5000/images/{filename}`
   - Format: JPG (đã cắt theo Safe Zone)

---

## 🎯 HƯỚNG TÍCH HỢP

### Bước 1: Cài đặt Socket.IO Client

```bash
npm install socket.io-client
```

### Bước 2: Thay thế Webcam Component

**Hiện tại:**
- Sử dụng `react-webcam` để truy cập webcam
- Sử dụng `face-api.js` để phát hiện khuôn mặt
- Tự động chụp khi phát hiện mặt

**Thay thế bằng:**
- Hiển thị video stream từ face-server: `<img src="http://localhost:5000/video_feed" />`
- Kết nối Socket.IO để nhận ảnh đã chụp
- Gửi event `start_capture` khi có thẻ CCCD

### Bước 3: Luồng hoạt động mới

```
1. User quét thẻ CCCD → Nhận dữ liệu qua WebSocket (port 8000)
2. Hiển thị thông tin từ thẻ
3. Kết nối Socket.IO với face-server (port 5000)
4. Hiển thị video stream từ face-server
5. Gửi event 'start_capture' → Server bật chế độ chụp
6. Server tự động phát hiện và chụp ảnh (MediaPipe)
7. Nhận event 'capture_success' với URL ảnh
8. Download ảnh từ URL → Convert sang base64
9. Gọi API so sánh khuôn mặt
10. Nếu khớp → Check-in
```

---

## 📝 CHI TIẾT TRIỂN KHAI

### 1. Cập nhật package.json

Thêm dependency:
```json
"socket.io-client": "^4.5.4"
```

### 2. Tạo service kết nối face-server

**File mới**: `src/services/faceServerService.js`
- Kết nối Socket.IO đến `http://localhost:5000`
- Quản lý events: `start_capture`, `capture_success`
- Helper function để download ảnh và convert sang base64

### 3. Cập nhật CheckinOut Component

**Thay đổi:**
- ❌ Xóa: `react-webcam`, `face-api.js` imports
- ❌ Xóa: `handlePlay()`, `checkBeforeSend()` với face-api logic
- ❌ Xóa: Load face-api models
- ✅ Thêm: Socket.IO connection đến face-server
- ✅ Thêm: Hiển thị video stream từ `/video_feed`
- ✅ Thêm: Gửi `start_capture` khi có thẻ CCCD
- ✅ Thêm: Nhận `capture_success` và xử lý ảnh

### 4. Cập nhật settings.js

Thêm cấu hình:
```javascript
faceServerUrl: "http://localhost:5000",
faceServerSocketPort: 5000,
```

---

## 🔧 CẤU TRÚC CODE MỚI

### Service Layer:
```
src/services/
├── faceServerService.js    # NEW: Socket.IO connection + image download
├── api.js                  # Giữ nguyên
├── authApi.js             # Giữ nguyên
└── checkinApi.js          # Giữ nguyên
```

### Component Changes:
```
src/components/CheckinOut/
├── index.js                # UPDATE: Thay webcam bằng video stream + Socket.IO
└── style.js               # UPDATE: Style cho video stream
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Face-server phải chạy trước** (port 5000)
2. **CORS**: Face-server đã cấu hình CORS cho `localhost:3000`
3. **Ảnh format**: Server trả về URL, cần download và convert sang base64
4. **Timing**: Gửi `start_capture` ngay sau khi nhận dữ liệu thẻ CCCD
5. **Error handling**: Xử lý trường hợp face-server không kết nối được

---

## 🎨 UI CHANGES

### Thay đổi giao diện:
- Thay `<Webcam>` → `<img src="http://localhost:5000/video_feed" />`
- Video stream sẽ hiển thị:
  - Khung hướng dẫn (xanh/đỏ/vàng)
  - Thông báo: "HAY DUA MAT VAO KHUNG", "HAY CAN GIUA", etc.
  - Tự động chụp khi đủ điều kiện

---

## 📋 CHECKLIST TRIỂN KHAI

- [ ] Cài đặt `socket.io-client`
- [ ] Tạo `faceServerService.js`
- [ ] Cập nhật `settings.js` với face-server config
- [ ] Cập nhật `CheckinOut/index.js`:
  - [ ] Xóa webcam và face-api logic
  - [ ] Thêm Socket.IO connection
  - [ ] Thêm video stream display
  - [ ] Thêm event handlers
- [ ] Test kết nối face-server
- [ ] Test luồng chụp ảnh
- [ ] Test so sánh khuôn mặt với ảnh từ face-server

---

## 🔄 SO SÁNH: TRƯỚC vs SAU

| Tiêu chí | Trước (face-api.js) | Sau (face-server) |
|----------|---------------------|-------------------|
| **Camera** | Webcam (browser) | RTSP Camera IP |
| **AI Library** | face-api.js (client) | MediaPipe (server) |
| **Detection** | Client-side | Server-side |
| **Chụp ảnh** | Tự động khi detect | Tự động sau 60 frame |
| **Giao thức** | Webcam API | HTTP Stream + Socket.IO |
| **Ảnh trả về** | Base64 từ webcam | URL từ server → Download |
| **Hướng dẫn** | Không có | Có khung và thông báo |

---

## ✅ LỢI ÍCH

1. ✅ **Chất lượng ảnh tốt hơn**: Camera RTSP chuyên nghiệp
2. ✅ **Hướng dẫn người dùng**: Khung và thông báo rõ ràng
3. ✅ **Giảm tải client**: AI chạy trên server
4. ✅ **Kiểm tra nghiêm ngặt**: 60 frame liên tiếp, căn giữa, khoảng cách
5. ✅ **Không cần load models**: Không cần face-api.js models

---

## 🚀 BẮT ĐẦU TRIỂN KHAI

Bạn có muốn tôi bắt đầu implement ngay không? Tôi sẽ:
1. Tạo `faceServerService.js`
2. Cập nhật `CheckinOut` component
3. Cập nhật `settings.js`
4. Test và fix lỗi

