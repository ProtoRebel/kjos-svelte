<script>
    import { onMount } from 'svelte';
    import {
        connectWebSocket,
        karaokeState,
        addSongToQueue,
        startNextSong,
        stopCurrentSong,
        endSession
    } from '$lib/stores/karaoke.js';

    let songTitle = '';
    let singerName = '';

    onMount(() => {
        connectWebSocket();
    });

    function handleAddSong() {
        if (songTitle.trim() && singerName.trim()) {
            addSongToQueue(songTitle.trim(), singerName.trim());
            songTitle = '';
            singerName = '';
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleAddSong();
        }
    }
</script>

<svelte:head>
    <title>Karaoke Control</title>
</svelte:head>

<main>
    <h1>🎛️ Karaoke Control Panel</h1>

    <div class="control-section">
        <h2>Add Song to Queue</h2>
        <div class="add-song-form">
            <input
                    bind:value={singerName}
                    placeholder="Singer name"
                    on:keypress={handleKeyPress}
            >
            <input
                    bind:value={songTitle}
                    placeholder="Song title"
                    on:keypress={handleKeyPress}
            >
            <button on:click={handleAddSong} disabled={!songTitle.trim() || !singerName.trim()}>
                Add to Queue
            </button>
        </div>
    </div>

    <div class="control-section">
        <h2>Playback Controls</h2>
        <div class="playback-controls">
            <button
                    on:click={startNextSong}
                    disabled={$karaokeState.queue.length === 0}
                    class="start-btn"
            >
                ▶️ Start Next Song
            </button>
            <button
                    on:click={stopCurrentSong}
                    disabled={!$karaokeState.currentSong}
                    class="stop-btn"
            >
                ⏹️ Stop Current Song
            </button>
        </div>
    </div>

    <div class="control-section">
        <h2>Current Status</h2>
        {#if $karaokeState.currentSong}
            <div class="current-song">
                <strong>Now Playing:</strong> {$karaokeState.currentSong.song}
                <br>
                <strong>Singer:</strong> {$karaokeState.currentSong.singer}
            </div>
        {:else}
            <p>No song currently playing</p>
        {/if}
    </div>

    <div class="control-section">
        <h2>Queue ({$karaokeState.queue.length} songs)</h2>
        {#if $karaokeState.queue.length > 0}
            <div class="queue-list">
                {#each $karaokeState.queue as item, index}
                    <div class="queue-item">
                        <span class="queue-number">{index + 1}</span>
                        <div class="song-info">
                            <strong>{item.song}</strong>
                            <div class="singer">by {item.singer}</div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p>Queue is empty</p>
        {/if}
    </div>

    <div class="control-section danger">
        <button on:click={endSession} class="end-session">
            🛑 End Session
        </button>
    </div>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 30px;
	}

	.control-section {
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
	}

	.control-section.danger {
		border-color: #dc3545;
		background: #fff5f5;
	}

	h2 {
		margin-top: 0;
		margin-bottom: 15px;
		color: #555;
	}

	.add-song-form {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	input {
		flex: 1;
		min-width: 200px;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 16px;
	}

	button {
		padding: 12px 20px;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 16px;
		font-weight: bold;
		transition: all 0.2s;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.add-song-form button {
		background: #28a745;
		color: white;
	}

	.add-song-form button:hover:not(:disabled) {
		background: #218838;
	}

	.playback-controls {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
	}

	.start-btn {
		background: #007bff;
		color: white;
	}

	.start-btn:hover:not(:disabled) {
		background: #0056b3;
	}

	.stop-btn {
		background: #6c757d;
		color: white;
	}

	.stop-btn:hover:not(:disabled) {
		background: #545b62;
	}

	.current-song {
		background: #d4edda;
		padding: 15px;
		border-radius: 6px;
		border-left: 4px solid #28a745;
	}

	.queue-list {
		max-height: 300px;
		overflow-y: auto;
	}

	.queue-item {
		display: flex;
		align-items: center;
		padding: 12px;
		border-bottom: 1px solid #eee;
		gap: 15px;
	}

	.queue-item:last-child {
		border-bottom: none;
	}

	.queue-number {
		background: #007bff;
		color: white;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		flex-shrink: 0;
	}

	.song-info {
		flex: 1;
	}

	.singer {
		color: #666;
		font-size: 14px;
		margin-top: 2px;
	}

	.end-session {
		background: #dc3545;
		color: white;
		width: 100%;
	}

	.end-session:hover {
		background: #c82333;
	}
</style>