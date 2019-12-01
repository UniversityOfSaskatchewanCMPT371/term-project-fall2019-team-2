#!/bin/bash
source ~/.bash_profile
export PATH=$PATH:/usr/local/bin
export CI=true

/usr/local/bin/npm run lint -- --fix
status=$?
if [ $status -ne 0 ]; then
  echo lint failed with exit status $status
  exit $status
fi

/usr/local/bin/npm run build
status=$?
if [ $status -ne 0 ]; then
  echo build failed with exit status $status
  exit $status
fi

/usr/local/bin/npm run --silent test:ci -- -u
status=$?
if [ $status -ne 0 ]; then
  echo test failed with exit status $status
  exit $status
fi
