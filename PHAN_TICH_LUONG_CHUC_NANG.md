# 📋 PHÂN TÍCH CHI TIẾT LUỒNG CHỨC NĂNG CHECK-IN

## 🎯 TỔNG QUAN

Hệ thống check-in hoạt động qua 3 kết nối chính:

1. **WebSocket quét thẻ CCCD** (port 8000)
2. **Socket.IO face-server** (port 5000) - chụp ảnh khuôn mặt
3. **HTTP API** - so sánh khuôn mặt (port 8010) và check-in

---

## 📊 LUỒNG HOẠT ĐỘNG TỪNG BƯỚC

### 🔄 BƯỚC 1: KHỞI TẠO (Component Mount)

**File:** `src/components/CheckinOut/index.js` - `useEffect` (dòng 82-152)

**Các hành động:**

1. ✅ Load danh sách check-in ban đầu (`GetListCheckin`)
2. ✅ Kết nối WebSocket quét thẻ (`handleConnectSocketScan`)
3. ✅ Kết nối face-server (`faceServerService.connect`)
4. ✅ Khởi động interval đếm delay (`delayChamCong`)
5. ✅ Load thống kê (`getTotalCheckInOut`)

**Trạng thái ban đầu:**

- `statusRes.message` = "Vui lòng quét thẻ căn cước để đăng ký"
- `statusRes.type` = `TYPE.ERROR`
- `faceStatus.status` = "idle"
- `faceStatus.message` = "Vui lòng quét thẻ căn cước để đăng ký"
- `currentCheckin` = `{}`
- `loadingDataScan` = `false`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có retry nếu kết nối WebSocket thất bại
- ❌ Không có retry nếu kết nối face-server thất bại
- ❌ Nếu API `GetListCheckin` hoặc `getTotalCheckInOut` lỗi, chỉ hiển thị warning, không retry

---

### 🔄 BƯỚC 2: QUÉT THẺ CCCD

**File:** `src/components/CheckinOut/index.js` - `handleConnectSocketScan` (dòng 192-321)

#### 2.1. Event "READ" - Bắt đầu đọc thẻ

**Trigger:** WebSocket nhận `{EventName: "READ"}`

- ✅ `setLoadingDataScan(true)` - Hiển thị spinner
- ✅ Log: "🔄 [SOCKET_CARD] Event READ - Bắt đầu đọc thẻ..."

**Message hiển thị:** Không thay đổi (vẫn là "Vui lòng quét thẻ căn cước để đăng ký")

#### 2.2. Event "CARD_RESULT" - Đọc thẻ thành công

**Trigger:** WebSocket nhận `{EventName: "CARD_RESULT", PersonalInfo: {...}, ChipFace: "..."}`

**Các hành động:**

1. ✅ `setLoadingDataScan(false)` - Tắt spinner
2. ✅ Tạo object `dataReaded` với thông tin từ thẻ
3. ✅ `setStatusRes({message: "", type: null})` - Reset message
4. ✅ `setCurrentCheckin(dataReaded)` - Lưu thông tin thẻ
5. ✅ `currentRefCheckin.current = dataReaded` - Lưu vào ref
6. ✅ `faceServerService.startCapture()` - **Bắt đầu chụp ảnh ngay lập tức**

**Message hiển thị:** `settings.defaultMessages.waitingFace` = "" (rỗng)

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có delay trước khi bắt đầu capture (có thể gây race condition)
- ❌ Nếu `faceServerService.startCapture()` thất bại, không có thông báo lỗi rõ ràng
- ❌ Không kiểm tra `currentCheckin.imageChanDung` có tồn tại trước khi capture

#### 2.3. Event "EMPTY" - Thẻ đã lấy ra

**Trigger:** WebSocket nhận `{NewState: "EMPTY"}`

**Các hành động:**

1. ✅ Reset toàn bộ state:
   - `setCurrentCheckin({})`
   - `currentRefCheckin.current = null`
   - `setStatusRes({message: "Vui lòng quét thẻ...", type: ERROR})`
   - `setStateScan(null)`
   - `setShowCardImage(false)`
2. ✅ `faceServerService.stopCapture()` - Dừng capture

**Message hiển thị:** "Vui lòng quét thẻ căn cước để đăng ký"

#### 2.4. Event "FAILURE" - Lỗi đọc thẻ

**Trigger:** WebSocket nhận `{Status: "FAILURE"}`

**Các hành động:**

1. ✅ `setLoadingDataScan(false)`
2. ✅ `setStatusRes({message: "Vui lòng thử lại!", type: ERROR})`

**Message hiển thị:** "Vui lòng thử lại!"

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có retry tự động
- ❌ Không có thông báo chi tiết về lỗi

#### 2.5. WebSocket Error/Close

**Trigger:** `socket.onerror` hoặc `socket.onclose`

**Các hành động:**

- ✅ `setLoadingDataScan(false)`
- ✅ Log lỗi

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ **KHÔNG CÓ TỰ ĐỘNG RECONNECT** - Đây là vấn đề nghiêm trọng!
- ❌ Nếu WebSocket đóng, hệ thống sẽ không hoạt động cho đến khi reload trang
- ❌ Không có thông báo cho người dùng về việc mất kết nối

---

### 🔄 BƯỚC 3: CHỤP ẢNH KHUÔN MẶT

**File:** `src/services/faceServerService.js`

#### 3.1. Kết nối Face-Server

**File:** `src/services/faceServerService.js` - `connect` (dòng 11-80)

**Cấu hình reconnect:**

- `reconnection: true`
- `reconnectionDelay: 1000ms` (từ settings)
- `reconnectionAttempts: 5`

**Events:**

- `connect` → `isConnected = true`
- `disconnect` → `isConnected = false`
- `connect_error` → Gọi `onError` callback
- `capture_success` → Tải ảnh và gọi `onCaptureSuccess`
- `face_status` → Cập nhật status và message

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ⚠️ Socket.IO có tự động reconnect, nhưng chỉ 5 lần
- ❌ Sau 5 lần thất bại, sẽ không reconnect nữa
- ❌ Không có thông báo cho người dùng khi mất kết nối

#### 3.2. Bắt đầu Capture

**File:** `src/services/faceServerService.js` - `startCapture` (dòng 82-103)

**Luồng:**

1. Kiểm tra `isConnected`
2. Nếu chưa kết nối → Thử reconnect, đợi `socketReconnectDelay` (1000ms) rồi gửi lại
3. Nếu đã kết nối → Gửi `start_capture` ngay

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ⚠️ Nếu reconnect thất bại, vẫn không có thông báo lỗi rõ ràng
- ❌ Timeout 1000ms có thể không đủ nếu server chậm

#### 3.3. Nhận Ảnh Từ Face-Server

**File:** `src/services/faceServerService.js` - `capture_success` event (dòng 48-65)

**Luồng:**

1. Nhận `{url: "http://..."}` từ face-server
2. Tải ảnh từ URL bằng HTTP GET
3. Chuyển đổi blob sang base64
4. Gọi `onCaptureSuccess(base64Image)`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có timeout cho HTTP request tải ảnh
- ❌ Nếu URL không tồn tại hoặc server lỗi, sẽ throw error
- ❌ Error được catch nhưng chỉ log, không có retry

#### 3.4. Nhận Face Status

**File:** `src/components/CheckinOut/index.js` - `onFaceStatus` callback (dòng 111-122)

**Các status có thể:**

- `idle` - Chờ
- `waiting` - Đang chờ
- `adjusting` - Đang điều chỉnh
- `ready` - Sẵn sàng
- `capturing` - Đang chụp
- `error` - Lỗi

**Cập nhật:**

- `setFaceStatus({status, message})`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Component `StatusMessage2` luôn dùng `getStatusColor("ready")` thay vì `type` thực tế (dòng 41)
- ❌ Đây là bug! Status message không hiển thị đúng màu theo status

---

### 🔄 BƯỚC 4: SO SÁNH KHUÔN MẶT

**File:** `src/components/CheckinOut/index.js` - `handleCompareFace` (dòng 605-731)

**Trigger:** Khi nhận ảnh từ face-server (dòng 92-101)

**Điều kiện kiểm tra:**

```javascript
if (!refCallingApi.current && currentRefCheckin.current)
```

**Các hành động:**

1. ✅ `setLoadingDataScan(true)` - Hiển thị spinner
2. ✅ `setCurrentCheckin({...currentRefCheckin.current, FaceImg: img})` - Lưu ảnh chụp
3. ✅ `refCallingApi.current = true` - Đánh dấu đang gọi API
4. ✅ `setIsCallingApi(true)`
5. ✅ Gọi API `checkinApi.CompareFace({AnhCCCD, AnhChanDung})`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có timeout cho API call
- ❌ Nếu API chậm, người dùng sẽ thấy spinner lâu
- ❌ Không có retry nếu API lỗi

#### 4.1. So sánh thành công (Score > 40)

**Điều kiện:** `scoreNum > scoreCompareFace` (40)

**Các hành động:**

1. ✅ `setStateScan(STATE_SCAN.SUCCESS)`
2. ✅ `setStatusRes({message: "Đang xử lý check-in...", type: SUCCESS, Score})`
3. ✅ Gọi `CheckIn(currentCheckin, scoreNum)`
4. ✅ `setLoadingDataScan(false)`

**Message hiển thị:** "Đang xử lý check-in..."

#### 4.2. So sánh thất bại (Score ≤ 40)

**Điều kiện:** `scoreNum <= scoreCompareFace`

**Các hành động:**

1. ✅ `setLoadingDataScan(false)`
2. ✅ `handleRetryDelay()` - Set delay counter = 1, reset sau 5s
3. ✅ Sau `compareFaceDelay` (2000ms):
   - Reset `FaceImg = ""`
   - `setStateScan(STATE_SCAN.ERROR)`
   - `refCallingApi.current = false`
   - `setStatusRes({message: "Vui lòng thử lại.", type: ERROR, Score})`
4. ✅ Sau `retryCaptureDelay` (3000ms):
   - Nếu còn thẻ → `faceServerService.startCapture()` - Chụp lại

**Tổng thời gian chờ:** 2000ms (compareFaceDelay) + 3000ms (retryCaptureDelay) = **5000ms**

**Message hiển thị:** "Vui lòng thử lại."

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ⚠️ Delay tổng cộng 5 giây có thể quá lâu
- ❌ Không có giới hạn số lần retry (có thể retry vô hạn)
- ❌ Nếu người dùng lấy thẻ ra trong lúc retry, vẫn sẽ tiếp tục capture

#### 4.3. Lỗi API CompareFace

**Trigger:** `catch` block (dòng 713-730)

**Các hành động:**

1. ✅ `handleRetryDelay()`
2. ✅ `refCallingApi.current = false`
3. ✅ `setLoadingDataScan(false)`
4. ✅ Sau `retryCaptureDelay` (3000ms):
   - Nếu còn thẻ → `faceServerService.startCapture()` - Chụp lại

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có thông báo lỗi cho người dùng
- ❌ Không có log chi tiết về lỗi
- ❌ Retry ngay sau 3s có thể quá nhanh nếu server đang down

---

### 🔄 BƯỚC 5: CHECK-IN

**File:** `src/components/CheckinOut/index.js` - `CheckIn` (dòng 395-579)

**Trigger:** Sau khi so sánh khuôn mặt thành công

**Các hành động:**

1. ✅ Validate dữ liệu:
   - Kiểm tra `LyDoGap` (lý do vào cơ quan)
   - Nếu `LyDoGap = 2` → Kiểm tra `GapCanBo` (đối tượng gặp)
2. ✅ Chuyển đổi định dạng ngày tháng (DD/MM/YYYY → YYYY-MM-DD)
3. ✅ Gọi API `checkinApi.Checkinv4(param)`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có timeout cho API call
- ❌ Nếu API chậm, người dùng sẽ thấy spinner lâu
- ❌ Không có retry nếu API lỗi

#### 5.1. Check-in thành công

**Điều kiện:** `response.data.Status > 0`

**Các hành động:**

1. ✅ `setLoadingDataScan(false)`
2. ✅ `setStatusRes({message: "Đăng ký thành công!", type: SUCCESS, Score})`
3. ✅ `refCallingApi.current = false`
4. ✅ `getTotalCheckInOut()` - Cập nhật thống kê
5. ✅ `GetListCheckin({PageNumber: 1})` - Reload danh sách
6. ✅ Sau `successMessageDelay` (3000ms):
   - Reset toàn bộ state
   - `setCurrentCheckin({})`
   - `currentRefCheckin.current = null`
   - `setStatusRes({message: "Vui lòng quét thẻ...", type: ERROR})`
   - `setStateScan(0)`
   - `setShowCardImage(false)`
   - `setLoadingDataScan(false)`
   - `setdelayCC(0)`
   - `setFaceStatus({status: "idle", message: "Vui lòng quét thẻ..."})`
   - `faceServerService.stopCapture()`

**Message hiển thị:** "Đăng ký thành công!" (trong 3 giây)

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ⚠️ Delay 3 giây có thể quá lâu nếu có nhiều người check-in
- ❌ Nếu `getTotalCheckInOut()` hoặc `GetListCheckin()` lỗi, không ảnh hưởng đến flow nhưng thống kê/danh sách sẽ không cập nhật

#### 5.2. Check-in thất bại

**Điều kiện:** `response.data.Status <= 0`

**Các hành động:**

1. ✅ `refCallingApi.current = false`
2. ✅ `setLoadingDataScan(false)`
3. ✅ `setStatusRes({message: response.data.Message, type: ERROR, Score})`
4. ✅ Sau 2000ms:
   - Reset toàn bộ state
   - `setCurrentCheckin({})`
   - `currentRefCheckin.current = null`
   - `setStateScan(0)`
   - `setdelayCC(0)`
   - `setFaceStatus({status: "idle", message: "Vui lòng quét thẻ..."})`
   - `faceServerService.stopCapture()`

**Message hiển thị:** `response.data.Message` (trong 2 giây)

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không có retry tự động
- ❌ Người dùng phải quét lại thẻ từ đầu

#### 5.3. Lỗi API Checkinv4

**Trigger:** `catch` block (dòng 570-578)

**Các hành động:**

1. ✅ `setLoadingDataScan(false)`
2. ✅ `message.error(error.toString())` - Hiển thị thông báo lỗi
3. ✅ `refCallingApi.current = false`
4. ✅ `setIsCallingApi(false)`

**⚠️ VẤN ĐỀ TIỀM ẨN:**

- ❌ Không reset state sau khi lỗi
- ❌ Người dùng có thể bị "kẹt" ở trạng thái đang xử lý
- ❌ Không có retry

---

## 🐛 CÁC VẤN ĐỀ NGHIÊM TRỌNG CẦN SỬA

### 1. ❌ WebSocket không tự động reconnect

**Vị trí:** `src/components/CheckinOut/index.js` - `handleConnectSocketScan`
**Vấn đề:** Khi WebSocket đóng, hệ thống không hoạt động
**Giải pháp:** Thêm logic reconnect tự động

### 2. ❌ StatusMessage2 không hiển thị đúng màu

**Vị trí:** `src/components/CheckinOut/StatusMessage2/index.js` - dòng 41
**Vấn đề:** Luôn dùng `getStatusColor("ready")` thay vì `type` thực tế
**Giải pháp:** Sửa thành `getStatusColor(type)`

### 3. ❌ Không có timeout cho API calls

**Vị trí:** Tất cả các API calls
**Vấn đề:** Nếu server chậm, người dùng sẽ thấy spinner lâu
**Giải pháp:** Thêm timeout cho axios requests

### 4. ❌ Không có retry cho các API quan trọng

**Vị trí:** `CheckIn`, `CompareFace`, `GetListCheckin`, `getTotalCheckInOut`
**Vấn đề:** Nếu API lỗi, không có retry tự động
**Giải pháp:** Thêm retry logic với exponential backoff

### 5. ❌ Race condition khi capture

**Vị trí:** `src/components/CheckinOut/index.js` - dòng 289
**Vấn đề:** Gọi `startCapture()` ngay sau khi nhận thẻ, có thể face-server chưa sẵn sàng
**Giải pháp:** Thêm delay nhỏ hoặc kiểm tra `isConnected` trước

### 6. ❌ Không kiểm tra thẻ còn trên thiết bị khi retry

**Vị trí:** `src/components/CheckinOut/index.js` - dòng 700-709, 724-729
**Vấn đề:** Nếu người dùng lấy thẻ ra, vẫn sẽ tiếp tục capture
**Giải pháp:** Kiểm tra `currentRefCheckin.current` có tồn tại trước khi retry

### 7. ❌ Không có giới hạn số lần retry

**Vị trí:** `handleCompareFace` - retry logic
**Vấn đề:** Có thể retry vô hạn nếu face không khớp
**Giải pháp:** Thêm counter và giới hạn số lần retry (ví dụ: 3 lần)

### 8. ❌ Không reset state sau khi API lỗi

**Vị trí:** `CheckIn` - catch block
**Vấn đề:** Người dùng có thể bị "kẹt" ở trạng thái đang xử lý
**Giải pháp:** Reset state sau khi lỗi

---

## ⏱️ TỔNG HỢP CÁC THỜI GIAN DELAY

| Hành động                     | Delay  | Vị trí                 | Ghi chú                         |
| ----------------------------- | ------ | ---------------------- | ------------------------------- |
| Hiển thị thông báo thành công | 3000ms | `successMessageDelay`  | Sau khi check-in thành công     |
| Retry capture sau thất bại    | 3000ms | `retryCaptureDelay`    | Sau khi so sánh thất bại        |
| Delay sau so sánh thất bại    | 2000ms | `compareFaceDelay`     | Trước khi reset và retry        |
| Socket reconnect delay        | 1000ms | `socketReconnectDelay` | Face-server reconnect           |
| Retry delay counter           | 5000ms | `handleRetryDelay`     | Hard-coded, không dùng settings |
| Hiển thị lỗi check-in         | 2000ms | Hard-coded             | Sau khi check-in thất bại       |

**⚠️ VẤN ĐỀ:**

- `handleRetryDelay` dùng hard-coded 5000ms thay vì dùng settings
- Tổng delay khi retry: 2000ms + 3000ms = 5000ms (có thể quá lâu)

---

## 📱 CÁC ĐIỂM HIỂN THỊ MESSAGE

### 1. StatusMessage (Khi KHÔNG có video stream)

**Vị trí:** `src/components/CheckinOut/StatusMessage/index.js`
**Hiển thị khi:** `!shouldShowVideo` (dòng 846)

**Các message có thể:**

- "Vui lòng quét thẻ căn cước để đăng ký" (ban đầu, lỗi)
- "" (rỗng - khi đang chờ chụp ảnh)
- "Vui lòng thử lại!" (lỗi đọc thẻ)
- "Đang xử lý check-in..." (đang so sánh thành công)
- "Đăng ký thành công!" (check-in thành công)
- "Vui lòng thử lại." (so sánh thất bại)
- `response.data.Message` (lỗi check-in từ API)

**Type:**

- `SUCCESS` → Màu trắng, icon CheckCircle
- `ERROR` → Màu trắng, icon CloseCircle
- `null` → Không hiển thị icon

### 2. StatusMessage2 (Khi CÓ video stream)

**Vị trí:** `src/components/CheckinOut/StatusMessage2/index.js`
**Hiển thị khi:** `shouldShowVideo` (dòng 860)

**Message:** `faceStatus.message` (từ face-server)

**⚠️ BUG:** Luôn hiển thị màu "ready" (xanh) thay vì màu theo `type` thực tế

**Các status có thể:**

- `idle` → Xám
- `waiting` → Đỏ cam
- `adjusting` → Cam
- `ready` → Xanh lá
- `capturing` → Xanh dương
- `error` → Đỏ

---

## 🔄 CÁC ĐIỂM RECONNECT/RESTART

### 1. Face-Server Reconnect

**Vị trí:** `src/services/faceServerService.js`
**Cơ chế:** Socket.IO tự động reconnect

- Số lần thử: 5
- Delay: 1000ms
- Sau 5 lần thất bại → Dừng reconnect

**⚠️ VẤN ĐỀ:** Không có thông báo cho người dùng khi mất kết nối

### 2. WebSocket Reconnect

**Vị trí:** `src/components/CheckinOut/index.js` - `handleConnectSocketScan`
**Cơ chế:** ❌ KHÔNG CÓ TỰ ĐỘNG RECONNECT

**⚠️ VẤN ĐỀ NGHIÊM TRỌNG:** Nếu WebSocket đóng, phải reload trang

### 3. API Retry

**Vị trí:** Tất cả API calls
**Cơ chế:** ❌ KHÔNG CÓ RETRY

**⚠️ VẤN ĐỀ:** Nếu API lỗi, không có retry tự động

---

## 🎯 KẾT LUẬN VÀ KHUYẾN NGHỊ

### Các vấn đề cần ưu tiên sửa:

1. ✅ **WebSocket tự động reconnect** - Quan trọng nhất
2. ✅ **Sửa bug StatusMessage2** - Dễ sửa, ảnh hưởng UX
3. ✅ **Thêm timeout cho API calls** - Tránh spinner lâu
4. ✅ **Thêm retry logic cho API quan trọng** - Tăng độ tin cậy
5. ✅ **Kiểm tra thẻ còn trên thiết bị trước khi retry** - Tránh lãng phí tài nguyên
6. ✅ **Giới hạn số lần retry** - Tránh retry vô hạn
7. ✅ **Reset state sau khi API lỗi** - Tránh "kẹt" state

### Các cải thiện nên làm:

- Thêm loading indicator rõ ràng hơn
- Thêm thông báo khi mất kết nối
- Tối ưu delay times
- Thêm error boundary để catch lỗi React
- Thêm monitoring/logging tốt hơn
