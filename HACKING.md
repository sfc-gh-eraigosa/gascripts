

Starting up a local container using:
https://hub.docker.com/r/bitnami/apache/

docker run -p 8080:80 -v $(pwd):/app --name gassites -d bitnami/apache


# deploying appengine script javascript
https://console.developers.google.com/start/appengine?_ga=1.6979506.1213987928.1443976984

* build local container with appengine
docker build -t appengine .

docker run -it --rm appengine && \
appcfg.sh -A gasciptsv2 update /apps/appengine-try-java-master/target/appengine-try-java-1.0
