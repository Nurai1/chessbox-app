// Intentionally do not load server/.env or .env.test: the runner and API must
// use the very same explicit database, never an implicit developer connection.
export const environment = {
  web: 'http://localhost:5173',
  api: 'http://localhost:3001',
  mongo: process.env.E2E_MONGO_URI || 'mongodb://127.0.0.1:27018/chessbox_e2e',
  mailpit: 'http://127.0.0.1:8025',
};
