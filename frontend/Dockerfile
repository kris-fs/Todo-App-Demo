FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Create a non-root user
RUN addgroup -g 1000 appuser && adduser -D -u 1000 -G appuser appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]
