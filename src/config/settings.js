const date = new Date();
const currentYear = date.getFullYear();

export default {
  // API endpoints
  apiInOut: "https://apigocheckinv4.gosol.com.vn/api/v1/",
  apiInOutv2: "https://apigocheckinv4.gosol.com.vn/api/v2/",
  apiInOutv4: "https://apigocheckinv4.gosol.com.vn/api/v4/",
  apiImage: "https://ocrcorev1.gosol.com.vn/ekyc/",
  
  // Socket configuration
  socketPort: "8000",
  socketAPIPort: "8010",
  
  // Face-server configuration
  faceServerUrl: "http://localhost:5000",
  
  // Face comparison threshold
  scoreCompare: 60,
};

