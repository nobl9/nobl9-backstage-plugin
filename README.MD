# Nobl9 plugin for Backstage

[![CI](https://github.com/nobl9/nobl9-backstage-plugin/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/nobl9/nobl9-backstage-plugin/actions/workflows/ci.yaml)

This repository contains a set of [Backstage](https://backstage.io) plugins to support [Nobl9](https://nobl9.com) SLOs in your Backstage installation. The plugins provide a custom entity page to show SLOs for entities of your choice.

The repository contains the following Backstage plugins:

- Nobl9 Backend plugin - acts as a proxy between UI and Nobl9 SLO Status API
- Nobl9 UI plugin - displays SLO statuses for annotated entities

You'll need both plugins to integrate with Nobl9 successfully.

> [!IMPORTANT]
> Starting from version v0.3.0, Nobl9 Backstage plugins support the new [Backstage Backend System](https://backstage.io/docs/backend-system/building-backends/index).

## Feature overview

The plugin allows you to easily access the most up-to-date metrics for any SLO within Backstage, such as the Burn Rate, Remaining Error Budget, labels, etc.

![Nobl9 SLOs tab](/docs/images/backstage-ui-plugin.png 'Nobl9 SLOs tab')

## Installation guide

This guide covers the installation and configuration options for the Nobl9 Backstage plugins. The steps assume you already have a working Backstage application in which you can install the plugins.

<!-- toc -->

- [Nobl9 API credentials](#nobl9-api-credentials)
- [Backend plugin installation](#backend-plugin-installation)
- [UI plugin installation](#ui-plugin-installation)
- [Configure the plugin](#configure-the-plugin)
  - [Global configuration](#global-configuration)
  - [Catalog entity annotations](#catalog-entity-annotations)
- [Uninstall the backstage plugin](#uninstall-the-backstage-plugin)

<!-- tocstop -->

### Nobl9 API credentials

The Nobl9 backend plugin relies on [Nobl9 SLO Status API](https://docs.nobl9.com/api/slo). Hence, you'll need an access key to authorize requests to Nobl9 properly. Use the [official guide](https://docs.nobl9.com/Getting_Started/#access-keys) to generate `Client ID` and `Client Secret`.

### Backend plugin installation

Install the Nobl9 backend plugin package in your Backstage app by running the following command in the root directory:

```
yarn workspace backend add @nobl9/nobl9-backstage-backend-plugin
```

Edit `packages/backend/src/index.ts` to register the backend plugin:

```diff
diff --git a/packages/backend/src/index.ts b/packages/backend/src/index.ts
index 1c442a8..d3af2ba 100644
--- a/packages/backend/src/index.ts
+++ b/packages/backend/src/index.ts
@@ -38,4 +38,7 @@ backend.add(import('@backstage/plugin-search-backend/alpha'));
 backend.add(import('@backstage/plugin-search-backend-module-catalog/alpha'));
 backend.add(import('@backstage/plugin-search-backend-module-techdocs/alpha'));

+// nobl9 plugin
+backend.add(import('@nobl9/nobl9-backstage-backend-plugin'));
+
 backend.start();
```

You can now verify that the backend plugin is running correctly. Access the backend URL by sending a `GET` request to `<backstage app url>/api/nobl9-backend/health`. If the plugin is running, you will receive a response with `{"status":"ok"}`.

### UI plugin installation

Install the Nobl9 UI plugin package in your Backstage app by running the following command in the root directory:

```
yarn workspace app add @nobl9/nobl9-backstage-plugin
```

Find and edit `packages/app/src/components/catalog/EntityPage.tsx` to add the Nobl9 SLOs tab in the entity page layout.

For example, you can embed the plugin for a service entity in the following way:

```diff
diff --git a/packages/app/src/components/catalog/EntityPage.tsx b/packages/app/src/components/catalog/EntityPage.tsx
index 6722ea2..c37def2 100644
--- a/packages/app/src/components/catalog/EntityPage.tsx
+++ b/packages/app/src/components/catalog/EntityPage.tsx
@@ -57,6 +57,7 @@ import {

 import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
 import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
+import { Nobl9Page, isNobl9Available } from '@nobl9/nobl9-backstage-plugin';

 const techdocsContent = (
   <EntityTechdocsContent>
@@ -175,6 +176,10 @@ const serviceEntityPage = (
     <EntityLayout.Route path="/docs" title="Docs">
       {techdocsContent}
     </EntityLayout.Route>
+
+    <EntityLayout.Route path="/slos" title="SLOs" if={isNobl9Available}>
+      <Nobl9Page />
+    </EntityLayout.Route>
   </EntityLayout>
 );
```

### Configure the plugin

#### Global configuration

Add the following Nobl9 configuration section to `app-config.yaml`:

```yaml
nobl9:
  baseUrl: https://app.nobl9.com
  organization: ${NOBL9_ORGANIZATION_ID}
  clientId: ${NOBL9_CLIENT_ID}
  clientSecret: ${NOBL9_CLIENT_SECRET}
```

| Environment variable    | Description                                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `NOBL9_ORGANIZATION_ID` | ID of your organization you can find in the Nobl9 UI in Settings > Account                           |
| `NOBL9_CLIENT_ID`       | Client ID associated with an Access Key generated in the [previous step](#nobl9-api-credentials)     |
| `NOBL9_CLIENT_SECRET`   | Client Secret associated with an Access Key generated in the [previous step](#nobl9-api-credentials) |

Depending on where your Nobl9 organization is hosted, use either `https://app.nobl9.com` or `http://us1.nobl9.com` as the base URL.

The backend plugin will be available under the `/api/nobl9-backend/slos` path by default. You can use the `nobl9.backendPluginPath` config key to provide a custom path.
If, for example, your backend plugins are served without the `/api` prefix, you can use the following config:

```yaml
nobl9:
  baseUrl: https://app.nobl9.com
  organization: ${NOBL9_ORGANIZATION_ID}
  clientId: ${NOBL9_CLIENT_ID}
  clientSecret: ${NOBL9_CLIENT_SECRET}
  backendPluginPath: /nobl9-backend/slos
```

#### Catalog entity annotations

Annotate components of your choice with `nobl9.com/project` annotation and either `nobl9.com/services` and/or `nobl9.com/slos`. Based on multiple annotations, the `AND` operator is used to decide which SLOs to display.

**Available annotations**

| Annotation           | Required           | Description                                 |
| -------------------- | ------------------ | ------------------------------------------- |
| `nobl9.com/project`  | :heavy_check_mark: | Nobl9 project name used to query for SLOs   |
| `nobl9.com/services` |                    | Comma-separated list of Nobl9 service names |
| `nobl9.com/slos`     |                    | Comma-separated list of Nobl9 SLO names     |

**Example annotations**

Component with all SLOs from the Nobl9 `default` project:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: service1
  annotations:
    nobl9.com/project: default
spec:
  type: service
  lifecycle: production
  owner: io
  system: nobl9
```

Component with all SLOs from the Nobl9 `service1` service, that is organized under the `default` project:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: service1
  annotations:
    nobl9.com/project: default
    nobl9.com/services: service1
spec:
  type: service
  lifecycle: production
  owner: io
  system: nobl9
```

Component with two SLOs named `latency` and `error-rate` from the Nobl9 `default` project:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: services2
  annotations:
    nobl9.com/project: default
    nobl9.com/slos: latency,error-rate
spec:
  type: service
  lifecycle: production
  owner: foundations
  system: nobl9
```

### Uninstall the Backstage plugin

1. Remove any configuration added in Backstage `yaml` files, such as the [Nobl9 configuration section](#global-configuration) in `app-config.yaml` and entity annotations.
2. Remove the code snippets from `EntityPage.tsx`
3. Remove the plugin packages:

```
yarn remove --cwd packages/app @nobl9/nobl9-backstage-plugin
yarn remove --cwd packages/app @nobl9/nobl9-backstage-backend-plugin
```
