<script lang='ts'>
    import { tempo } from '$lib/stores';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let clampTempo: (tempo: number) => number;

    const LONG_PRESS_DELAY = 350; 
    const INCREMENT = 10;

    let longPressActive = false;
    let longPressTimeout: any;

    const handleDown = (delta: number) => {
        $tempo = clampTempo($tempo + delta);
        longPressTimeout = setTimeout(() => {
            longPressActive = true;
            handleLongPress(delta);
        }, LONG_PRESS_DELAY);
    }

    const handleUp = () => {
        clearTimeout(longPressTimeout);
        longPressActive = false;
    }

    const handleLongPress = async (delta: number) => {
        while (longPressActive) {
            $tempo = clampTempo($tempo + INCREMENT * delta);
            await new Promise(r => setTimeout(r, LONG_PRESS_DELAY));
        }
    }
</script>

<div class='controls' transition:slide={{ duration: 200, easing: quintOut }}>
    <button class:longPressActive
        on:pointerdown|preventDefault|stopPropagation={() => handleDown(-1)}
        on:pointerup|preventDefault|stopPropagation={handleUp}>
        -
    </button>
    <button class:longPressActive
        on:pointerdown|preventDefault|stopPropagation={() => handleDown(1)}
        on:pointerup|preventDefault|stopPropagation={handleUp}>
        +
    </button>
</div>


<style>
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 3em;
        height: 3em;
        font-size: 2em;
        font-weight: 700;
        border-radius: 1em;
        background-color: rgb(39, 39, 39);
        border: none;
        outline: none;

        &:active {
            background-color: #1a1a1a;
            outline: white solid .11em;

            &.longPressActive {
                background-color: #393939; 
            }
        }
    }

    div.controls {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 1em;
        margin-top: 1em;
    }
</style>

