import * as Tone from 'tone';
import type { Instrument } from '../types';
import { pianoInstrument } from './instruments';

import { writable } from 'svelte/store';
import { toneContext, instrumentLoaded } from '../stores'; 

// instrument initialization
export const instrument = writable<Instrument>(pianoInstrument);

instrument.subscribe(async (newInstrument) => {
    try {
        await newInstrument.load();
        instrumentLoaded.set(true);
        console.log('instrument loaded', newInstrument);
    } catch (e) {
        instrumentLoaded.set(false);
        console.error('instrument failed to load', e, newInstrument);
    }
});

// tone initialization
export const initTone = async () => {
    console.log('starting tone.js audio context...')
    Tone.context.lookAhead = 0.001;
    Tone.Draw.anticipation = 0;
    // instrument.set(pianoInstrument);

    try {
        await Tone.start();
        toneContext.set(Tone.context.state);
        console.log("audio context running", Tone);
    } catch (e) {
        console.error('tone failed to start', e);
    }
}

