<script lang="ts">
    import { RefreshIcon } from "$lib/icons";
    import { isLeader, isLoadingMainSequence, songTitle, chordCollection, aiMode } from "$lib/stores";
    import { controlSocket } from "$lib/ws";
    import chordCollections from "$lib/data/chords.json";
    import type { ChordCollection } from "$lib/types";
    import { Moon } from "svelte-loading-spinners";
    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    
    const collections = chordCollections.map(c => {
        return {
            name: c.title,
            chords: c.chordSymbols.sort(),
            key: c.key,
        }
    });
    
    let selectedCollection: ChordCollection = collections[0];
    
    $: changed = $chordCollection &&
        selectedCollection &&
        $chordCollection.name !== selectedCollection.name;
        
    $: disabled = !$aiMode;
        
    songTitle.subscribe($songTitle => {
        selectedCollection = collections.find(c => c.name === $songTitle) ?? selectedCollection;
        $chordCollection = selectedCollection;
    })

    const handleClick = () => {
        if ($isLoadingMainSequence) return;
        if (changed) $chordCollection = selectedCollection;
        $controlSocket.newMainSequence($chordCollection.name);
    }
</script>

{#if $isLeader}
    <div class="container" class:disabled transition:fly={{y: -50, duration: 150, easing: cubicInOut}}>
        <div class="refresh-wrapper" class:changed>
            <button class="refresh" on:click={handleClick}>
                {#if $isLoadingMainSequence}
                    <Moon color="#fff" duration="1s" size={25}/>
                {:else}
                    <img src={RefreshIcon} alt="Refresh"/>
                {/if}
            </button>
        </div>
        <div class="dropdown">
            <select bind:value={selectedCollection}>
                {#each collections as collection (collection.name)}
                    <option value={collection}>{collection.name}</option>
                {/each}
            </select>
        </div>
    </div>
{/if}

<style>
    .disabled {
        pointer-events: none;
        opacity: .4;
    }

    select {
        -webkit-appearance: none;
        user-select: none;
        outline: none;
        border: none;
        appearance: none;
        background: transparent;
        color: white;
        font-size: 1.25em;
        font-weight: 400;
        padding-right: 1.5em;
    }
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .5em;
        transition: .2s all;
    }
    
    .dropdown {
        background-color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 3.75em;
        border-radius: 2em;
        padding: 0 1em;
        position: relative;
    }

    div.dropdown::after {
        --size: 8px;
        content: '';
        width: 0;
        height: 0;
        top: 43%;
        position: absolute;
        right: 7%;
        border: var(--size) solid transparent;
        border-top: var(--size) solid #eee;
    }

    button.refresh {
        background-color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.75em;
        height: 3.75em;
        border-radius: inherit;
        transition: .2s all;
    }
    
    .refresh-wrapper {
        border-radius: 5em;
        padding: .2em;
    }
    
    .changed {
        background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%, #cc2366 75%, #bc1888 100%);
    }
    
    img {
        margin-left: .1em;
        width: 1.75em;
        height: 1.75em;
        object-fit: contain;
    }

</style>