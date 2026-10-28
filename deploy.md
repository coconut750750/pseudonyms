### installing server

1. `nvm use`

2. `npm ci --omit=dev`

### installing and building the client

1. `npm run build`

### deploying the server

1. after a new build, restart it: `forever start server.js --uid pseudonyms`
