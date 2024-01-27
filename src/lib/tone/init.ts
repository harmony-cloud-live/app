import * as Tone from 'tone';
import { currentIndex, loopEnd, loopStart, mainSequence, toneContext } from '../stores'; 
import { get } from 'svelte/store';

export const initTone = async () => {
    console.log('starting tone.js audio context...')
    Tone.context.lookAhead = 0.001;
    Tone.Draw.anticipation = 0;

    try {
        await Tone.start();
        toneContext.set(Tone.context.state);
        console.log("audio context running", Tone);
    } catch (e) {
        console.error('tone failed to start', e);
    }
}

export const initPlaybackLoop = () => new Tone.Loop(() => {
    const idx = get(currentIndex);
    const start = get(loopStart);
    const end = get(loopEnd);
    
    let nextIndex = idx < get(mainSequence).length - 1 ? idx + 1 : 0;

    if (start !== -1 && end !== -1) {
        if (nextIndex > end) {
            nextIndex = start;
        }
    }

    currentIndex.set(nextIndex);
}, '1n');