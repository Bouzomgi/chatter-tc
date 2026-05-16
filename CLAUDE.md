# chatter-tc

Infrastructure and deployment config for the Chatter app.

## What it does

Ties together the frontend and backend containers behind an nginx reverse proxy and provides zero-downtime deploys via a blue/black container swap strategy. GitHub Actions builds and pushes images on merge, then triggers the deployment server to swap traffic to the new version.

## What's here

- **Docker Compose** files for local dev and production
- **GitHub Actions** CI/CD workflows
- **deploymentServer** — a small Express app that orchestrates blue/black container deployments via Docker
- **nginx** — reverse proxy config routing traffic to frontend and backend containers

## Compose files

| File                            | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `docker-compose.yaml`           | Local development                  |
| `docker-compose.prod.yaml`      | Production (Raspberry Pi / ARM64)  |
| `docker-compose.surrounds.yaml` | Supporting services (DB, S3, etc.) |

## Deployment strategy

The `deploymentServer` runs on the host and exposes HTTP endpoints to:

- `deployBlack` — spin up a new "black" container for fe or be
- `switchTraffic` — point nginx to the new container
- `destroyBlack` — tear down the old container

This enables zero-downtime deploys. GHA triggers these endpoints after a successful image push.

## Key details

- Production target is a Raspberry Pi — images must be built for `linux/arm64`
- Nginx config lives in `deploymentServer/nginx/`
- Auth token required to hit deployment endpoints in production (`AUTH_TOKEN` env var)
