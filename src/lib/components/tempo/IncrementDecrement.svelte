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

<div class='controls'>
    <button class="left" class:longPressActive
        on:pointerdown|preventDefault|stopPropagation={() => handleDown(-1)}
        on:pointerup|preventDefault|stopPropagation={handleUp}>
        -
    </button>
    <slot></slot>
    <button class="right" class:longPressActive
        on:pointerdown|preventDefault|stopPropagation={() => handleDown(1)}
        on:pointerup|preventDefault|stopPropagation={handleUp}>
        +
    </button>
</div>


<style>
    .left {
        margin-right: -3.5em;
        padding-right: 4em;
    }
    .right {
        margin-left: -3.5em;
        padding-left: 4em;
    }
    button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 6.3em;
        height: 3.85em;
        font-size: 1.3em;
        font-weight: 700;
        border-radius: 2em;
        background-color: #1a1a1a;
        border: none;
        outline: none;

        &:active {
            background-color: #252525; 

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
    }
</style>

