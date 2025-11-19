import { apiGet, apiPost } from "./api";
import settings from "../config/settings";

const apiUrl = {
  checkinv4: settings.apiInOutv4 + "VaoRa/Vao",
  getlistpaging: settings.apiInOutv4 + "VaoRa/GetListPageBySearch",
  compareface: `http://localhost:${settings.socketAPIPort}/api/v4/compare`,
  tonghopngay: settings.apiInOut + "VaoRa/TongHopTheoNgay",
};

const checkinApi = {
  Checkinv4: (param) => {
    return apiPost(apiUrl.checkinv4, { ...param });
  },
  GetList: (param) => {
    return apiGet(apiUrl.getlistpaging, { ...param, Type: 2 });
  },
  CompareFace: (param) => {
    return apiPost(apiUrl.compareface, { ...param });
  },
  TongHopNgay: (param) => {
    return apiGet(apiUrl.tonghopngay, { ...param });
  },
};

export default checkinApi;
