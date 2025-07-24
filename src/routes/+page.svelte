<script>
    import { onMount } from 'svelte';
    import { connectWebSocket, karaokeState, endSession } from '$lib/stores/karaoke.js';

    onMount(() => {
        connectWebSocket();
    });
</script>

<svelte:head>
    <title>Karaoke App</title>
</svelte:head>

<main>
    <h1>🎤 Karaoke App</h1>

    <div class="window-links">
        <a href="/control" target="_blank">🎛️ Control Window</a>
        <a href="/display" target="_blank">📺 Display Window</a>
    </div>

    <div class="session-controls">
        <button on:click={endSession} class="end-session">End Session</button>
    </div>

    <div class="current-status">
        <h2>Current Status</h2>
        {#if $karaokeState.currentSong}
            <div class="now-playing">
                <strong>Now Playing:</strong> {$karaokeState.currentSong.song}
                <br>
                <strong>Singer:</strong> {$karaokeState.currentSong.singer}
            </div>
        {:else}
            <p>No song currently playing</p>
        {/if}

        <div class="queue-info">
            <strong>Songs in Queue:</strong> {$karaokeState.queue.length}
        </div>
    </div>

    <details>
        <summary>Debug: Raw State</summary>
        <pre>{JSON.stringify($karaokeState, null, 2)}</pre>
    </details>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 30px;
	}

	.window-links {
		display: flex;
		gap: 20px;
		justify-content: center;
		margin: 30px 0;
	}

	.window-links a {
		display: inline-block;
		padding: 15px 30px;
		background: #007acc;
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: bold;
		transition: background 0.2s;
	}

	.window-links a:hover {
		background: #005c99;
	}

	.session-controls {
		text-align: center;
		margin: 30px 0;
	}

	.end-session {
		padding: 12px 25px;
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: background 0.2s;
	}

	.end-session:hover {
		background: #c82333;
	}

	.current-status {
		background: #f8f9fa;
		padding: 20px;
		border-radius: 8px;
		margin: 20px 0;
	}

	.now-playing {
		background: #d4edda;
		padding: 15px;
		border-radius: 6px;
		border-left: 4px solid #28a745;
	}

	.queue-info {
		margin-top: 15px;
		font-size: 18px;
	}

	details {
		margin-top: 30px;
	}

	summary {
		cursor: pointer;
		font-weight: bold;
		margin-bottom: 10px;
	}

	pre {
		background: #f8f9fa;
		padding: 15px;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 12px;
	}
</style>