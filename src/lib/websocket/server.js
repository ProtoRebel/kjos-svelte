import { WebSocketServer } from 'ws';
import { loadState, saveState } from '../utils/storage.js';

let wss;
let currentState = {};

export async function startWebSocketServer(port = 8080) {
    wss = new WebSocketServer({ port });

    // Load initial state
    currentState = await loadState();

    wss.on('connection', (ws) => {
        console.log('Client connected');

        // Send current state to new client
        ws.send(JSON.stringify({
            type: 'state_sync',
            data: currentState
        }));

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleMessage(data, ws);
            } catch (error) {
                console.error('Invalid message:', error);
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });

    console.log(`WebSocket server started on port ${port}`);
    return wss;
}

function handleMessage(data, sender) {
    switch (data.type) {
        case 'state_update':
            currentState = { ...currentState, ...data.payload };
            saveState(currentState);
            broadcast(data, sender);
            break;
        case 'end_session':
            currentState = {
                currentSong: null,
                queue: [],
                isPlaying: false,
                singers: [],
                currentWindow: 'main'
            };
            saveState(currentState);
            broadcast({ type: 'session_ended', data: currentState }, sender);
            break;
        case 'ping':
            sender.send(JSON.stringify({ type: 'pong' }));
            break;
    }
}

function broadcast(data, sender) {
    wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}