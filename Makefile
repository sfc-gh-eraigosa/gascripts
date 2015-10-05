.PHONY: all build init push

machine_ip=`docker-machine ip dev`

all: init build push

init:
	bin/init

build: init
	bin/build

dev: init build
	bin/dev gascriptsv2 1.0 '8080'

push: inti build
	bin/push gascriptsv2 1.0

hacking:
	bin/hacking src/main/webapp gascriptsv2 8081
