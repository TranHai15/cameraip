# Hướng dẫn Copy Files từ ClientV2

Để dự án hoạt động đầy đủ, bạn cần copy các file sau từ dự án ClientV2:

## 1. Face-api.js Models

**Từ**: `ClientV2/public/model/`  
**Đến**: `checkin-standalone/public/model/`

Copy toàn bộ thư mục model, bao gồm:
- `tiny_face_detector_model-shard1.bin`
- `tiny_face_detector_model-weights_manifest.json`
- (và các file model khác nếu cần)

## 2. CSS Files

**Từ**: `ClientV2/public/css/`  
**Đến**: `checkin-standalone/public/css/`

Copy các file:
- `origin.css`
- `ionicons.min.css`

## 3. Images

**Từ**: `ClientV2/src/image/user.jpg`  
**Đến**: `checkin-standalone/src/assets/images/user.jpg`

## 4. Favicon

**Từ**: `ClientV2/public/favicon.png`  
**Đến**: `checkin-standalone/public/favicon.png`

## 5. Fonts (nếu cần)

**Từ**: `ClientV2/public/fonts/`  
**Đến**: `checkin-standalone/public/fonts/`

Copy nếu bạn muốn sử dụng icon fonts.

## Script tự động (Linux/Mac)

Bạn có thể chạy script sau để copy tự động:

```bash
#!/bin/bash
# Copy models
cp -r ClientV2/public/model checkin-standalone/public/

# Copy CSS
cp -r ClientV2/public/css checkin-standalone/public/

# Copy images
mkdir -p checkin-standalone/src/assets/images
cp ClientV2/src/image/user.jpg checkin-standalone/src/assets/images/

# Copy favicon
cp ClientV2/public/favicon.png checkin-standalone/public/
```

## Script tự động (Windows PowerShell)

```powershell
# Copy models
Copy-Item -Path "ClientV2\public\model" -Destination "checkin-standalone\public\" -Recurse

# Copy CSS
Copy-Item -Path "ClientV2\public\css" -Destination "checkin-standalone\public\" -Recurse

# Copy images
New-Item -ItemType Directory -Force -Path "checkin-standalone\src\assets\images"
Copy-Item -Path "ClientV2\src\image\user.jpg" -Destination "checkin-standalone\src\assets\images\"

# Copy favicon
Copy-Item -Path "ClientV2\public\favicon.png" -Destination "checkin-standalone\public\"
```

