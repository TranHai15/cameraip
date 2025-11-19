import io from "socket.io-client";
import axios from "axios";
import settings from "../config/settings";

class FaceServerService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(onCaptureSuccess, onError, onFaceStatus) {
    if (this.socket && this.isConnected) {
      console.log("Face server already connected");
      return;
    }

    const serverUrl = settings.faceServerUrl || "http://localhost:5000";
    console.log("Connecting to face-server:", serverUrl);

    this.socket = io(serverUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to face-server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from face-server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Face-server connection error:", error);
      this.isConnected = false;
      if (onError) onError(error);
    });

    // Nhận event khi chụp ảnh thành công
    this.socket.on("capture_success", async (data) => {
      console.log("📸 Received capture_success:", data);
      if (data.url && onCaptureSuccess) {
        try {
          // Download ảnh và convert sang base64
          const base64Image = await this.downloadImageAsBase64(data.url);
          onCaptureSuccess(base64Image);
        } catch (error) {
          console.error("Error processing captured image:", error);
          if (onError) onError(error);
        }
      }
    });

    // Nhận event status và message từ BE
    this.socket.on("face_status", (data) => {
      console.log("📊 Received face_status:", data);
      if (onFaceStatus) {
        onFaceStatus(data);
      }
    });
  }

  startCapture() {
    if (!this.socket || !this.isConnected) {
      console.warn("Face-server not connected. Attempting to connect...");
      this.connect();
      // Đợi một chút rồi gửi lại
      setTimeout(() => {
        if (this.socket && this.isConnected) {
          this.socket.emit("start_capture");
          console.log("📢 Sent start_capture event");
        }
      }, 1000);
      return;
    }

    this.socket.emit("start_capture");
    console.log("📢 Sent start_capture event");
  }

  stopCapture() {
    if (this.socket && this.isConnected) {
      this.socket.emit("stop_capture");
      console.log("📢 Sent stop_capture event");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("Disconnected from face-server");
    }
  }

  async downloadImageAsBase64(imageUrl) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: "blob",
      });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error("Error downloading image:", error);
      throw error;
    }
  }

  getVideoFeedUrl() {
    const serverUrl = settings.faceServerUrl || "http://localhost:5000";
    return `${serverUrl}/video_feed`;
  }
}

// Export singleton instance
const faceServerService = new FaceServerService();
export default faceServerService;
