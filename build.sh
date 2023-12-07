#!/bin/sh
while ! nc -z fhir-burni-mongodb 27017;
do
  echo "waiting for database ...";
  sleep 3;
done;
echo "db is ready!";
pm2-runtime start ecosystem.config.js;