import * as Tone from 'tone';
import { toneContext } from '../stores'; 

// tone initialization
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

