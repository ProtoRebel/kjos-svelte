import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create reactive store
export const karaokeState = writable({
    currentSong: null,
    queue: [],
    isPlaying: false,
    singers: [],
    currentWindow: 'main'
});

let ws;
let reconnectTimeout;

// WebSocket connection
export function connectWebSocket() {
    if (!browser) return;

    const connect = () => {
        ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'state_sync':
                    karaokeState.set(data.data);
                    break;
                case 'state_update':
                    karaokeState.set(data.payload);
                    break;
                case 'session_ended':
                    karaokeState.set(data.data);
                    break;
                case 'pong':
                    // Handle ping/pong for connection health
                    break;
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed, attempting to reconnect...');
            reconnectTimeout = setTimeout(connect, 3000);
        };
    };

    connect();
}

// Send updates to other windows
export function updateState(newState) {
    karaokeState.update(state => {
        const updated = { ...state, ...newState };

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'state_update',
                payload: updated
            }));
        }

        return updated;
    });
}

// End session
export function endSession() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'end_session' }));
    }

    karaokeState.set({
        currentSong: null,
        queue: [],
        isPlaying: false,
        singers: [],
        currentWindow: 'main'
    });
}

// Add song to queue
export function addSongToQueue(song, singer) {
    karaokeState.update(state => {
        const newQueue = [...state.queue, { song, singer, id: Date.now() }];
        const updated = { ...state, queue: newQueue };

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'state_update',
                payload: updated
            }));
        }

        return updated;
    });
}

// Start next song
export function startNextSong() {
    karaokeState.update(state => {
        if (state.queue.length === 0) return state;

        const [nextSong, ...remainingQueue] = state.queue;
        const updated = {
            ...state,
            currentSong: nextSong,
            queue: remainingQueue,
            isPlaying: true
        };

        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'state_update',
                payload: updated
            }));
        }

        return updated;
    });
}

// Stop current song
export function stopCurrentSong() {
    updateState({ currentSong: null, isPlaying: false });
}