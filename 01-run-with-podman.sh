#!/bin/bash

PLUGIN_IMAGE_TAG=${PLUGIN_IMAGE_TAG:-localhost:5000/${USER}/example-root-http-middleware:0.0.1}
# for now use the PR image that supports this
APP_IMAGE=quay.io/janus-idp/backstage-showcase:pr-1881
#APP_IMAGE=quay.io/janus-idp/backstage-showcase:next

# Uncomment the following to use an RHDH image
# APP_IMAGE=quay.io/rhdh/rhdh-hub-rhel9:next

PLUGIN_MOUNT="--mount=type=image,src=${PLUGIN_IMAGE_TAG},dst=/opt/app-root/src/dynamic-plugins-root"
# Uncomment the following to load the plugins from the deploy directory
#PLUGIN_MOUNT="-v ./deploy:/opt/app-root/src/dynamic-plugins-root:Z"

podman pull ${APP_IMAGE}
podman run \
    -e LOG_LEVEL=info \
    -e HOSTNAME=${HOSTNAME:-localhost} \
    -e ENABLE_CORE_ROOTHTTPROUTER_OVERRIDE=true \
    ${PLUGIN_MOUNT} \
    -v ./app-config.yaml:/opt/app-root/src/app-config.yaml:Z \
    -p 7007:7007 \
    --entrypoint='["node", "packages/backend", "--config", "app-config.yaml"]' \
    ${APP_IMAGE}