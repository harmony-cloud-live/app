<script>
    import { RefreshIcon, SettingsIcon } from '$lib/icons';
    import { isLeader } from '$lib/stores';
    import { controlSocket } from '$lib/ws';
    import { LeaderDisplay } from '$lib/components';
</script>

<header>
    <div class="corner">
        {#if $isLeader}
            <button on:click={() => {
                $controlSocket.newMainSequence();
            }}>
                <img src={RefreshIcon} alt="Refresh" />
            </button>
        {/if}
    </div>
    <LeaderDisplay />
    <div class="corner">
        {#if $isLeader}
            <button>
                <img src={SettingsIcon} alt="Settings" />
            </button>
        {/if}
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        padding: .75em;
        max-height: 3.75em;
    }

    .corner {
        border-radius: 1.25em;
        width: 4em;
        height: 4em;
    }

    .corner button {
        background-color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    .corner img {
        width: 2em;
        height: 2em;
        object-fit: contain;
    }
</style>
