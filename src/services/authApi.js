import { apiPost } from "./api";
import settings from "../config/settings";

const apiUrl = {
  dangnhap: settings.apiInOut + 'Nguoidung/DangNhap',
};

const authApi = {
  dangNhap: (param) => {
    return apiPost(apiUrl.dangnhap, {
      UserName: param.UserName,
      Password: param.Password,
    });
  },
};

export default authApi;

