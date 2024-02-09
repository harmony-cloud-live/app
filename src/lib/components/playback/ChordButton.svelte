<script lang="ts">
    import { controlSocket, midiSocket } from "$lib/ws";
    import {
        mainSequence,
        currentIndex,
        loopEnd,
        loopStart,
        dragging,
        isPlaying,
        isSustaining,
        isLeader,
        previousIndex,
    } from "$lib/stores";

    export let chord: string;
    export let index: number;
    export let isInLoop: boolean, isLoopStart: boolean, isLoopEnd: boolean;
    export let isCurrent: boolean;

    let fontSize = 1;
    $: {
        const length = $mainSequence.length;
        if (length <= 8) fontSize = 2;
        else if (length <= 16) fontSize = 1.5;
        else if (length <= 24) fontSize = 1.35;
        else if (length <= 32) fontSize = 1;
        else if (length <= 64) fontSize = 0.75;
    };

    const handleDown = () => {
        if (!$isPlaying) {
            if ($isSustaining)
                $midiSocket.sendChordUp($previousIndex);
            $midiSocket.sendChordDown(index);
        }

        $currentIndex = index;
        $loopStart = index;
        $loopEnd = -1;
        $dragging = true;
    };

    const handleUp = () => {
        if (!$isPlaying && !$isSustaining) {
            $midiSocket.sendChordUp(index);
        }

        if ($isSustaining) {
            $previousIndex = $currentIndex;
        }

        if (!$dragging || $loopStart === -1 || $loopEnd < $loopStart) {
            $loopStart = -1;
            $loopEnd = -1;
        }

        $dragging = false;
    };

    const handleMove = (event: PointerEvent) => {
        if (!$dragging || $loopStart === -1) return;
        const clientX = event.clientX;
        const clientY = event.clientY;

        if (clientX === undefined || clientY === undefined) {
            console.error("clientX or clientY is undefined", event);
            return;
        }

        const hovered: Element | null = document.elementFromPoint(clientX, clientY);
        if (hovered === null) return;

        const rawIndex: string | null = hovered.getAttribute("data-index");
        if (rawIndex === null) return;

        const index: number = parseInt(rawIndex);
        if (typeof index === "number" && index > $loopStart) {
            $loopEnd = index;
            $controlSocket.newLoop($loopStart, $loopEnd);
        }
    };

    $: isListener = !$isLeader;
</script>

<button
    class:isListener
    class:isCurrent
    class:isInLoop
    class:isLoopStart
    class:isLoopEnd
    data-index={index}
    style={`font-size: ${fontSize}em`}
    on:pointerdown|preventDefault={handleDown}
    on:pointerup|preventDefault={handleUp}
    on:pointermove|preventDefault={handleMove}>
    {chord}
</button>

<style>
    button {
        position: relative;
        border-radius: 0.5em;
        border: 0 transparent;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #1a1a1a;
        color: var(--color-text-1);
        cursor: pointer;
        outline: 3px transparent;
        transition:
            outline-width 0.2s,
            outline-color 0.25s,
            border-radius 0.25s;
        touch-action: none;
    }

    button.isInLoop {
        outline: 3px solid #fadb2f;

        &.isLoopStart {
            border-radius: 1.75em 0.75em 0.75em 1.75em;
        }
        &.isLoopEnd {
            border-radius: 0.75em 1.75em 1.75em 0.75em;
        }
    }

    button.isCurrent {
        background: linear-gradient(
            45deg,
            #f09433 0%,
            #e6683c 25%,
            #dc2743 50%,
            #cc2366 75%,
            #bc1888 100%
        );

        &.isListener {
            background: linear-gradient(100deg, #00d2ff 0%, #3a47d5 100%);
        }
    }
</style>
