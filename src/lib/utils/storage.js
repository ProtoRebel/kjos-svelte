import { promises as fs } from 'fs';
import path from 'path';
import debounce from 'lodash.debounce';

const DATA_FILE = path.join(process.cwd(), 'data', 'karaoke-state.json');

// Debounced save function to prevent excessive file writes
const debouncedSave = debounce(async (state) => {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify(state, null, 2));
        console.log('State saved to file');
    } catch (error) {
        console.error('Error saving state:', error);
    }
}, 1000);

export function saveState(state) {
    debouncedSave(state);
}

export async function loadState() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        console.log('State loaded from file');
        return JSON.parse(data);
    } catch (error) {
        console.log('No existing state file, starting fresh');
        return {
            currentSong: null,
            queue: [],
            isPlaying: false,
            singers: [],
            currentWindow: 'main'
        };
    }
}