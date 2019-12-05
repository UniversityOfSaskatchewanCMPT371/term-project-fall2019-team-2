#!/bin/bash
source ~/.bash_profile
#must set this because webstorm starts this file in an isolated process without
#the system PATH available
export PATH=$PATH:/usr/local/bin
/usr/local/bin/npm run lint -- --fix
