<script lang="ts">
    // import { controlSocket } from '$lib/ws';
    import { isLeader } from '$lib/stores';
</script>

{#if $isLeader}
    <div class="container">
        <button>
            <div>3</div>
            <div>4</div>
        </button>
        <button>
            <div>4</div>
            <div>4</div>
        </button>
        <button>
            <div>5</div>
            <div>4</div>
        </button>
    </div>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: .5em;
        height: 100%;
    }
    
    button {
        background-color: #1a1a1a;
        border-radius: 1.25em;
        width: 3em;
        height: 4em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    button > div:first-child {
        border-bottom: 1px solid white;
    }
</style>