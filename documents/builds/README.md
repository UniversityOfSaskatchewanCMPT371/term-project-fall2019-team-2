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

## More information

Our deployments check a couple of conditions.
- If the deployment is on the master branch OR the commit is tagged, we deploy it to our test server (this is treated like a release build)
- If the deployment is on the develop branch, it is deployed to the dev server

Docker images are automatically created for all the work in progress branches that people create with the prefix `feature/`. For example:

- Kevin starts working on a development branch named  `feature/my-cool-feature`
- This is automatically deployed to the Docker Registry and tagged as `my-cool-feature`
- This means that if Mesa for example wanted to quickly look at what Kevin did without checkout out his branch, worrying about stashing, etc, he can run `docker run braunson/cmpt371:my-cool-feature` and automatically he has Kevins work running that he can view in his browser (without compiling or installing etc)
- Our images are a mere 30MB so they download and run fast.

Another example:
- Amanada creates a branch called `bug/my-bug`
- The deployment does not generate an image automatically because it is not a feature branch.

Interested in how docker works? Keep reading.
Our Docker images are mini Linux distributions specially crafted to serve our application. The images are super small, 30MB as of writing, and include our compiled source code, a mini webserver, and a full unix based OS named Alpine. We use Alpine for it’s small file size (a full OS with our code is only 30MB). We do other special tricks to keep the file size down and keep things secure. For instance, none of our source code is inside the final built and deployed images. These are stored in an intermediary image that is thrown out during the build process. The final image also runs on a non-root user, which prevents any sort of exploration of the file system that isn’t strictly our distribution artifacts.

Interested in how we handle the deployments? Keep reading.
On the server side, we support rolling, loadbalanced, deploys. This means that we actually run 3 independent containers on the server that are round robin load balanced between healthy nodes. When a deployment takes place, one of the nodes is taken out of rotation and updated to the newest version. At that point we wait 10s for a healthy state reported by the container. Once we hear it is healthy we keep waiting for it to stay healthy for 10 more seconds. At that point we allow traffic to be routed to it and update the next node until all nodes are updated.

Our endpoints are automatically SSL Encrypted using Let’s Encrypt which latches onto our docker containers at each node and updates the certificates as they become live and before they enter the rotation to receive public traffic.

**TLDR:** The hosts for the dev and test environment which give you a snapshot of the `master` and `develop` branches are at:
- `<redacted see slack>` for the testing environment (our most stable builds to show Osgood)
- `<redacted see slack>` for the dev environment (our less stable builds that haven’t been QA’d)