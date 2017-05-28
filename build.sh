#!/bin/bash

set -e

rm -r dist
mkdir dist
cp src/index.html dist/
cp src/manifest.json dist/

# bootstrap
mkdir -p dist/libs/bootstrap/dist/css
cp -r src/libs/bootstrap/dist/fonts dist/libs/bootstrap/dist/
cp src/libs/bootstrap/dist/css/bootstrap.css dist/libs/bootstrap/dist/css/bootstrap.css

# icons
cp -r src/icons dist/

# bundled doc pages
cp -r src/docs dist/

# requirejs
mkdir -p dist/libs/requirejs
cp src/libs/requirejs/require.js dist/libs/requirejs/

# bundle
grunt requirejs:compile
