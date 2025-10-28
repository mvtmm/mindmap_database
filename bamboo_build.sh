#!/bin/bash
set -e

echo "Starte Docker Image Build für Directus Mindmap"

# Login zu public registry (für pulls)
docker login proget.tkms.net/public_docker/ -u api -p ${bamboo.DOCKER_SK4_PUBLIC}

# Erstelle das Image mit dem korrekten Tag
IMAGE_NAME="proget.tkms.net/private_docker/directus-mindmap"
TAG="${bamboo.planRepository.branchName}"

# Build args für Vite (base path wird zur Build-Zeit eingebettet)
VITE_APP_BASE_PATH="${bamboo.vite_app_base_path:-/map/}"
VITE_DIRECTUS_URL="${bamboo.vite_directus_url:-https://pie-ai-service.hdw.hdwgroup.net/code_server/directus/}"

echo "Building image: ${IMAGE_NAME}:${TAG}"
echo "Build args:"
echo "  VITE_APP_BASE_PATH=${VITE_APP_BASE_PATH}"
echo "  VITE_DIRECTUS_URL=${VITE_DIRECTUS_URL}"

docker build ./map \
  --build-arg VITE_APP_BASE_PATH="${VITE_APP_BASE_PATH}" \
  --build-arg VITE_DIRECTUS_URL="${VITE_DIRECTUS_URL}" \
  -t "${IMAGE_NAME}:${TAG}"

# Login zu private registry (für pushes)
docker login proget.tkms.net/private_docker/ -u api -p ${bamboo.DOCKER_SK4}

# Push das Image
echo "Pushing image: ${IMAGE_NAME}:${TAG}"
docker push "${IMAGE_NAME}:${TAG}"

echo "Docker Image Build und Push abgeschlossen!"

