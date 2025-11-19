# Ghi chú: Đã loại bỏ logic Auth

## Các thay đổi đã thực hiện

### 1. **api.js** - Đơn giản hóa
- ✅ Đã xóa toàn bộ logic auth:
  - `user()`, `clearToken()`, `checkRefreshToken()`, `refreshToken()`, `getConfig()`
  - `apiGetAuth()`, `apiPostAuth()`, `apiPutAuth()`, `apiPatchAuth()`, `apiDeleteAuth()`
- ✅ Chỉ giữ lại các hàm API cơ bản:
  - `apiGet()`, `apiPost()`, `apiPut()`, `apiPatch()`, `apiDelete()`
- ✅ Không còn cần token/authorization header

### 2. **checkinApi.js** - Cập nhật
- ✅ Thay `apiGetAuth()` → `apiGet()`
- ✅ Thay `apiPostAuth()` → `apiPost()`
- ✅ Tất cả API calls giờ không cần authentication

### 3. **index.js** - Bỏ Redux Provider
- ✅ Đã xóa `Provider` và `store` import
- ✅ App giờ không cần Redux

### 4. **App.js**
- ✅ Không thay đổi (không dùng Redux)

## Có thể xóa (tùy chọn)

Nếu muốn dọn dẹp hoàn toàn, có thể xóa:

1. **Redux dependencies** (nếu không dùng ở đâu khác):
   ```bash
   npm uninstall redux react-redux redux-thunk
   ```

2. **Thư mục redux**:
   ```bash
   rm -rf src/redux
   ```

3. **File store.js**:
   ```bash
   rm src/store.js
   ```

## Lưu ý

- Tất cả API calls giờ không có authentication
- Nếu API server yêu cầu auth, cần thêm header thủ công hoặc cấu hình khác
- Code đã được đơn giản hóa, dễ maintain hơn

