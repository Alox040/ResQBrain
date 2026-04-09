import { createServer } from './server/createServer';

const PORT = Number(process.env['PORT'] ?? 3001);
const server = createServer();

server.listen(PORT, () => {
  console.log(`ResQBrain API Local running at http://localhost:${PORT}`);
});
