<script lang="ts">
    import { manualProgression, songTitle } from '$lib/stores';
    import chordProgressions from '$lib/data/songs.json';
    import ManualButton from './ManualButton.svelte';

    const songs = chordProgressions.map(s => {
        return {
            name: s.title,
            chords: s.chordSymbols,
            key: s.key,
            fontSize: Number(s.fontSize) ?? 2,
            length: s.chordSymbols.reduce((acc, curr) => acc + curr.length, 0),
        }
    });

    let song = songs[0];
    songTitle.subscribe($songTitle => {
        song = songs.find(s => s.name === $songTitle) ?? song;
        $manualProgression = song.chords;
    });

    $: fontSize = song.fontSize ?? 2;
</script>

<div class="container">
    {#each song.chords as chords, row (row)}
        <div class="row">
            {#each chords as chordSymbol, col (col)}
                <ManualButton {chordSymbol} {fontSize} {row} {col} />
            {/each}
        </div>
    {/each}
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: .5em;
    }
    .container {
        display: flex;
        flex-direction: column;
        gap: .5em;
        width: 100vw;
        max-height: 70vh;
    }
</style>
