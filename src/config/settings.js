// ============================================
// FILE CẤU HÌNH TẬP TRUNG - CHECKIN STANDALONE
// ============================================
// Tất cả các hằng số được khai báo ở đây để dễ quản lý và build

const date = new Date();
const currentYear = date.getFullYear();

export default {
  // ============================================
  // 1. API ENDPOINTS
  // ============================================
  apiInOut: "https://apigocheckinv4.gosol.com.vn/api/v1/",
  apiInOutv2: "https://apigocheckinv4.gosol.com.vn/api/v2/",
  apiInOutv4: "https://apigocheckinv4.gosol.com.vn/api/v4/",
  apiImage: "https://ocrcorev1.gosol.com.vn/ekyc/",

  // ============================================
  // 2. SOCKET CONFIGURATION
  // ============================================
  socketPort: "8000",        // Port WebSocket quét thẻ CCCD
  socketAPIPort: "8010",     // Port API so sánh khuôn mặt

  // ============================================
  // 3. FACE-SERVER CONFIGURATION
  // ============================================
  faceServerUrl: "http://localhost:5000",
  faceServerPort: 5000,

  // ============================================
  // 4. FACE COMPARISON THRESHOLD
  // ============================================
  scoreCompare: 60,  // Ngưỡng điểm khớp khuôn mặt (0-100)

  // ============================================
  // 5. UI CONFIGURATION
  // ============================================
  avatarSize: 240,           // Kích thước avatar (px)
  cameraWidth: 240,          // Chiều rộng camera preview (px)
  cameraHeight: 240,         // Chiều cao camera preview (px)

  // ============================================
  // 6. TIMEOUT & DELAY CONFIGURATION
  // ============================================
  successMessageDelay: 3000,      // Thời gian hiển thị thông báo thành công (ms)
  retryCaptureDelay: 3000,         // Thời gian chờ trước khi chụp lại (ms)
  compareFaceDelay: 2000,          // Thời gian delay sau khi so sánh thất bại (ms)
  socketReconnectDelay: 1000,      // Thời gian delay reconnect socket (ms)
  socketReconnectAttempts: 5,      // Số lần thử reconnect

  // ============================================
  // 7. PAGINATION CONFIGURATION
  // ============================================
  defaultPageSize: 10,       // Số item mặc định mỗi trang
  defaultPageNumber: 1,      // Trang mặc định

  // ============================================
  // 8. API TYPE CONFIGURATION
  // ============================================
  checkinListType: 2,        // Type cho API GetList (Type=2)

  // ============================================
  // 9. MESSAGE CONFIGURATION
  // ============================================
  defaultMessages: {
    waitingCard: "Quý khách vui lòng quét thẻ căn cước để thực hiện checkin",
    waitingFace: "Vui lòng đưa mặt vào khung để chụp ảnh",
    cardError: "Xảy ra lỗi trong quá trình đọc thông tin thẻ căn cước, vui lòng thử lại!",
    checkinSuccess: "Checkin thành công!",
    faceNotMatch: "Khuôn mặt không khớp. Vui lòng thử lại.",
    waitingFaceServer: "Chờ quét thẻ...",
  },
};
