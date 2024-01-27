<script lang="ts">
    import { RefreshIcon } from '$lib/icons';
import { controlSocket, isLeader, timeSignature } from '$lib/stores';
    import { isValidTimeSignature, type TimeSignature, isEqualTimeSignature } from '$lib/types';
    import { cubicInOut } from 'svelte/easing';
    import { fly, slide } from 'svelte/transition';
    
    $: changed = !isEqualTimeSignature($timeSignature, timeSignatures[selected]);
    $: hidden = !$isLeader;
    $: if (isValidTimeSignature($timeSignature)) {
        selected = timeSignatures.findIndex(ts =>
            ts.upper === $timeSignature.upper &&
            ts.lower === $timeSignature.lower
        );
    }

    let selected: number;
    const handleClick = () => {
        if (changed) {
            $controlSocket.newTimeSignature(timeSignatures[selected]);
        }
    }

    const timeSignatures: TimeSignature[] = [
        {upper: 3, lower: 4},
        {upper: 4, lower: 4},
        {upper: 5, lower: 4},
    ];
</script>

<div class="container" class:hidden>
    {#if changed}
        <button class="confirm green-gradient"
            on:click={handleClick}
            transition:fly={{ x: 25, duration: 125, easing: cubicInOut }}>
            <img src={RefreshIcon} alt="check" />
        </button>
    {/if}
    {#each timeSignatures as timeSignature, index}
    <div class="time-signature-wrapper" class:active={index === selected}>
        <button on:click={() => selected = index}>
            <div>{timeSignature.upper}</div>
            <div>{timeSignature.lower}</div>
        </button>
    </div>
    {/each}
</div>

<style>
    .time-signature-wrapper {
        border-radius: 5em;
        padding: .2em;
    }
    
    .active {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
    }
    
    
    .container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        gap: .5em;
        height: 100%;
        transition: .2s all;
    }
    
    button {
        background-color: #1a1a1a;
        border-radius: inherit;
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
    
    .hidden {
        margin-top: -5em;
    }
    
    button.confirm {
        width: 4em;
        height: 4em;
        border-radius: 50%;
        background-color: #1a1a1a;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>