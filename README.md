# Adding a Custom Middleware to Developer Hub via Dynamic Plugin

> [!WARNING]
> This README is currently under construction

To build this example run the following commands:

```terminal
yarn install
```

```terminal
yarn tsc
```

```terminal
yarn build
```

To run this example locally with `podman` using all defaults run the following:

```terminal
yarn package-dynamic-plugins
```

```terminal
bash 01-run-with-podman.sh
```

Use a custom image tag for the plugin via the `PLUGIN_IMAGE_TAG` environment variable.  The script to run the container is set up to use the configuration in [app-config.yaml](./app-config.yaml).

To run this example using something like rhdh-local run the following:

```terminal
DYNAMIC_PLUGINS_ROOT=/path/to/rhdh-local/local-plugins/dir yarn package-dynamic-plugins
```

The command will export the dynamic plugins into the `local-plugins` directory and print the appropriate configuration that you can copy into `configs/dynamic-plugins.yaml`.  This example also needs the configuration from [app-config.yaml](./app-config.yaml) to work properly.
