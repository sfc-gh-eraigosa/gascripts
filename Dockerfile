FROM java:7-jdk

ENV MAVEN_VERSION 3.5.2
ENV APPENGINE_JAVA_SDK 1.9.27
ENV PATH $PATH:/opt/appengine-java-sdk-${APPENGINE_JAVA_SDK}/bin/:/opt/apache-maven-${MAVEN_VERSION}/bin/

RUN apt-get update
RUN curl https://storage.googleapis.com/appengine-sdks/featured/appengine-java-sdk-${APPENGINE_JAVA_SDK}.zip > /tmp/appengine-java.zip && \
    unzip /tmp/appengine-java.zip -d /opt

RUN cd /opt && \
    curl -k -L http://mirror.cogentco.com/pub/apache/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz > maven.tar.gz && \
    tar -xzvf ./maven.tar.gz && \
    mvn -v

RUN mkdir /apps && \
    curl -k -L https://github.com/GoogleCloudPlatform/appengine-try-java/archive/master.zip > /apps/appengine-try-java.zip &&  \
    unzip /apps/appengine-try-java.zip -d /apps && \
    cd /apps/appengine-try-java-master && \
    mvn clean install

EXPOSE 8080
