#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean
# clean
rm -rf public
# build
npm install --prefix client && npm run build --prefix client
# migrate
bundle exec rake db:migrate
# postbuild
cp -a client/build/. public/