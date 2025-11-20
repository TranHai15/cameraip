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
  socketPort: "8000", // Port WebSocket quét thẻ CCCD
  socketAPIPort: "8010", // Port API so sánh khuôn mặt

  // ============================================
  // 3. FACE-SERVER CONFIGURATION
  // ============================================
  faceServerUrl: "http://localhost:5000",
  faceServerPort: 5000,

  // ============================================
  // 4. FACE COMPARISON THRESHOLD
  // ============================================
  scoreCompare: 40, // Ngưỡng điểm khớp khuôn mặt (0-100)

  // ============================================
  // 5. UI CONFIGURATION
  // ============================================
  avatarSize: 340, // Kích thước avatar (px)
  cameraWidth: 340, // Chiều rộng camera preview (px)
  cameraHeight: 340, // Chiều cao camera preview (px)

  // ============================================
  // 6. TIMEOUT & DELAY CONFIGURATION
  // ============================================
  successMessageDelay: 3000, // Thời gian hiển thị thông báo thành công (ms)
  retryCaptureDelay: 3000, // Thời gian chờ trước khi chụp lại (ms)
  compareFaceDelay: 2000, // Thời gian delay sau khi so sánh thất bại (ms)
  socketReconnectDelay: 1000, // Thời gian delay reconnect socket (ms)
  socketReconnectAttempts: 5, // Số lần thử reconnect

  // ============================================
  // 7. PAGINATION CONFIGURATION
  // ============================================
  defaultPageSize: 10, // Số item mặc định mỗi trang
  defaultPageNumber: 1, // Trang mặc định

  // ============================================
  // 8. API TYPE CONFIGURATION
  // ============================================
  checkinListType: 2, // Type cho API GetList (Type=2)

  // ============================================
  // 9. MESSAGE CONFIGURATION
  // ============================================
  defaultMessages: {
    waitingCard: "Vui lòng quét thẻ căn cước để đăng ký",
    waitingFace: "",
    cardError: "Vui lòng thử lại!",
    checkinSuccess: "Đăng ký thành công!",
    faceNotMatch: "Vui lòng thử lại.",
    waitingFaceServer: "Vui lòng quét thẻ căn cước để đăng ký",
  },
};
