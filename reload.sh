docker stop left
docker rm left

docker build --tag left .
docker create --name left -p 8888:80 left
