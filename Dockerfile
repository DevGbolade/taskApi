# ---- Stage 1: Build ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy the rest of the application code
    COPY . .
    
    # ✅ Rename .env.prod to .env inside the builder container
    COPY .env.prod .env
    
    # Now build the app (if any env vars are needed at build time)
    RUN npm run build
    
    
    # ---- Stage 2: Run ----
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/.env ./.
    
    # Expose the configurable port
    ARG PORT=5070
    ENV PORT=${PORT}
    EXPOSE ${PORT}
    
    CMD ["node", "dist/app.js"]
    