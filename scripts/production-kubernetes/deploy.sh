set -u # or set -o nounset
: "$CONTAINER_REGISTRY"

#
# Build Docker images.
#

docker build -t $CONTAINER_REGISTRY/azure-storage:1 --file ../../azure-storage/Dockerfile-prod ../../azure-storage
docker push $CONTAINER_REGISTRY/azure-storage:1

docker build -t $CONTAINER_REGISTRY/video-streaming:1 --file ../../video-streaming/Dockerfile-prod ../../video-streaming
docker push $CONTAINER_REGISTRY/video-streaming:1

# 
# Deploy containers to Kubernetes.
#
# Don't forget to change kubectl to your production Kubernetes instance
#

kubectl apply -f ../cd/mongo.yaml 
envsubst < ../cd/azure-storage.yaml | kubectl apply -f -
envsubst < ../cd/video-streaming.yaml | kubectl apply -f -