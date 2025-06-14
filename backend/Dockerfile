FROM node:18-alpine

# 添加非root用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# 首先只复制package文件以利用缓存
COPY package*.json ./

# 使用 npm install 替代 npm ci
RUN npm install --omit=dev

# 复制源代码
COPY --chown=appuser:appgroup . .

# 设置环境变量
ENV NODE_ENV=production

# 切换到非root用户
USER appuser

EXPOSE 3000

# 使用更安全的方式启动应用
CMD ["node", "src/index.js"]
