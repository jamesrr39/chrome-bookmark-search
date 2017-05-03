#!/bin/bash

set -e

rm -r dist
mkdir dist
cp src/index.html dist/
cp src/manifest.json dist/
mkdir -p dist/libs/bootstrap/dist/css
cp src/libs/bootstrap/dist/css/bootstrap.css dist/libs/bootstrap/dist/css/bootstrap.css
cp -r src/icons dist/

grunt requirejs:compile
