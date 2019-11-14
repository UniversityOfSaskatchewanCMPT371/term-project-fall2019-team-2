# Scripts

## Installation

To run the Smoke Test script, first ensure you are using Python 3.8 and install
the requirements.

```
pip install -r requirements.txt
```

## Running

Instead of installing the Selenium server, use docker.

Set up a driver using docker:

```
docker run -d -p 4444:4444 --shm-size=2g  -v $(pwd):/mnt selenium/standalone-chrome:3.141.59-xenon
```

Then run the test cases:

```
python scripts/smoke-test.py build/index.html
```