# ---- Stage 1: Build ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # Build the application
    RUN npm run build
    
    # ---- Stage 2: Run ----
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.env.prod ./.env.prod
    
    # Copy and make the entrypoint script executable
    COPY entrypoint.sh /entrypoint.sh
    RUN chmod +x /entrypoint.sh
    
    # Expose the configurable port
    ARG PORT=5070
    ENV PORT=${PORT}
    EXPOSE ${PORT}
    
    # Use the entrypoint script
    ENTRYPOINT ["/entrypoint.sh"]
    CMD ["node", "dist/app.js"]