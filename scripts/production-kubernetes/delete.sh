kubectl delete -f ../cd/mongo.yaml
envsubst < ../cd/azure-storage.yaml | kubectl delete -f -
envsubst < ../cd/video-streaming.yaml | kubectl delete -f -