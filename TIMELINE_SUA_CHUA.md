# 📅 TIMELINE SỬA CHỮA VÀ CẢI THIỆN HỆ THỐNG CHECK-IN

## 🎯 MỤC TIÊU TỔNG QUAN

1. ✅ Kết nối face-server sớm (khi load web, không chờ quét thẻ)
2. ✅ Hiển thị message rõ ràng, đủ thời gian đọc (không bị che bởi loading)
3. ✅ Thông báo lỗi ngay khi server lỗi, không làm gì, chờ server kết nối
4. ✅ Sửa tất cả các bug đã phát hiện
5. ✅ WebSocket tự động reconnect
6. ✅ Timeout và retry cho API calls

---

## 📋 TIMELINE CHI TIẾT TỪNG MODULE

### 🔹 MODULE 1: Sửa Bug StatusMessage2 (Ưu tiên cao - Dễ sửa)
**Thời gian:** 5 phút  
**File:** `src/components/CheckinOut/StatusMessage2/index.js`

**Vấn đề:**
- Luôn hiển thị màu "ready" thay vì màu theo `type` thực tế

**Giải pháp:**
- Sửa dòng 41: `getStatusColor("ready")` → `getStatusColor(type)`

**Kết quả:**
- Message hiển thị đúng màu theo status (waiting, adjusting, ready, capturing, error)

---

### 🔹 MODULE 2: Kết nối Face-Server sớm (Ưu tiên cao)
**Thời gian:** 15 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- Face-server chỉ kết nối khi component mount
- Khi quét thẻ thành công mới bắt đầu hiển thị video → Lâu

**Giải pháp:**
1. Di chuyển `faceServerService.connect()` ra ngoài component (hoặc App.js)
2. Kết nối ngay khi app khởi động
3. Giữ kết nối suốt thời gian app chạy
4. Chỉ gọi `startCapture()` khi có thẻ

**Thay đổi:**
- Tách logic kết nối face-server ra khỏi useEffect
- Kết nối trong App.js hoặc tạo service riêng
- Component chỉ sử dụng service đã kết nối

**Kết quả:**
- Video sẵn sàng ngay khi quét thẻ thành công
- Không phải chờ kết nối

---

### 🔹 MODULE 3: Cải thiện hiển thị Message (Ưu tiên cao)
**Thời gian:** 30 phút  
**File:** `src/components/CheckinOut/index.js`, `StatusMessage/index.js`

**Vấn đề:**
- Loading spinner che message
- Message hiển thị quá nhanh, không đủ thời gian đọc
- Message từ server không hiển thị rõ

**Giải pháp:**
1. **Tách loading và message:**
   - Loading spinner hiển thị ở vị trí riêng (không che message)
   - Message luôn hiển thị rõ ràng ở dưới

2. **Thời gian hiển thị message:**
   - Thông báo thành công: 4000ms (tăng từ 3000ms)
   - Thông báo lỗi: 5000ms (tăng từ 2000ms)
   - Thông báo từ server: 5000ms

3. **Cải thiện UI:**
   - Message có background rõ ràng
   - Font size lớn hơn
   - Có animation fade in/out

**Thay đổi:**
- Tách `loadingDataScan` spinner ra khỏi vùng message
- Thêm state `messageDisplayTime` để quản lý thời gian hiển thị
- Cải thiện CSS cho message

**Kết quả:**
- Người dùng đọc được message rõ ràng
- Đủ thời gian đọc (4-5 giây)

---

### 🔹 MODULE 4: WebSocket Tự Động Reconnect (Ưu tiên cao)
**Thời gian:** 45 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- WebSocket không tự động reconnect
- Khi mất kết nối, phải reload trang

**Giải pháp:**
1. Thêm logic reconnect tự động
2. Exponential backoff (1s, 2s, 4s, 8s, 16s)
3. Tối đa 10 lần thử
4. Thông báo cho người dùng khi đang reconnect

**Thay đổi:**
- Thêm state `wsReconnectAttempts`
- Thêm function `reconnectWebSocket()`
- Xử lý trong `socket.onclose` và `socket.onerror`

**Kết quả:**
- Tự động reconnect khi mất kết nối
- Thông báo rõ ràng cho người dùng

---

### 🔹 MODULE 5: Thông báo lỗi ngay khi Server lỗi (Ưu tiên cao)
**Thời gian:** 30 phút  
**File:** `src/components/CheckinOut/index.js`, `src/services/faceServerService.js`

**Vấn đề:**
- Khi server lỗi, không thông báo rõ ràng
- Vẫn tiếp tục thử các hành động khác

**Giải pháp:**
1. **Face-server lỗi:**
   - Thông báo ngay: "Không thể kết nối đến face-server"
   - Dừng tất cả hành động liên quan đến face-server
   - Chỉ tiếp tục khi kết nối lại thành công

2. **WebSocket lỗi:**
   - Thông báo ngay: "Không thể kết nối đến thiết bị quét thẻ"
   - Dừng tất cả hành động liên quan đến quét thẻ
   - Tự động reconnect và thông báo khi kết nối lại

3. **API lỗi:**
   - Thông báo ngay với message từ server
   - Dừng flow hiện tại
   - Reset state về trạng thái ban đầu

**Thay đổi:**
- Thêm state `connectionStatus` để track trạng thái kết nối
- Thêm component hiển thị thông báo lỗi kết nối
- Xử lý lỗi ở tất cả các điểm kết nối

**Kết quả:**
- Người dùng biết ngay khi server lỗi
- Không làm gì khi server lỗi, chờ server kết nối lại

---

### 🔹 MODULE 6: Timeout cho API Calls (Ưu tiên trung bình)
**Thời gian:** 20 phút  
**File:** `src/services/api.js`

**Vấn đề:**
- Không có timeout cho API calls
- Nếu server chậm, spinner hiển thị lâu

**Giải pháp:**
1. Thêm timeout 30 giây cho tất cả API calls
2. Thông báo lỗi timeout rõ ràng
3. Retry 1 lần nếu timeout

**Thay đổi:**
- Thêm `timeout: 30000` vào axios config
- Xử lý timeout error riêng

**Kết quả:**
- API không bị treo quá lâu
- Thông báo rõ ràng khi timeout

---

### 🔹 MODULE 7: Retry Logic cho API quan trọng (Ưu tiên trung bình)
**Thời gian:** 40 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- Không có retry cho API quan trọng (CompareFace, CheckIn)
- Nếu API lỗi, phải quét lại từ đầu

**Giải pháp:**
1. **CompareFace:**
   - Retry tối đa 2 lần
   - Delay 2 giây giữa các lần retry
   - Chỉ retry nếu còn thẻ trên thiết bị

2. **CheckIn:**
   - Retry tối đa 1 lần
   - Delay 3 giây
   - Thông báo rõ ràng khi retry

3. **GetListCheckin, getTotalCheckInOut:**
   - Retry tối đa 3 lần
   - Exponential backoff

**Thay đổi:**
- Tạo utility function `retryApiCall()`
- Áp dụng cho các API quan trọng

**Kết quả:**
- Tăng độ tin cậy
- Giảm số lần phải quét lại

---

### 🔹 MODULE 8: Giới hạn số lần Retry Face Compare (Ưu tiên trung bình)
**Thời gian:** 20 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- Retry vô hạn khi face không khớp
- Lãng phí tài nguyên

**Giải pháp:**
1. Thêm counter `retryCount` (max 3 lần)
2. Sau 3 lần thất bại → Thông báo và dừng
3. Reset counter khi quét thẻ mới

**Thay đổi:**
- Thêm state `faceRetryCount`
- Kiểm tra trước khi retry
- Reset khi nhận thẻ mới

**Kết quả:**
- Không retry vô hạn
- Thông báo rõ ràng khi hết số lần thử

---

### 🔹 MODULE 9: Kiểm tra thẻ còn trên thiết bị trước khi Retry (Ưu tiên trung bình)
**Thời gian:** 15 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- Nếu người dùng lấy thẻ ra, vẫn tiếp tục capture

**Giải pháp:**
1. Kiểm tra `currentRefCheckin.current` trước khi retry
2. Kiểm tra `currentCheckin.imageChanDung` có tồn tại
3. Nếu không có → Dừng retry

**Thay đổi:**
- Thêm check trong các hàm retry
- Clear timeout nếu thẻ đã lấy ra

**Kết quả:**
- Không lãng phí tài nguyên
- Tránh lỗi khi thẻ đã lấy ra

---

### 🔹 MODULE 10: Reset State sau khi API lỗi (Ưu tiên thấp)
**Thời gian:** 15 phút  
**File:** `src/components/CheckinOut/index.js`

**Vấn đề:**
- Không reset state sau khi API lỗi
- Người dùng có thể bị "kẹt" ở trạng thái đang xử lý

**Giải pháp:**
1. Tạo function `resetAllState()`
2. Gọi sau khi API lỗi (sau khi hiển thị thông báo)
3. Reset về trạng thái ban đầu

**Thay đổi:**
- Tạo function reset
- Gọi trong catch blocks

**Kết quả:**
- Không bị "kẹt" state
- Sẵn sàng cho lần tiếp theo

---

### 🔹 MODULE 11: Cải thiện Error Handling (Ưu tiên thấp)
**Thời gian:** 30 phút  
**File:** `src/services/api.js`, `src/components/CheckinOut/index.js`

**Vấn đề:**
- Error handling không đầy đủ
- Message lỗi không rõ ràng

**Giải pháp:**
1. Parse error message từ server
2. Hiển thị message rõ ràng, dễ hiểu
3. Log đầy đủ để debug

**Thay đổi:**
- Cải thiện error parsing
- Thêm error messages rõ ràng

**Kết quả:**
- Message lỗi dễ hiểu hơn
- Dễ debug hơn

---

## 📊 TỔNG HỢP THỜI GIAN

| Module | Thời gian | Ưu tiên | Phụ thuộc |
|--------|-----------|---------|-----------|
| 1. Sửa StatusMessage2 | 5 phút | Cao | Không |
| 2. Kết nối Face-Server sớm | 15 phút | Cao | Không |
| 3. Cải thiện hiển thị Message | 30 phút | Cao | Không |
| 4. WebSocket Reconnect | 45 phút | Cao | Không |
| 5. Thông báo lỗi Server | 30 phút | Cao | 2, 4 |
| 6. Timeout API | 20 phút | Trung bình | Không |
| 7. Retry Logic | 40 phút | Trung bình | 6 |
| 8. Giới hạn Retry | 20 phút | Trung bình | 7 |
| 9. Kiểm tra thẻ trước Retry | 15 phút | Trung bình | 7 |
| 10. Reset State | 15 phút | Thấp | 5 |
| 11. Error Handling | 30 phút | Thấp | 5 |

**Tổng thời gian ước tính:** ~4-5 giờ

---

## 🎯 THỨ TỰ THỰC HIỆN KHUYẾN NGHỊ

### Phase 1: Quick Wins (1 giờ)
1. Module 1: Sửa StatusMessage2 (5 phút)
2. Module 2: Kết nối Face-Server sớm (15 phút)
3. Module 3: Cải thiện hiển thị Message (30 phút)
4. Module 6: Timeout API (20 phút)

### Phase 2: Critical Fixes (1.5 giờ)
5. Module 4: WebSocket Reconnect (45 phút)
6. Module 5: Thông báo lỗi Server (30 phút)

### Phase 3: Reliability (1.5 giờ)
7. Module 7: Retry Logic (40 phút)
8. Module 8: Giới hạn Retry (20 phút)
9. Module 9: Kiểm tra thẻ trước Retry (15 phút)
10. Module 10: Reset State (15 phút)

### Phase 4: Polish (30 phút)
11. Module 11: Error Handling (30 phút)

---

## 📝 LUỒNG HIỂN THỊ MESSAGE MỚI

### 1. Trạng thái ban đầu (Chưa quét thẻ)
- **Message:** "Vui lòng quét thẻ căn cước để đăng ký"
- **Type:** ERROR (màu đỏ)
- **Loading:** Không
- **Thời gian:** Vô hạn

### 2. Đang đọc thẻ (Event READ)
- **Message:** "Đang đọc thẻ căn cước..."
- **Type:** null (màu trắng)
- **Loading:** Có (spinner ở vị trí riêng, không che message)
- **Thời gian:** Cho đến khi đọc xong

### 3. Đọc thẻ thành công (Event CARD_RESULT)
- **Message:** "Đã đọc thẻ thành công. Vui lòng nhìn vào camera"
- **Type:** SUCCESS (màu xanh)
- **Loading:** Không
- **Thời gian:** 2 giây → Chuyển sang message từ face-server

### 4. Chờ chụp ảnh (Face-server status)
- **Message:** Từ `faceStatus.message` (waiting, adjusting, ready, capturing)
- **Type:** Theo `faceStatus.status`
- **Loading:** Không (video stream đang hiển thị)
- **Thời gian:** Cho đến khi chụp được ảnh

### 5. Đang so sánh khuôn mặt (API CompareFace)
- **Message:** "Đang so sánh khuôn mặt..."
- **Type:** null (màu trắng)
- **Loading:** Có (spinner ở vị trí riêng)
- **Thời gian:** Cho đến khi có kết quả

### 6. So sánh thành công (Score > 40)
- **Message:** "Khuôn mặt khớp. Đang xử lý check-in..."
- **Type:** SUCCESS (màu xanh)
- **Loading:** Có (spinner ở vị trí riêng)
- **Thời gian:** Cho đến khi check-in xong

### 7. So sánh thất bại (Score ≤ 40)
- **Message:** "Khuôn mặt không khớp. Vui lòng thử lại."
- **Type:** ERROR (màu đỏ)
- **Loading:** Không
- **Thời gian:** 3 giây → Retry hoặc reset

### 8. Check-in thành công
- **Message:** "Đăng ký thành công!"
- **Type:** SUCCESS (màu xanh)
- **Loading:** Không
- **Thời gian:** 4 giây → Reset về trạng thái ban đầu

### 9. Check-in thất bại
- **Message:** `response.data.Message` từ server
- **Type:** ERROR (màu đỏ)
- **Loading:** Không
- **Thời gian:** 5 giây → Reset về trạng thái ban đầu

### 10. Lỗi kết nối Server
- **Message:** 
  - Face-server: "Không thể kết nối đến face-server. Đang thử kết nối lại..."
  - WebSocket: "Không thể kết nối đến thiết bị quét thẻ. Đang thử kết nối lại..."
  - API: "Không thể kết nối đến server. Vui lòng thử lại sau."
- **Type:** ERROR (màu đỏ)
- **Loading:** Không (hoặc spinner nhỏ ở góc)
- **Thời gian:** Cho đến khi kết nối lại thành công

---

## 🔧 CẤU TRÚC CODE MỚI

### State Management
```javascript
const [statusRes, setStatusRes] = useState({
  message: settings.defaultMessages.waitingCard,
  type: TYPE.ERROR,
  Score: null,
  displayTime: null, // Thời gian hiển thị (ms)
});

const [connectionStatus, setConnectionStatus] = useState({
  faceServer: 'connecting', // connecting, connected, error
  webSocket: 'connecting', // connecting, connected, error
  api: 'ready', // ready, error
});

const [faceRetryCount, setFaceRetryCount] = useState(0);
const [loadingPosition, setLoadingPosition] = useState('top'); // top, bottom, center
```

### Message Display Logic
```javascript
// Tự động ẩn message sau displayTime
useEffect(() => {
  if (statusRes.displayTime && statusRes.message) {
    const timer = setTimeout(() => {
      // Chỉ ẩn nếu không phải message quan trọng
      if (statusRes.type !== TYPE.ERROR || !connectionStatus.faceServer === 'error') {
        setStatusRes(prev => ({ ...prev, message: '', displayTime: null }));
      }
    }, statusRes.displayTime);
    return () => clearTimeout(timer);
  }
}, [statusRes.displayTime, statusRes.message]);
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Module 1: Sửa StatusMessage2
- [ ] Module 2: Kết nối Face-Server sớm
- [ ] Module 3: Cải thiện hiển thị Message
- [ ] Module 4: WebSocket Reconnect
- [ ] Module 5: Thông báo lỗi Server
- [ ] Module 6: Timeout API
- [ ] Module 7: Retry Logic
- [ ] Module 8: Giới hạn Retry
- [ ] Module 9: Kiểm tra thẻ trước Retry
- [ ] Module 10: Reset State
- [ ] Module 11: Error Handling
- [ ] Test toàn bộ flow
- [ ] Test các trường hợp lỗi
- [ ] Test reconnect
- [ ] Test timeout
- [ ] Test retry

---

## 🎉 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành tất cả modules:

1. ✅ Face-server kết nối sớm, video sẵn sàng ngay
2. ✅ Message hiển thị rõ ràng, đủ thời gian đọc
3. ✅ Thông báo lỗi ngay khi server lỗi
4. ✅ WebSocket tự động reconnect
5. ✅ API có timeout và retry
6. ✅ Không retry vô hạn
7. ✅ Không bị "kẹt" state
8. ✅ Error handling đầy đủ

