.PHONY: all bootstrap build server push

all:  bootstrap build push

bootstrap:
	scripts/bootstrap

build: bootstrap
	scripts/build

server: bootstrap build
	scripts/server gascriptsv2 1.0 '8080'

push: bootstrap build
	scripts/push gascriptsv2 1.0

hacking:
	scripts/hacking src/main/webapp gascriptsv2 8081
