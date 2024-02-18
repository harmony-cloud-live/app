<script lang='ts'>
    import { tempo } from '$lib/stores';

    export let clampTempo: (tempo: number) => number;

    const TAP_TEMPO_WINDOW = 4;
    const TAP_TEMPO_TIMEOUT = 2000;

    let tapIntervals: number[] = [];
    let tapTimeout: any;
    let lastTimestamp: number = 0;
    let metronomeLeft = true;

    function handleTapTempo() {
        metronomeLeft = !metronomeLeft;

        const now = Date.now();
        if (lastTimestamp !== 0) {
            const diffMs = (now - lastTimestamp) / 1000;
            tapIntervals.push(diffMs);

            if (tapIntervals.length > TAP_TEMPO_WINDOW)
                tapIntervals.shift();
        }
        lastTimestamp = now;

        if (tapIntervals.length >= 2) {
            const averageDiff = tapIntervals.reduce((a, b) => a + b, 0) / tapIntervals.length;
            const bpm = 60 / averageDiff;
            $tempo = clampTempo(bpm);
        }

        clearTimeout(tapTimeout);
        tapTimeout = setTimeout(() => {
            tapIntervals.length = 0;
            lastTimestamp = 0;
        }, TAP_TEMPO_TIMEOUT); 
    }
</script>

<button class='tap-tempo' on:pointerdown={handleTapTempo}>
    <div class='bpm'>
        <strong>{$tempo}</strong>
    </div>
</button>

<style>
    button.tap-tempo {
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 3em;
        height: 5em;
        width: 6.5em;
        background-color: rgb(37, 37, 37);

        &:active {
            background-color: rgb(51, 51, 51);
        }
        
        box-shadow: 0 0 3em rgba(0, 0, 0, 0.4);
    }
    
    .bpm {
        font-size: 2em;
        font-weight: 500;
    }
</style>