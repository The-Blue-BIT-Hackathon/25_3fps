# Tech Stack

1.  Node.js
2.  ReactJS
3.  WebRTC & Socketio
4.  Github Actions , CircleCI & Jenekins
5.  Terraform & Ansible
6.  AWS & Azure
7.  Kubernetes & Docker
8.  ArgoCD & Flux
9.  Datree.io , Jest & KubeScape (for Testing images and yaml files validation)

## What is the end-result ??

I successfully implemented the video calling feature.I also implemented:

1. Adding own name to profile with which you join the meeting
2. Update whenever somebody joins or leaves the meeting
3. Copy URL in-meeting
4. Chatbox
5. Send invitation through email
6. Leave meeting

## Running App on your local system

```bash

git clone

cd

docker-compose up

```

## Running App on your kubernetes cluster

```bash

git clone

cd

kubectl apply -f argocd.yaml

```

### Running App on AWS

```bash

git clone

cd

terraform apply

```

### Deploying to Civo Cluster

```bash

git clone

cd

terraform apply

```

## Demo

live app : https://letsmeetapp.netlify.app/
