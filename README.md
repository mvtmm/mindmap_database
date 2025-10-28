# Directus Mindmap UI

A dockerized React+TypeScript SPA that authenticates with Directus and visualizes collections and relations as an interactive graph at `/map`.

## Stack
- React + TypeScript + Vite
- Cytoscape.js (+ cose-bilkent layout)
- @directus/sdk (REST)
- NGINX (static serving)
- Traefik (routing at `/map`)

## Environment
- `VITE_APP_BASE_PATH=/map/`
- `VITE_DIRECTUS_URL=https://pie-ai-service.hdw.hdwgroup.net/code_server/directus/`

## Run (Docker)
- `docker compose up -d --build map`

## Auth
- Directus email/password login. Access token in memory; refresh via HttpOnly cookie set by Directus.
