# Use lightweight Node.js 22 Alpine image
FROM node:22-alpine
# Set the working directory inside the container
WORKDIR /app
# Copy package files separately to leverage Docker layer caching
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production --ignore-scripts
# Copy the rest of the application code
COPY . .
# Expose the port the app runs on
EXPOSE 3000
# Define the command to start the application
CMD ["node", "app.js"]