# -------- Stage 1: Build Angular App --------
FROM node:18-alpine AS builder

WORKDIR /app

# 1. ติดตั้ง Angular CLI
RUN npm install -g @angular/cli

# 2. Copy package files และติดตั้ง dependencies
COPY package*.json ./
RUN npm install

# 3. Copy source code และ build Angular
COPY . .

# ใช้ชื่อ project จาก angular.json: "frontend01"
RUN ng build frontend01 --configuration production

# -------- Stage 2: Serve with Nginx --------
FROM nginx:stable-alpine

# 4. ลบ default HTML ของ Nginx
RUN rm -rf /usr/share/nginx/html/*

# 5. คัดลอกไฟล์ที่ build แล้วจาก Stage แรก
COPY --from=builder /app/dist/frontend01/browser /usr/share/nginx/html

# 6. คัดลอก nginx config (ถ้ามี)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
