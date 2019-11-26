#!/bin/bash
source ~/.bash_profile
echo $PATH >> output.txt
export PATH=$PATH:/usr/local/bin
/usr/local/bin/npm run lint -- --fix >> output.txt
