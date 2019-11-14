#!/bin/bash

# For use with the build.
sudo apt update && 
sudo apt install -y python3-pip && 
cd /mnt && 
pip3 install -r scripts/requirements.txt && 
python3 scripts/smoke-test.py build/index.html || curl --upload-file image.png https://transfer.sh