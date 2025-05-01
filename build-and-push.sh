#!/bin/bash

# === CONFIGURE ===
DOCKER_USERNAME=rozay10
APP_NAME=task-management-api
VERSION=$(git rev-parse --short HEAD)  
IMAGE=$DOCKER_USERNAME/$APP_NAME:$VERSION
LATEST=$DOCKER_USERNAME/$APP_NAME:latest

# === BUILD ===
docker build -t $IMAGE -t $LATEST .

# === LOGIN ===
docker login

# === PUSH ===
docker push $IMAGE
docker push $LATEST

echo "✅ Image pushed: $IMAGE and $LATEST"
