<script>
    import { page } from '$app/stores';
    import { RefreshIcon, SettingsIcon } from '$lib/icons';
    import { currentBeat, currentIndex, isLeader } from '$lib/stores';
    import { controlSocket } from '$lib/ws';
</script>

<header>
    <div class="corner">
        {#if $isLeader}
            <button on:click={() => {
                $controlSocket.newMainSequence();
                $currentIndex = 0;
                $currentBeat = 0;
            }}>
                <img src={RefreshIcon} alt="Refresh" />
            </button>
        {/if}
    </div>
    <nav>
        <ul>
            <li aria-current={$page.url.pathname === '/play' ? 'page' : undefined}>
                <a href="/play">play</a>
            </li>
            <li aria-current={$page.url.pathname === '/listen' ? 'page' : undefined}>
                <a href="/play">listen</a>
            </li>
        </ul>
    </nav>
    <div class="corner">
        <button>
            <img src={SettingsIcon} alt="Settings" />
        </button>
    </div>
</header>

<style>
    header {
        display: flex;
        justify-content: space-between;
        padding: .75em;
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

    nav {
        padding: 0 1em;
        display: flex;
        align-items: flex-start;
        max-height: 3em;
        justify-content: center;
        border-radius: 2.5em;
        background-color: #1a1a1a;
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        background: var(--background);
        background-size: contain;
    }

    li {
        position: relative;
        height: 100%;
    }

    li[aria-current='page']::before {
        --size: 8px;
        content: '';
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: calc(50% - var(--size));
        border: var(--size) solid transparent;
        border-top: var(--size) solid #eee;
    }

    nav a {
        display: flex;
        height: 100%;
        align-items: center;
        padding: 0 0.5rem;
        color: var(--color-text-1);
        font-weight: 700;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        text-decoration: none;
        transition: color 0.2s linear;
    }

</style>
