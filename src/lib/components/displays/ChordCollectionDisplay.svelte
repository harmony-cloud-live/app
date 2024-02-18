<script lang="ts">
    import { RefreshIcon } from "$lib/icons";
    import { isLeader, isLoadingMainSequence, songTitle, chordCollection, aiMode } from "$lib/stores";
    import { controlSocket } from "$lib/ws";
    import chordCollections from "$lib/data/chords.json";
    import { Moon } from "svelte-loading-spinners";
    import { fly } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import type { ChordCollection } from "$lib/types";
    
    const collections = chordCollections.map(c => {
        return {
            name: c.title,
            chords: c.chordSymbols,
            key: c.key,
        }
    });
    
    let selectedCollection: ChordCollection = collections[0];
        
    songTitle.subscribe($songTitle => {
        selectedCollection = collections.find(c => c.name === $songTitle) ?? collections[0];
        $chordCollection = selectedCollection
    })

    const refresh = () => {
        if ($isLoadingMainSequence) return;
        $controlSocket.newMainSequence(selectedCollection.name);
        $songTitle = selectedCollection.name;
    }
</script>

{#if $isLeader}
    <div class="container" transition:fly={{y: -50, duration: 150, easing: cubicInOut}}>
        <div class="refresh-wrapper">
            <button class="refresh" on:click={refresh}>
                {#if $isLoadingMainSequence}
                    <Moon color="#fff" duration="1s" size={25}/>
                {:else}
                    <img src={RefreshIcon} alt="Refresh"/>
                {/if}
            </button>
        </div>
        <div class="dropdown">
            <select bind:value={selectedCollection} on:change={refresh}>
                {#each collections as collection (collection.name)}
                    <option value={collection}>{collection.name}</option>
                {/each}
            </select>
        </div>
    </div>
{/if}

<style>
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
    
    img {
        margin-left: .1em;
        width: 1.75em;
        height: 1.75em;
        object-fit: contain;
    }

</style>