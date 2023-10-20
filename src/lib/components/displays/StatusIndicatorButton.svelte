<!-- Status indicator button component-->
<script lang='ts'>
    import { onMount, onDestroy } from 'svelte';
    import { forceStart, isReady, midiSocketReady } from '$lib/stores';
    import { Circle3 } from 'svelte-loading-spinners';
    import { CheckIcon } from '$lib/icons';
    import { fly } from 'svelte/transition';
    
    let timedOut = false;
    let timeout: any;

    const connect = () => {
        if (timedOut && !$isReady && !midiSocketReady) {
            console.log('setting forceStart to true')
            $forceStart = true;
        }
    }

    onMount(() => {
        timeout = setTimeout(() => {
            timedOut = true;
        }, 60000);
    });

    onDestroy(() => {
        clearTimeout(timeout);
    });
</script>


<button in:fly class={($midiSocketReady ? 'green' : 'yellow') + '-gradient'} on:click={connect}>
    {#if $midiSocketReady}
        <span class='status'>
            connected
            <img src={CheckIcon} alt='check' width='25' /> 
        </span>
    {:else}
        <span class='status'>
            {#if timedOut}
                continue without midi?
            {:else}
                loading midi port...
            {/if}
            <Circle3
                ballTopLeft="white"
                ballTopRight="white"
                ballBottomLeft="white"
                ballBottomRight="white"
                duration='1.5s'
                size={30}
            />
        </span>
    {/if}
</button>

<style>
    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .5em;
    }

    button {
        border-radius: 1.5em;
        box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.2);
        border: 0 transparent;
        padding: 0.6em 1.2em;
        font-weight: 700;
        font-size: 1.25rem;
        text-transform: uppercase;
        text-decoration: none;
        background-color: transparent;
        color: var(--color-text-1);
        cursor: pointer;
        box-shadow: 0 0 0 3px rgb(26, 26, 26, 0);
        transition: all 0.5s ease-in-out;
    }

    .connecting-gradient {
        color: var(--color-text-1);
    }
</style>