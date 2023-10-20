<script lang=ts>
    import { currentIndex, mainSequence } from '$lib/stores';

    let previousChord: string;
    let currentChord: string;
    let nextChord: string;

    $: if ($mainSequence.length) {
        // First Chord
        if ($currentIndex < 1 && $mainSequence.length > 0) {
            previousChord = '';
            currentChord = $mainSequence[0].chordSymbol;
            nextChord = $mainSequence[1] ? $mainSequence[1].chordSymbol : '';
        // Last Chord
        } else if ($currentIndex === $mainSequence.length - 1) {
            previousChord = $mainSequence[$currentIndex - 1].chordSymbol;
            currentChord = $mainSequence[$currentIndex].chordSymbol;
            nextChord = '';
        // Everything else
        } else if ($currentIndex > -1 && $currentIndex < $mainSequence.length - 1) {
            previousChord = $mainSequence[$currentIndex - 1].chordSymbol;
            currentChord = $mainSequence[$currentIndex].chordSymbol;
            nextChord = $mainSequence[$currentIndex + 1].chordSymbol;
        }
    }   
</script>

{#if $mainSequence.length}
    <div class="container">
        <div>{previousChord}</div>
        <div class='current'>{currentChord}</div>
        <div>{nextChord}</div>
    </div>
{/if}

<style>
    .container {
        display: flex;
        align-items: center;
        width: 80%;
        height: 100%;
        gap: 1em;
        overflow: visible;
        margin-bottom: .5em;
    }

    div {
        margin: 0 auto;
        width: 15em;
        text-align: center;
        white-space: pre;
        font-size: 1.5em;
    }
    
    .current {
        width: 30em;
        font-size: 3em;
        font-weight: 700;
    }
</style>
