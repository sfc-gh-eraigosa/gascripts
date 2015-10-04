

Starting up a local container using:
https://hub.docker.com/r/bitnami/apache/

docker run -p 8080:80 -v $(pwd):/app --name gassites -d bitnami/apache
