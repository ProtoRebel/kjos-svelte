import { startWebSocketServer } from '../src/lib/websocket/server.js';

console.log('Starting WebSocket server...');
startWebSocketServer(8080).catch(console.error);