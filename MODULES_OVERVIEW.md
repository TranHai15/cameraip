# 📊 Tổng quan các Module và Chức năng - Checkin Standalone

## 🏗️ Cấu trúc dự án

```
checkin-standalone/
├── src/
│   ├── components/          # UI Components
│   ├── services/            # API Services
│   ├── redux/              # State Management
│   ├── config/             # Configuration
│   ├── utils/              # Utilities
│   └── assets/             # Static Assets
├── public/                 # Public Assets
└── config files
```

---

## 📦 CÁC MODULE CHÍNH

### 1. 🔐 **MODULE AUTHENTICATION (Xác thực người dùng)**

**Vị trí**: `src/components/Login/`, `src/redux/auth/`, `src/utils/auth.js`, `src/services/authApi.js`

#### Chức năng:
- ✅ **Đăng nhập** (`Login` component)
  - Form đăng nhập với username/password
  - Validation input
  - Loading state khi đăng nhập
  - Hiển thị lỗi nếu đăng nhập thất bại
  - Tự động redirect sau khi đăng nhập thành công

- ✅ **Quản lý Token**
  - Lưu token vào localStorage (`access_token`, `user_id`, `user`)
  - Lấy token từ localStorage
  - Xóa token khi logout
  - Kiểm tra trạng thái đăng nhập

- ✅ **Redux Auth State**
  - Quản lý state: `idToken`, `user`, `is_refreshing`
  - Actions: `LOGIN_REQUEST`, `LOGIN_SUCCESS`, `LOGIN_ERROR`, `LOGOUT`
  - Tự động restore session từ localStorage

- ✅ **Protected Routes**
  - Bảo vệ routes cần đăng nhập
  - Tự động redirect về `/login` nếu chưa đăng nhập

#### API:
- `POST /api/v1/Nguoidung/DangNhap` - Đăng nhập

---

### 2. 📸 **MODULE CHECK-IN (Chức năng chính)**

**Vị trí**: `src/components/CheckinOut/`

#### Chức năng:

##### 2.1. **Kết nối WebSocket - Quét thẻ CCCD**
- ✅ Kết nối WebSocket đến `ws://localhost:8000`
- ✅ Nhận sự kiện từ máy quét thẻ:
  - `READ`: Đang đọc thẻ → Hiển thị loading
  - `CARD_RESULT`: Đọc thành công → Lấy thông tin từ chip
  - `EMPTY`: Thẻ đã lấy ra → Reset form
  - `FAILURE`: Lỗi đọc thẻ → Hiển thị thông báo lỗi
- ✅ Xử lý dữ liệu từ thẻ:
  - Họ tên, số CCCD, ngày sinh, ngày cấp
  - Hộ khẩu, giới tính
  - Ảnh chân dung từ chip (base64)

##### 2.2. **Hiển thị thông tin người dùng**
- ✅ Hiển thị ảnh chân dung từ thẻ CCCD
- ✅ Hiển thị thông tin cá nhân:
  - Họ và tên
  - Số CCCD (ẩn một phần: `123........789`)
  - Giờ check-in
- ✅ Hiển thị trạng thái: "Quý khách vui lòng quét thẻ..."

##### 2.3. **Chụp ảnh khuôn mặt bằng Webcam**
- ✅ Sử dụng `react-webcam` để truy cập webcam
- ✅ Tự động phát hiện khuôn mặt bằng `face-api.js`
- ✅ Load model: `tinyFaceDetector` từ `/public/model/`
- ✅ Chụp ảnh tự động khi phát hiện khuôn mặt
- ✅ Delay mechanism để tránh chụp liên tục

##### 2.4. **So sánh khuôn mặt**
- ✅ Gọi API so sánh: `POST http://localhost:8010/api/v4/compare`
- ✅ So sánh ảnh từ webcam với ảnh trên thẻ CCCD
- ✅ Ngưỡng khớp: Score ≥ 60
- ✅ Hiển thị kết quả:
  - Score điểm khớp
  - Icon "Khớp" (xanh) hoặc "Không khớp" (đỏ)
  - Thông báo trạng thái

##### 2.5. **Thực hiện Check-in**
- ✅ Tự động check-in khi khuôn mặt khớp (score ≥ 60)
- ✅ Gửi dữ liệu lên server: `POST /api/v4/VaoRa/Vao`
- ✅ Xử lý dữ liệu:
  - Format ngày tháng (DD/MM/YYYY → YYYY-MM-DD)
  - Xử lý lý do vào cơ quan (`LyDoGap`)
  - Xử lý đối tượng gặp (nếu có)
- ✅ Hiển thị kết quả:
  - Thành công: "Checkin thành công!" (xanh)
  - Thất bại: Hiển thị message lỗi (đỏ)
- ✅ Tự động refresh danh sách và thống kê sau khi check-in

##### 2.6. **Danh sách người đã check-in**
- ✅ Hiển thị danh sách với pagination
- ✅ Infinite scroll (load thêm khi scroll xuống cuối)
- ✅ Hiển thị thông tin:
  - Ảnh chân dung
  - Họ tên
  - Số CCCD (ẩn một phần)
  - Giờ check-in
  - Trạng thái "Đã vào"
- ✅ API: `GET /api/v4/VaoRa/GetListPageBySearch?Type=2`

##### 2.7. **Thống kê**
- ✅ Tổng số người đã check-in trong ngày
- ✅ Tổng số người đã checkout trong ngày
- ✅ Hiển thị dạng card với icon
- ✅ Tự động refresh sau mỗi lần check-in
- ✅ API: `GET /api/v1/VaoRa/TongHopTheoNga`

---

### 3. 🌐 **MODULE API SERVICES**

**Vị trí**: `src/services/`

#### 3.1. **api.js** - Core API Service
- ✅ Base API functions: `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`
- ✅ Tự động thêm `Authorization: Bearer {token}` vào headers
- ✅ Xử lý lỗi:
  - 401 Unauthorized → Clear token và redirect về login
  - 403 Forbidden → Log error
  - 500-504 Server Error → Log error
  - 404 Not Found → Log error
- ✅ Xử lý FormData và JSON data
- ✅ Cleanup null/undefined values

#### 3.2. **authApi.js** - Authentication API
- ✅ `dangNhap(UserName, Password)` - Đăng nhập

#### 3.3. **checkinApi.js** - Check-in API
- ✅ `Checkinv4(params)` - Thực hiện check-in
- ✅ `GetList(params)` - Lấy danh sách check-in (với Type=2)
- ✅ `CompareFace(params)` - So sánh khuôn mặt
- ✅ `TongHopNgay(params)` - Lấy thống kê theo ngày

---

### 4. 🎨 **MODULE UI COMPONENTS**

**Vị trí**: `src/components/`

#### 4.1. **Login Component**
- Form đăng nhập với Ant Design
- Responsive design
- Styled với styled-components

#### 4.2. **CheckinOut Component**
- Layout 2 cột: Left panel (check-in) + Right panel (danh sách)
- Real-time video stream từ webcam
- Hiển thị ảnh từ thẻ CCCD và ảnh chụp
- Score indicator với icon
- Status messages với màu sắc
- Styled với styled-components

#### 4.3. **ProtectedRoute Component**
- Route guard cho các trang cần đăng nhập
- Tự động redirect nếu chưa đăng nhập

---

### 5. 🔧 **MODULE CONFIGURATION**

**Vị trí**: `src/config/settings.js`

#### Cấu hình:
- ✅ API Endpoints:
  - `apiInOut`: API v1 base URL
  - `apiInOutv2`: API v2 base URL
  - `apiInOutv4`: API v4 base URL
  - `apiImage`: OCR/EKYC API URL
- ✅ Socket Ports:
  - `socketPort`: 8000 (WebSocket quét thẻ)
  - `socketAPIPort`: 8010 (API so sánh khuôn mặt)
- ✅ Face Comparison:
  - `scoreCompare`: 60 (Ngưỡng điểm khớp)

---

### 6. 🗄️ **MODULE STATE MANAGEMENT (Redux)**

**Vị trí**: `src/redux/`, `src/store.js`

#### 6.1. **Auth Reducer**
- State: `idToken`, `user`, `is_refreshing`
- Actions:
  - `LOGIN_REQUEST` - Bắt đầu đăng nhập
  - `LOGIN_SUCCESS` - Đăng nhập thành công
  - `LOGIN_ERROR` - Đăng nhập thất bại
  - `LOGOUT` - Đăng xuất
  - `CHECK_AUTHORIZATION` - Kiểm tra quyền

#### 6.2. **Store Setup**
- Redux store với thunk middleware
- Redux DevTools support
- Combine reducers

---

### 7. 🛠️ **MODULE UTILITIES**

**Vị trí**: `src/utils/auth.js`

#### Functions:
- ✅ `clearToken()` - Xóa tất cả token và user data
- ✅ `getToken()` - Lấy token từ localStorage
- ✅ `isAuthenticated()` - Kiểm tra đã đăng nhập chưa
- ✅ `saveAuthData(user, token)` - Lưu thông tin đăng nhập
- ✅ `getUser()` - Lấy thông tin user từ localStorage

---

## 🔄 LUỒNG HOẠT ĐỘNG TỔNG QUAN

### Luồng đăng nhập:
```
1. User truy cập → App.js check token
2. Chưa có token → Redirect về /login
3. User nhập username/password → Gọi authApi.dangNhap()
4. Thành công → Lưu token vào localStorage + Redux
5. Redirect về /checkin
```

### Luồng Check-in:
```
1. Kết nối WebSocket (port 8000)
2. User quét thẻ CCCD → Nhận dữ liệu qua WebSocket
3. Hiển thị thông tin từ thẻ
4. Bật webcam → Load face-api.js model
5. Phát hiện khuôn mặt → Tự động chụp ảnh
6. Gọi API so sánh khuôn mặt (port 8010)
7. Nếu score ≥ 60 → Gọi API check-in
8. Thành công → Refresh danh sách + thống kê
```

---

## 📊 TÓM TẮT CÁC CHỨC NĂNG

| # | Module | Chức năng chính | API/Socket |
|---|--------|----------------|------------|
| 1 | **Authentication** | Đăng nhập, quản lý token | `POST /api/v1/Nguoidung/DangNhap` |
| 2 | **WebSocket Scanner** | Nhận dữ liệu từ máy quét thẻ | `ws://localhost:8000` |
| 3 | **Face Detection** | Phát hiện khuôn mặt bằng webcam | face-api.js (client-side) |
| 4 | **Face Comparison** | So sánh khuôn mặt với ảnh CCCD | `POST localhost:8010/api/v4/compare` |
| 5 | **Check-in** | Lưu thông tin check-in | `POST /api/v4/VaoRa/Vao` |
| 6 | **List Management** | Hiển thị danh sách check-in | `GET /api/v4/VaoRa/GetListPageBySearch` |
| 7 | **Statistics** | Thống kê check-in/check-out | `GET /api/v1/VaoRa/TongHopTheoNga` |

---

## 🎯 ĐIỂM NỔI BẬT

1. ✅ **Standalone** - Độc lập, không phụ thuộc dự án gốc
2. ✅ **Authentication** - Đầy đủ hệ thống đăng nhập với token
3. ✅ **Real-time** - WebSocket cho quét thẻ real-time
4. ✅ **AI Integration** - Face-api.js cho nhận diện khuôn mặt
5. ✅ **Auto Check-in** - Tự động check-in khi khuôn mặt khớp
6. ✅ **Responsive UI** - Giao diện đẹp, responsive
7. ✅ **Error Handling** - Xử lý lỗi đầy đủ
8. ✅ **State Management** - Redux cho quản lý state

---

## 📝 GHI CHÚ

- Tất cả API calls tự động có token trong header (nếu đã đăng nhập)
- Token được lưu trong localStorage và Redux store
- Tự động redirect về login nếu token hết hạn (401)
- Face-api.js models cần được copy từ ClientV2
- WebSocket và Face Comparison API cần chạy trước khi sử dụng

