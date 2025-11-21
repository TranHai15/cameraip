import io from "socket.io-client";
import axios from "axios";
import settings from "../config/settings";

class FaceServerService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(onCaptureSuccess, onError, onFaceStatus, onConnect) {
    console.log("🔌 [FACE_SERVER] Kiểm tra kết nối face-server...");
    if (this.socket && this.isConnected) {
      console.log("✅ [FACE_SERVER] Face-server đã kết nối, bỏ qua");
      // Nếu đã kết nối, gọi onConnect callback ngay
      if (onConnect) {
        onConnect();
      }
      return;
    }

    const serverUrl = settings.faceServerUrl || `http://localhost:${settings.faceServerPort}`;
    console.log(`🔌 [FACE_SERVER] Kết nối đến face-server: ${serverUrl}`);

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: settings.socketReconnectDelay,
      reconnectionAttempts: settings.socketReconnectAttempts,
    });

    this.socket.on("connect", () => {
      console.log("✅ [FACE_SERVER] Kết nối face-server thành công");
      console.log("📡 [FACE_SERVER] Sẵn sàng nhận lệnh capture và gửi ảnh");
      this.isConnected = true;
      // Gọi callback để component cập nhật connectionStatus
      if (onConnect) {
        onConnect();
      }
    });

    this.socket.on("disconnect", () => {
      console.log("❌ [FACE_SERVER] Mất kết nối face-server");
      console.log("⚠️ [FACE_SERVER] Camera có thể không hoạt động");
      this.isConnected = false;
      // Có thể thêm callback onDisconnect nếu cần
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ [FACE_SERVER] Lỗi kết nối face-server:", error);
      console.log("🔧 [FACE_SERVER] Kiểm tra face-server có đang chạy trên port 5000");
      this.isConnected = false;
      if (onError) onError(error);
    });

    // Nhận event khi chụp ảnh thành công
    this.socket.on("capture_success", async (data) => {
      console.log("📸 [FACE_SERVER] Nhận capture_success:", data);
      if (data.url && onCaptureSuccess) {
        console.log(`📥 [FACE_SERVER] Đang tải ảnh từ: ${data.url}`);
        try {
          // Download ảnh và convert sang base64
          const base64Image = await this.downloadImageAsBase64(data.url);
          console.log("✅ [FACE_SERVER] Đã chuyển đổi ảnh sang base64 thành công");
          console.log(`📏 [FACE_SERVER] Kích thước ảnh: ${base64Image.length} characters`);
          onCaptureSuccess(base64Image);
        } catch (error) {
          console.error("❌ [FACE_SERVER] Lỗi xử lý ảnh đã chụp:", error);
          if (onError) onError(error);
        }
      } else {
        console.log("⚠️ [FACE_SERVER] Nhận capture_success nhưng không có URL hoặc callback");
      }
    });

    // Nhận event status và message từ BE
    this.socket.on("face_status", (data) => {
      console.log("📊 [FACE_SERVER] Nhận face_status:", data);
      if (data && data.status) {
        console.log(`🔄 [FACE_SERVER] Trạng thái camera: ${data.status}`);
        if (data.message) {
          console.log(`💬 [FACE_SERVER] Message: ${data.message}`);
        }
      }
      if (onFaceStatus) {
        onFaceStatus(data);
      }
    });
  }

  startCapture() {
    console.log("📷 [FACE_SERVER] Yêu cầu bắt đầu capture...");
    if (!this.socket || !this.isConnected) {
      console.warn("⚠️ [FACE_SERVER] Face-server chưa kết nối. Đang thử kết nối lại...");
      this.connect();
      // Đợi một chút rồi gửi lại
      setTimeout(() => {
        if (this.socket && this.isConnected) {
          console.log("📢 [FACE_SERVER] Gửi start_capture sau khi reconnect");
          this.socket.emit("start_capture");
          console.log("✅ [FACE_SERVER] Đã gửi lệnh start_capture thành công");
        } else {
          console.log("❌ [FACE_SERVER] Vẫn chưa kết nối được sau reconnect");
        }
      }, settings.socketReconnectDelay);
      return;
    }

    console.log("📢 [FACE_SERVER] Gửi start_capture ngay lập tức");
    this.socket.emit("start_capture");
    console.log("✅ [FACE_SERVER] Đã gửi lệnh start_capture, chờ ảnh từ camera");
  }

  stopCapture() {
    console.log("⏹️ [FACE_SERVER] Yêu cầu dừng capture...");
    if (this.socket && this.isConnected) {
      this.socket.emit("stop_capture");
      console.log("✅ [FACE_SERVER] Đã gửi lệnh stop_capture");
    } else {
      console.log("⚠️ [FACE_SERVER] Không thể dừng capture - face-server chưa kết nối");
    }
  }

  disconnect() {
    console.log("🔌 [FACE_SERVER] Đang ngắt kết nối face-server...");
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("✅ [FACE_SERVER] Đã ngắt kết nối face-server");
    } else {
      console.log("ℹ️ [FACE_SERVER] Không có socket để ngắt kết nối");
    }
  }

  async downloadImageAsBase64(imageUrl) {
    console.log(`📥 [FACE_SERVER] Bắt đầu tải ảnh từ URL: ${imageUrl}`);
    try {
      console.log("🌐 [FACE_SERVER] Gửi HTTP request...");
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      });
      console.log(`✅ [FACE_SERVER] HTTP response status: ${response.status}`);
      console.log(`📏 [FACE_SERVER] Kích thước blob: ${response.data.size} bytes`);

      console.log("🔄 [FACE_SERVER] Chuyển đổi blob sang base64...");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          console.log("✅ [FACE_SERVER] Chuyển đổi base64 thành công");
          console.log(`📏 [FACE_SERVER] Độ dài base64 string: ${base64String.length} characters`);
          resolve(base64String);
        };
        reader.onerror = (error) => {
          console.error("❌ [FACE_SERVER] Lỗi FileReader:", error);
          reject(error);
        };
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error("❌ [FACE_SERVER] Lỗi tải ảnh:", error);
      console.log("🔧 [FACE_SERVER] Kiểm tra URL ảnh và kết nối mạng");
      throw error;
    }
  }

  getVideoFeedUrl() {
    const serverUrl = settings.faceServerUrl || `http://localhost:${settings.faceServerPort}`;
    return `${serverUrl}/video_feed`;
  }
}

// Export singleton instance
const faceServerService = new FaceServerService();
export default faceServerService;
