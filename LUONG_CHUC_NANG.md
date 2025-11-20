# 📋 TÀI LIỆU LUỒNG VÀ CÁC TRƯỜNG HỢP CHỨC NĂNG

## 🎯 TỔNG QUAN DỰ ÁN

**Hệ thống Check-in Standalone** - Ứng dụng quản lý khách vào ra cơ quan với nhận diện khuôn mặt tự động.

---

## 📦 CÁC MODULE CHÍNH

### 1. 🔐 MODULE XÁC THỰC (Authentication)

### 2. 📸 MODULE CHECK-IN (Chức năng chính)

### 3. 🌐 MODULE API SERVICES

### 4. 🎨 MODULE UI COMPONENTS

---

## 🔄 LUỒNG CHI TIẾT CÁC CHỨC NĂNG

---

## 1. 🔐 LUỒNG ĐĂNG NHẬP (Authentication Flow)

### 📍 **Vị trí**: `src/components/Login/index.js`, `src/services/authApi.js`, `src/redux/auth/`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User truy cập ứng dụng                                   │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. App.js kiểm tra token trong localStorage                 │
│    - Có token? → Restore session → Redirect /checkin        │
│    - Không có? → Redirect /login                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User nhập username/password                              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Validation input                                         │
│    - Username rỗng? → Hiển thị lỗi                         │
│    - Password rỗng? → Hiển thị lỗi                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Gọi API: POST /api/v1/Nguoidung/DangNhap                │
│    Body: { UserName, Password }                            │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ THÀNH CÔNG      │    │ THẤT BẠI        │
│ Status > 0      │    │ Status <= 0     │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Hiển thị lỗi        │
         │            │ - Modal.error()     │
         │            │ - messageError      │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Lưu thông tin đăng nhập                                  │
│    - saveAuthData(user, token) → localStorage              │
│    - dispatch(loginSuccess) → Redux store                  │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Redirect về /checkin                                      │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp xử lý**:

#### **Trường hợp 1: Đăng nhập thành công**

- **Input**: Username và Password hợp lệ
- **Xử lý**:
  1. Gọi API `authApi.dangNhap()`
  2. Nhận response với `Status > 0`
  3. Lấy `user` và `token` từ response
  4. Lưu vào localStorage: `access_token`, `user_id`, `user`
  5. Dispatch `LOGIN_SUCCESS` vào Redux
  6. Reset form (username, password)
  7. Redirect về `/checkin`

#### **Trường hợp 2: Đăng nhập thất bại - Sai thông tin**

- **Input**: Username hoặc Password sai
- **Xử lý**:
  1. Gọi API trả về `Status <= 0`
  2. Hiển thị `messageError` với nội dung từ `response.data.Message`
  3. Giữ nguyên form để user nhập lại

#### **Trường hợp 3: Đăng nhập thất bại - Lỗi mạng/Server**

- **Input**: Không kết nối được server
- **Xử lý**:
  1. Catch error trong `.catch()`
  2. Hiển thị `Modal.error()` với thông báo lỗi
  3. Giữ nguyên form

#### **Trường hợp 4: Validation - Thiếu thông tin**

- **Input**: Username hoặc Password rỗng
- **Xử lý**:
  1. Kiểm tra trước khi gọi API
  2. Hiển thị `messageError`: "Vui lòng nhập đầy đủ thông tin!"
  3. Không gọi API

#### **Trường hợp 5: Token đã tồn tại (Auto-login)**

- **Input**: User đã đăng nhập trước đó (có token trong localStorage)
- **Xử lý**:
  1. `App.js` kiểm tra `isAuthenticated()`
  2. Nếu có token → Lấy user từ localStorage
  3. Dispatch `loginSuccess` để restore session
  4. Tự động redirect về `/checkin` (không cần đăng nhập lại)

#### **Trường hợp 6: Token hết hạn (401 Unauthorized)**

- **Input**: Token không hợp lệ hoặc hết hạn
- **Xử lý**:
  1. API trả về status `401`
  2. `api.js` tự động gọi `clearToken()`
  3. Redirect về `/login`
  4. User phải đăng nhập lại

---

## 2. 📸 LUỒNG CHECK-IN (Check-in Flow)

### 📍 **Vị trí**: `src/components/CheckinOut/index.js`

### 🔄 **Luồng hoạt động tổng quan**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component mount                                          │
│    - Kết nối WebSocket (port 8000)                         │
│    - Kết nối Face-Server (port 5000)                       │
│    - Load danh sách check-in                                │
│    - Load thống kê                                          │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. User quét thẻ CCCD                                       │
│    → WebSocket nhận event "READ"                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. WebSocket nhận "CARD_RESULT"                             │
│    - Lấy thông tin từ chip:                                 │
│      + Họ tên, Số CCCD, Ngày sinh                          │
│      + Ảnh chân dung (base64)                              │
│    - Hiển thị thông tin lên UI                              │
│    - Bắt đầu chụp ảnh (faceServerService.startCapture())   │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Face-Server chụp ảnh khuôn mặt                          │
│    - Hiển thị video stream                                  │
│    - Phát hiện khuôn mặt                                    │
│    - Gửi event "capture_success" với ảnh base64            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. So sánh khuôn mặt                                        │
│    - Gọi API: POST localhost:8010/api/v4/compare           │
│    - Body: { AnhCCCD, AnhChanDung }                        │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Score >= 60     │    │ Score < 60     │
│ (KHỚP)          │    │ (KHÔNG KHỚP)   │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Hiển thị lỗi        │
         │            │ - "Khuôn mặt không  │
         │            │   khớp"             │
         │            │ - Cho phép chụp lại  │
         │            │   sau 3s             │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Thực hiện Check-in                                       │
│    - Gọi API: POST /api/v4/VaoRa/Vao                       │
│    - Format dữ liệu:                                        │
│      + Ngày sinh: DD/MM/YYYY → YYYY-MM-DD                  │
│      + Ngày cấp: DD/MM/YYYY → YYYY-MM-DD                   │
│      + Xử lý LyDoGap, GapCanBo                             │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ THÀNH CÔNG      │    │ THẤT BẠI        │
│ Status > 0      │    │ Status <= 0     │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Hiển thị lỗi          │
         │            │ - message từ API     │
         │            │ - Giữ nguyên form    │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. Refresh dữ liệu                                           │
│    - Refresh danh sách check-in                              │
│    - Refresh thống kê                                        │
│    - Reset form sau 3s                                       │
└─────────────────────────────────────────────────────────────┘
```

---

### ✅ **Các trường hợp chi tiết của Check-in**:

#### **Trường hợp 1: Quét thẻ thành công**

**Luồng**:

1. User đưa thẻ vào máy quét
2. WebSocket nhận event `READ` → Hiển thị loading
3. WebSocket nhận event `CARD_RESULT` → Lấy dữ liệu:
   ```javascript
   {
     HoVaTen: data.PersonalInfo.personName,
     SoCMND: data.PersonalInfo.idCode,
     NgaySinh: data.PersonalInfo.dateOfBirth,
     NgayCapCMND: data.PersonalInfo.issueDate,
     HoKhau: data.PersonalInfo.residencePlace,
     GioiTinh: data.PersonalInfo.gender,
     imageChanDung: data.ChipFace, // base64
     LyDoGap: 1,
     checkinAt: Date.now()
   }
   ```
4. Hiển thị thông tin lên UI
5. Gọi `faceServerService.startCapture()` để bắt đầu chụp ảnh
6. Cập nhật status: "Vui lòng đưa mặt vào khung để chụp ảnh"

**Xử lý**:

- Set `currentCheckin` với dữ liệu từ thẻ
- Set `loadingDataScan = false`
- Set `statusRes.message = "Vui lòng đưa mặt vào khung để chụp ảnh"`

---

#### **Trường hợp 2: Quét thẻ thất bại**

**Luồng**:

1. User đưa thẻ vào máy quét
2. WebSocket nhận event `READ` → Hiển thị loading
3. WebSocket nhận event `FAILURE` hoặc `Status === "FAILURE"`

**Xử lý**:

- Set `loadingDataScan = false`
- Set `statusRes`:
  ```javascript
  {
    message: "Xảy ra lỗi trong quá trình đọc thông tin thẻ căn cước, vui lòng thử lại!",
    type: TYPE.ERROR,
    Score: null
  }
  ```
- Giữ nguyên form, chờ user quét lại

---

#### **Trường hợp 3: Thẻ đã lấy ra (EMPTY)**

**Luồng**:

1. User lấy thẻ ra khỏi máy quét
2. WebSocket nhận event `NewState === "EMPTY"`

**Xử lý**:

- Reset tất cả dữ liệu:
  ```javascript
  setCurrentCheckin({});
  currentRefCheckin.current = null;
  setStatusRes({
    message: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
    type: TYPE.ERROR,
    Score: null,
  });
  setStateScan(null);
  ```
- Dừng chụp ảnh: `faceServerService.stopCapture()`

---

#### **Trường hợp 4: Chụp ảnh khuôn mặt thành công**

**Luồng**:

1. Face-Server phát hiện khuôn mặt
2. Face-Server gửi event `capture_success` với URL ảnh
3. Download ảnh và convert sang base64
4. Gọi callback `onCaptureSuccess(base64Image)`

**Xử lý**:

- Kiểm tra `!refCallingApi.current` (không đang gọi API khác)
- Kiểm tra `currentRefCheckin.current` (có thông tin thẻ)
- Gọi `handleCompareFace(base64Image, currentCheckin)`

---

#### **Trường hợp 5: So sánh khuôn mặt - KHỚP (Score >= 60)**

**Luồng**:

1. Gọi API: `POST localhost:8010/api/v4/compare`
   ```json
   {
     "AnhCCCD": "base64_from_card",
     "AnhChanDung": "base64_from_webcam"
   }
   ```
2. Nhận response:
   ```json
   {
     "Score": 85,
     "Status": "Success"
   }
   ```
3. Kiểm tra: `Score >= 60` (scoreCompare)

**Xử lý**:

- Set `StateScan = STATE_SCAN.SUCCESS`
- Set `loadingDataScan = true`
- Set `refCallingApi.current = true`
- Gọi `CheckIn(currentCheckin, score)` để thực hiện check-in

---

#### **Trường hợp 6: So sánh khuôn mặt - KHÔNG KHỚP (Score < 60)**

**Luồng**:

1. Gọi API so sánh
2. Nhận response với `Score < 60`

**Xử lý**:

- Set `StateScan = STATE_SCAN.ERROR`
- Set `statusRes`:
  ```javascript
  {
    message: res?.data?.Status || "Khuôn mặt không khớp. Vui lòng thử lại.",
    type: TYPE.ERROR,
    Score: res?.data?.Score
  }
  ```
- Reset ảnh chụp: `setCurrentCheckin({ ...currentRefCheckin.current, FaceImg: "" })`
- Set delay 5s trước khi cho phép chụp lại
- Sau 3s (`retryCaptureDelay`), tự động gọi `faceServerService.startCapture()` để chụp lại

---

#### **Trường hợp 7: So sánh khuôn mặt - LỖI API**

**Luồng**:

1. Gọi API so sánh
2. API trả về lỗi (network error, server error, ...)

**Xử lý**:

- Catch error trong `.catch()`
- Set delay 5s
- Reset `refCallingApi.current = false`
- Set `loadingDataScan = false`
- Sau 3s, tự động gọi `faceServerService.startCapture()` để chụp lại

---

#### **Trường hợp 8: Thực hiện Check-in - THÀNH CÔNG**

**Luồng**:

1. Format dữ liệu:
   - `NgaySinh`: DD/MM/YYYY → YYYY-MM-DD
   - `NgayCapCMND`: DD/MM/YYYY → YYYY-MM-DD
   - Xử lý `LyDoGap`:
     - `LyDoGap === 2` → Phải có `GapCanBo`
     - `LyDoGap === 1` → `GapCanBo = 0`, `DonViCaNhan = 0`
2. Gọi API: `POST /api/v4/VaoRa/Vao`
3. Nhận response với `Status > 0`

**Xử lý**:

- Set `statusRes`:
  ```javascript
  {
    message: "Checkin thành công!",
    type: TYPE.SUCCESS,
    Score: score
  }
  ```
- Reset `refCallingApi.current = false`
- Refresh danh sách: `GetListCheckin({ ...filterData, PageNumber: 1 })`
- Refresh thống kê: `getTotalCheckInOut()`
- Sau 3s (`successMessageDelay`), tự động reset form:
  ```javascript
  setCurrentCheckin({});
  currentRefCheckin.current = null;
  setStatusRes({ message: "Quý khách vui lòng quét thẻ...", ... });
  faceServerService.stopCapture();
  ```

---

#### **Trường hợp 9: Thực hiện Check-in - THẤT BẠI**

**Luồng**:

1. Gọi API check-in
2. Nhận response với `Status <= 0`

**Xử lý**:

- Set `statusRes`:
  ```javascript
  {
    message: response?.data?.Message || "Lỗi khi check-in",
    type: TYPE.ERROR,
    Score: score
  }
  ```
- Reset `refCallingApi.current = false`
- Set `loadingDataScan = false`
- Giữ nguyên form để user thử lại

---

#### **Trường hợp 10: Thực hiện Check-in - LỖI API**

**Luồng**:

1. Gọi API check-in
2. API trả về lỗi (network, server, ...)

**Xử lý**:

- Catch error trong `.catch()`
- Hiển thị `message.error(error.toString())`
- Reset `refCallingApi.current = false`
- Set `loadingDataScan = false`
- Giữ nguyên form

---

#### **Trường hợp 11: Validation - Thiếu LyDoGap**

**Luồng**:

1. Trong hàm `CheckIn()`, kiểm tra `param.LyDoGap === undefined`

**Xử lý**:

- Hiển thị `message.warning("Chưa chọn lý do vào cơ quan")`
- Return, không gọi API
- Giữ nguyên form

---

#### **Trường hợp 12: Validation - Thiếu GapCanBo**

**Luồng**:

1. `LyDoGap === 2` (Gặp cán bộ)
2. Kiểm tra `param.GapCanBo === undefined`

**Xử lý**:

- Hiển thị `message.warning("Chưa chọn đối tượng gặp")`
- Return, không gọi API
- Giữ nguyên form

---

#### **Trường hợp 13: WebSocket lỗi kết nối**

**Luồng**:

1. WebSocket không kết nối được đến `ws://localhost:8000`
2. Event `onerror` hoặc `onclose` được trigger

**Xử lý**:

- `onerror`: Log error, set `loadingDataScan = false`
- `onclose`: Gọi `logEventErrorSocket(event)` để log lý do đóng kết nối
- Hiển thị thông báo lỗi (nếu cần)

---

#### **Trường hợp 14: Face-Server lỗi kết nối**

**Luồng**:

1. Face-Server không kết nối được đến `http://localhost:5000`
2. Event `connect_error` được trigger

**Xử lý**:

- Gọi callback `onError(error)`
- Hiển thị `message.warning("Không thể kết nối đến face-server. Vui lòng kiểm tra lại.")`
- Set `isConnected = false`

---

#### **Trường hợp 15: Face-Server nhận status từ BE**

**Luồng**:

1. Face-Server gửi event `face_status` với:
   ```json
   {
     "status": "waiting" | "adjusting" | "ready" | "capturing" | "error",
     "message": "Vui lòng đưa mặt vào khung..."
   }
   ```

**Xử lý**:

- Gọi callback `onFaceStatus(data)`
- Set `faceStatus`:
  ```javascript
  {
    status: data.status,
    message: data.message
  }
  ```
- Hiển thị message với màu sắc tương ứng:
  - `waiting`: Đỏ (#ff4d4f)
  - `adjusting`: Vàng (#faad14)
  - `ready`: Xanh (#52c41a)
  - `capturing`: Xanh dương (#1890ff)
  - `error`: Đỏ (#ff4d4f)

---

## 3. 📋 LUỒNG DANH SÁCH CHECK-IN (List Flow)

### 📍 **Vị trí**: `src/components/CheckinOut/index.js` - `GetListCheckin()`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component mount                                          │
│    → Gọi GetListCheckin(filterData)                         │
│    filterData: { PageNumber: 1, PageSize: 10 }             │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Gọi API: GET /api/v4/VaoRa/GetListPageBySearch          │
│    Params: { PageNumber, PageSize, Type: 2 }               │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ THÀNH CÔNG      │    │ THẤT BẠI        │
│ Status > 0      │    │ Status <= 0     │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Hiển thị lỗi          │
         │            │ message.warning()    │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Xử lý dữ liệu                                            │
│    - PageNumber === 1? → Thay thế danh sách                │
│    - PageNumber > 1? → Append vào danh sách                │
│    - Cập nhật TotalRow                                      │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Hiển thị danh sách                                       │
│    - Mỗi item hiển thị:                                     │
│      + Ảnh chân dung                                        │
│      + Họ tên                                               │
│      + Số CCCD (ẩn một phần)                               │
│      + Giờ check-in                                         │
│      + Trạng thái "Đã vào"                                  │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Load danh sách lần đầu (PageNumber = 1)**

**Xử lý**:

- Set `loadingCheckIn = true`
- Gọi API với `PageNumber: 1, PageSize: 10`
- Nếu thành công:
  - `newListCheckin = response.data.Data` (thay thế)
  - Cập nhật `TotalRow`
  - Set `listCheckin = newListCheckin`
  - Set `loadingCheckIn = false`

#### **Trường hợp 2: Load thêm (Infinite Scroll)**

**Xử lý**:

- User scroll xuống cuối danh sách
- Event `ScrollContainer` được trigger
- Kiểm tra: `listCheckin.length < TotalRow`?
- Nếu đúng:
  - Tăng `PageNumber = PageNumber + 1`
  - Gọi `GetListCheckin()` với `PageNumber` mới
  - Append dữ liệu: `newListCheckin.push(item)` cho mỗi item mới
  - Cập nhật `listCheckin`

#### **Trường hợp 3: Refresh sau khi check-in thành công**

**Xử lý**:

- Sau khi check-in thành công
- Reset `PageNumber = 1`
- Gọi `GetListCheckin({ ...filterData, PageNumber: 1 })`
- Danh sách được load lại từ đầu

#### **Trường hợp 4: Lỗi API**

**Xử lý**:

- Catch error trong `.catch()`
- Set `loadingCheckIn = false`
- Hiển thị `message.warning(err.toString())`

---

## 4. 📊 LUỒNG THỐNG KÊ (Statistics Flow)

### 📍 **Vị trí**: `src/components/CheckinOut/index.js` - `getTotalCheckInOut()`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component mount                                          │
│    → Gọi getTotalCheckInOut()                               │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Gọi API: GET /api/v1/VaoRa/TongHopTheoNgay              │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ THÀNH CÔNG      │    │ THẤT BẠI        │
│ Status > 0      │    │ Status <= 0     │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Hiển thị lỗi          │
         │            │ message.warning()    │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Cập nhật thống kê                                        │
│    setTotalCheckinOut({                                     │
│      checkIn: data.Tong,                                   │
│      checkOut: data.DaVe                                   │
│    })                                                       │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Load thống kê lần đầu**

**Xử lý**:

- Gọi API `TongHopNgay()`
- Nếu thành công:
  - Set `totalCheckInOut.checkIn = data.Tong`
  - Set `totalCheckInOut.checkOut = data.DaVe`
- Hiển thị trên UI dạng card với icon

#### **Trường hợp 2: Refresh sau khi check-in thành công**

**Xử lý**:

- Sau khi check-in thành công
- Tự động gọi `getTotalCheckInOut()` để cập nhật số liệu mới nhất

#### **Trường hợp 3: Lỗi API**

**Xử lý**:

- Catch error
- Hiển thị `message.warning(err.toString())`
- Giữ nguyên số liệu cũ

---

## 5. 🔌 LUỒNG WEBSOCKET (WebSocket Flow)

### 📍 **Vị trí**: `src/components/CheckinOut/index.js` - `handleConnectSocketScan()`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component mount                                          │
│    → Gọi handleConnectSocketScan()                         │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Tạo WebSocket connection                                 │
│    const socket = new WebSocket('ws://localhost:8000')     │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ onopen          │    │ onerror/onclose │
│ Kết nối thành   │    │ Lỗi kết nối     │
│ công            │    │                 │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Log error           │
         │            │ setLoading = false  │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Lắng nghe events                                        │
│    socket.onmessage = (event) => { ... }                   │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Xử lý các events:                                        │
│                                                             │
│    a) EventName === "READ"                                 │
│       → setLoadingDataScan(true)                           │
│                                                             │
│    b) NewState === "EMPTY"                                 │
│       → Reset form, stopCapture()                          │
│                                                             │
│    c) EventName === "CARD_RESULT"                          │
│       → Lấy dữ liệu, hiển thị, startCapture()             │
│                                                             │
│    d) Status === "FAILURE"                                │
│       → Hiển thị lỗi                                        │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Kết nối thành công**

**Xử lý**:

- Event `onopen` được trigger
- Log: "socket connected port 8000"
- WebSocket sẵn sàng nhận events

#### **Trường hợp 2: Nhận event READ**

**Xử lý**:

- Parse JSON từ `event.data`
- Kiểm tra `data.EventName === "READ"`
- Set `loadingDataScan = true` (hiển thị loading)

#### **Trường hợp 3: Nhận event CARD_RESULT**

**Xử lý**:

- Set `loadingDataScan = false`
- Parse dữ liệu từ `data.PersonalInfo` và `data.ChipFace`
- Tạo object `dataReaded` với đầy đủ thông tin
- Set `currentCheckin = dataReaded`
- Set `currentRefCheckin.current = dataReaded`
- Set status: "Vui lòng đưa mặt vào khung để chụp ảnh"
- Gọi `faceServerService.startCapture()`

#### **Trường hợp 4: Nhận event EMPTY**

**Xử lý**:

- Kiểm tra `data.NewState === "EMPTY"`
- Reset tất cả:
  - `setCurrentCheckin({})`
  - `currentRefCheckin.current = null`
  - Reset `statusRes`
  - `faceServerService.stopCapture()`

#### **Trường hợp 5: Nhận event FAILURE**

**Xử lý**:

- Kiểm tra `data.Status === "FAILURE"`
- Set `loadingDataScan = false`
- Set `statusRes` với message lỗi
- Giữ nguyên form

#### **Trường hợp 6: Lỗi kết nối (onerror)**

**Xử lý**:

- Event `onerror` được trigger
- Set `loadingDataScan = false`
- Log error

#### **Trường hợp 7: Đóng kết nối (onclose)**

**Xử lý**:

- Event `onclose` được trigger
- Gọi `logEventErrorSocket(event)` để log lý do:
  - Code 1000: Normal closure
  - Code 1001: Going away
  - Code 1002: Protocol error
  - Code 1006: Abnormal closure
- Set `loadingDataScan = false`

#### **Trường hợp 8: Component unmount**

**Xử lý**:

- Trong `useEffect` cleanup:
  - `socketRef.current.close()` để đóng kết nối
  - Giải phóng tài nguyên

---

## 6. 📸 LUỒNG FACE-SERVER (Face-Server Flow)

### 📍 **Vị trí**: `src/services/faceServerService.js`, `src/components/CheckinOut/index.js`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Component mount                                          │
│    → faceServerService.connect(...)                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Kết nối Socket.IO đến face-server                       │
│    io('http://localhost:5000')                            │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ connect         │    │ connect_error    │
│ Kết nối thành   │    │ Lỗi kết nối     │
│ công            │    │                 │
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Gọi onError()       │
         │            │ Hiển thị warning   │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Lắng nghe events:                                        │
│                                                             │
│    a) capture_success                                       │
│       → Download ảnh → Convert base64                      │
│       → Gọi onCaptureSuccess(base64Image)                 │
│                                                             │
│    b) face_status                                          │
│       → Gọi onFaceStatus(data)                             │
│       → Cập nhật UI status                                 │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Khi có thẻ CCCD                                         │
│    → faceServerService.startCapture()                      │
│    → Emit event 'start_capture'                            │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Face-server chụp ảnh                                    │
│    → Phát hiện khuôn mặt                                   │
│    → Gửi event 'capture_success' với URL ảnh              │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Nhận ảnh và so sánh                                     │
│    → Download ảnh từ URL                                   │
│    → Convert sang base64                                   │
│    → Gọi handleCompareFace()                              │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Kết nối thành công**

**Xử lý**:

- Event `connect` được trigger
- Set `isConnected = true`
- Log: "✅ Connected to face-server"

#### **Trường hợp 2: Kết nối thất bại**

**Xử lý**:

- Event `connect_error` được trigger
- Set `isConnected = false`
- Gọi callback `onError(error)`
- Hiển thị `message.warning("Không thể kết nối đến face-server...")`

#### **Trường hợp 3: Ngắt kết nối**

**Xử lý**:

- Event `disconnect` được trigger
- Set `isConnected = false`
- Log: "❌ Disconnected from face-server"

#### **Trường hợp 4: Bắt đầu chụp ảnh (startCapture)**

**Xử lý**:

- Kiểm tra `isConnected`
- Nếu chưa kết nối → Thử kết nối lại, đợi rồi emit
- Nếu đã kết nối → Emit event `'start_capture'`
- Log: "📢 Sent start_capture event"

#### **Trường hợp 5: Dừng chụp ảnh (stopCapture)**

**Xử lý**:

- Kiểm tra `isConnected`
- Nếu đã kết nối → Emit event `'stop_capture'`
- Log: "📢 Sent stop_capture event"

#### **Trường hợp 6: Nhận event capture_success**

**Xử lý**:

- Nhận data với `data.url` (URL ảnh)
- Gọi `downloadImageAsBase64(data.url)`:
  - Download ảnh bằng axios (responseType: 'blob')
  - Convert blob sang base64 bằng FileReader
- Gọi callback `onCaptureSuccess(base64Image)`
- Trong component: Gọi `handleCompareFace(base64Image, currentCheckin)`

#### **Trường hợp 7: Nhận event face_status**

**Xử lý**:

- Nhận data với `data.status` và `data.message`
- Gọi callback `onFaceStatus(data)`
- Trong component: Cập nhật `faceStatus` state
- Hiển thị message với màu sắc tương ứng trên video feed

#### **Trường hợp 8: Lỗi download ảnh**

**Xử lý**:

- Catch error trong `downloadImageAsBase64()`
- Log error
- Gọi `onError(error)` nếu có

#### **Trường hợp 9: Component unmount**

**Xử lý**:

- Trong `useEffect` cleanup:
  - Gọi `faceServerService.disconnect()`
  - Đóng socket connection
  - Set `isConnected = false`

---

## 7. 🛡️ LUỒNG BẢO VỆ ROUTE (Protected Route Flow)

### 📍 **Vị trí**: `src/components/ProtectedRoute.js`, `src/App.js`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User truy cập route được bảo vệ (/checkin, /)           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. ProtectedRoute kiểm tra authentication                  │
│    - isAuthenticated() (từ localStorage)                   │
│    - authState.idToken (từ Redux)                          │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Đã đăng nhập     │    │ Chưa đăng nhập  │
│ isLoggedIn = true│    │ isLoggedIn = false
└────────┬────────┘    └────────┬────────┘
         │                      │
         │                      ▼
         │            ┌─────────────────────┐
         │            │ Redirect /login     │
         │            │ state: { from }     │
         │            └─────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Render Component                                         │
│    <Component {...props} />                                 │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Đã đăng nhập**

**Xử lý**:

- `isAuthenticated()` trả về `true` HOẶC `authState.idToken !== null`
- Render component được bảo vệ
- User có thể truy cập trang

#### **Trường hợp 2: Chưa đăng nhập**

**Xử lý**:

- `isAuthenticated()` trả về `false` VÀ `authState.idToken === null`
- Redirect về `/login` với state `{ from: props.location }`
- User phải đăng nhập trước

#### **Trường hợp 3: Token hết hạn (401)**

**Xử lý**:

- API trả về status `401`
- `api.js` tự động gọi `clearToken()`
- Redirect về `/login`
- ProtectedRoute sẽ chặn truy cập

---

## 8. 🔄 LUỒNG TỰ ĐỘNG RESTORE SESSION

### 📍 **Vị trí**: `src/App.js`

### 🔄 **Luồng hoạt động**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. App.js mount                                             │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. useEffect kiểm tra token                                 │
│    - isAuthenticated()?                                     │
│    - !authState.idToken?                                    │
└────────────────────┬──────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│ Có token        │    │ Không có token  │
│ trong localStorage│   │                 │
└────────┬────────┘    └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Lấy thông tin từ localStorage                           │
│    - getUser() → user                                       │
│    - getToken() → { accessToken }                           │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Restore session                                          │
│    dispatch(loginSuccess(user, accessToken))               │
│    → Cập nhật Redux store                                   │
└─────────────────────────────────────────────────────────────┘
```

### ✅ **Các trường hợp**:

#### **Trường hợp 1: Có token trong localStorage**

**Xử lý**:

- `isAuthenticated()` trả về `true`
- `authState.idToken === null` (chưa có trong Redux)
- Lấy `user` và `accessToken` từ localStorage
- Dispatch `loginSuccess(user, accessToken)`
- Redux store được cập nhật
- User không cần đăng nhập lại

#### **Trường hợp 2: Không có token**

**Xử lý**:

- `isAuthenticated()` trả về `false`
- Không làm gì
- User sẽ bị redirect về `/login` bởi ProtectedRoute

#### **Trường hợp 3: Đã có trong Redux**

**Xử lý**:

- `authState.idToken !== null`
- Không làm gì (đã restore rồi)

---

## 📊 TÓM TẮT CÁC API ENDPOINTS

| #   | Endpoint                            | Method | Mô tả              | Request                             | Response                           |
| --- | ----------------------------------- | ------ | ------------------ | ----------------------------------- | ---------------------------------- |
| 1   | `/api/v1/Nguoidung/DangNhap`        | POST   | Đăng nhập          | `{ UserName, Password }`            | `{ Status, User: { Token, ... } }` |
| 2   | `/api/v4/VaoRa/Vao`                 | POST   | Check-in           | `{ HoVaTen, SoCMND, ... }`          | `{ Status, Message }`              |
| 3   | `/api/v4/VaoRa/GetListPageBySearch` | GET    | Danh sách check-in | `{ PageNumber, PageSize, Type: 2 }` | `{ Status, Data: [], TotalRow }`   |
| 4   | `localhost:8010/api/v4/compare`     | POST   | So sánh khuôn mặt  | `{ AnhCCCD, AnhChanDung }`          | `{ Score, Status }`                |
| 5   | `/api/v1/VaoRa/TongHopTheoNgay`     | GET    | Thống kê theo ngày | `{}`                                | `{ Status, Data: { Tong, DaVe } }` |

---

## 🔌 TÓM TẮT CÁC WEBSOCKET/SOCKET.IO EVENTS

### WebSocket (port 8000 - Quét thẻ):

- `READ`: Đang đọc thẻ
- `CARD_RESULT`: Đọc thẻ thành công
- `EMPTY`: Thẻ đã lấy ra
- `FAILURE`: Lỗi đọc thẻ

### Socket.IO (port 5000 - Face-Server):

- `connect`: Kết nối thành công
- `disconnect`: Ngắt kết nối
- `connect_error`: Lỗi kết nối
- `start_capture`: Bắt đầu chụp ảnh (emit)
- `stop_capture`: Dừng chụp ảnh (emit)
- `capture_success`: Chụp ảnh thành công (receive)
- `face_status`: Trạng thái face detection (receive)

---

## ⚙️ CÁC THAM SỐ CẤU HÌNH QUAN TRỌNG

| Tham số               | Giá trị | Mô tả                                    |
| --------------------- | ------- | ---------------------------------------- |
| `scoreCompare`        | 60      | Ngưỡng điểm khớp khuôn mặt (0-100)       |
| `socketPort`          | 8000    | Port WebSocket quét thẻ                  |
| `socketAPIPort`       | 8010    | Port API so sánh khuôn mặt               |
| `faceServerPort`      | 5000    | Port Face-Server                         |
| `successMessageDelay` | 3000ms  | Thời gian hiển thị thông báo thành công  |
| `retryCaptureDelay`   | 3000ms  | Thời gian chờ trước khi chụp lại         |
| `compareFaceDelay`    | 2000ms  | Thời gian delay sau khi so sánh thất bại |
| `defaultPageSize`     | 10      | Số item mỗi trang danh sách              |

---

## 🎯 KẾT LUẬN

Tài liệu này mô tả chi tiết tất cả các luồng và trường hợp xử lý của hệ thống Check-in Standalone. Mỗi chức năng đều có các trường hợp thành công, thất bại, và xử lý lỗi được định nghĩa rõ ràng.

**Các điểm quan trọng**:

1. ✅ Tất cả API calls đều tự động thêm token vào header
2. ✅ Tự động redirect về login nếu token hết hạn (401)
3. ✅ Tự động restore session từ localStorage khi reload
4. ✅ Xử lý đầy đủ các trường hợp lỗi (network, server, validation)
5. ✅ Tự động retry khi so sánh khuôn mặt thất bại
6. ✅ Tự động refresh danh sách và thống kê sau khi check-in thành công
7. ✅ Infinite scroll cho danh sách check-in
8. ✅ Real-time updates qua WebSocket và Socket.IO
