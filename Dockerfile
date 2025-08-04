# 1. Base image: use Node LTS
FROM node:18-alpine

# 2. Create app directory
WORKDIR /usr/src/app

# 3. Copy package manifests
COPY package*.json ./

# 4. Install dependencies
RUN npm ci --only=production

# 5. Copy source code
COPY . .

# 6. Expose the port your Colyseus server listens on
ENV PORT=2567
EXPOSE 2567

# 7. Start the server
CMD ["npm", "start"]
