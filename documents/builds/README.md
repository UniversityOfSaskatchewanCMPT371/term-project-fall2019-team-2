# Build Files

This directory contains additional documents required on the dev/staging server for hosting
our containers. 

## Stacks

Docker Swarm is used for deployment and scaling of our infrastructure.

The following stacks are in this directory:

- `nginx-stack.yml` The Nginx Stack is responsible for our SSL certs, static hosting of documents,
and reverse proxying
- `portainer-stack.yml` The Portainer stack sets up the portainer host and the monitoring agent
- `dev-stack.yml`  The development deployment configuration for Docker Swarm
- `test-stack.yml` The testing deployment configuration for Docker Swarm