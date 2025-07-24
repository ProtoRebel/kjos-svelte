<script>
    import { onMount } from 'svelte';
    import { connectWebSocket, karaokeState } from '$lib/stores/karaoke.js';

    onMount(() => {
        connectWebSocket();
    });
</script>

<svelte:head>
    <title>Karaoke Display</title>
</svelte:head>

<main>
    {#if $karaokeState.currentSong}
        <div class="now-playing">
            <div class="song-title">{$karaokeState.currentSong.song}</div>
            <div class="singer-name">🎤 {$karaokeState.currentSong.singer}</div>
        </div>
    {:else}
        <div class="waiting">
            <div class="waiting-message">🎵 Ready for Karaoke! 🎵</div>
            <div class="sub-message">Waiting for the next song...</div>
        </div>
    {/if}

    {#if $karaokeState.queue.length > 0}
        <div class="up-next">
            <h3>🎶 Up Next</h3>
            <div class="next-songs">
                {#each $karaokeState.queue.slice(0, 3) as item, index}
                    <div class="next-item">
                        <span class="next-number">{index + 1}</span>
                        <div class="next-info">
                            <div class="next-song">{item.song}</div>
                            <div class="next-singer">{item.singer}</div>
                        </div>
                    </div>
                {/each}
                {#if $karaokeState.queue.length > 3}
                    <div class="more-songs">
                        ...and {$karaokeState.queue.length - 3} more songs
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</main>

<style>
	main {
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		text-align: center;
	}

	.now-playing {
		animation: fadeIn 0.5s ease-in;
	}

	.song-title {
		font-size: 4rem;
		font-weight: bold;
		margin-bottom: 20px;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
		line-height: 1.2;
	}

	.singer-name {
		font-size: 2.5rem;
		margin-bottom: 40px;
		opacity: 0.9;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
	}

	.waiting {
		animation: pulse 2s ease-in-out infinite alternate;
	}

	.waiting-message {
		font-size: 3.5rem;
		font-weight: bold;
		margin-bottom: 20px;
		text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
	}

	.sub-message {
		font-size: 1.8rem;
		opacity: 0.8;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
	}

	.up-next {
		position: fixed;
		bottom: 40px;
		left: 40px;
		right: 40px;
		background: rgba(0,0,0,0.4);
		backdrop-filter: blur(10px);
		border-radius: 15px;
		padding: 25px;
		max-width: 800px;
		margin: 0 auto;
	}

	.up-next h3 {
		margin: 0 0 20px 0;
		font-size: 1.5rem;
		text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
	}

	.next-songs {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.next-item {
		display: flex;
		align-items: center;
		gap: 15px;
		padding: 10px;
		background: rgba(255,255,255,0.1);
		border-radius: 8px;
	}

	.next-number {
		background: rgba(255,255,255,0.2);
		width: 35px;
		height: 35px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		flex-shrink: 0;
	}

	.next-info {
		text-align: left;
		flex: 1;
	}

	.next-song {
		font-weight: bold;
		font-size: 1.1rem;
	}

	.next-singer {
		opacity: 0.8;
		font-size: 0.9rem;
		margin-top: 2px;
	}

	.more-songs {
		text-align: center;
		opacity: 0.7;
		font-style: italic;
		margin-top: 10px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		from {
			opacity: 0.8;
		}
		to {
			opacity: 1;
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.song-title {
			font-size: 2.5rem;
		}

		.singer-name {
			font-size: 1.8rem;
		}

		.waiting-message {
			font-size: 2.5rem;
		}

		.sub-message {
			font-size: 1.3rem;
		}

		.up-next {
			bottom: 20px;
			left: 20px;
			right: 20px;
			padding: 20px;
		}
	}
</style>