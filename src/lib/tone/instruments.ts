import * as Tone from 'tone';
import { Instrument, InstrumentType } from '../types';
import type { Chord } from '../types';
import { Piano } from '@tonejs/piano';

const polysynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.2, release: 1 }
}).toDestination();

export const polysynthInstrument = new Instrument(InstrumentType.Polysynth, {
    chordDown: (chord: Chord, time = Tone.context.currentTime, velocity = 0.1) => {
        const notes = [...chord.midiValues].map((value) => Tone.Midi(value).toNote());
        polysynth.triggerAttack(notes, time, velocity);
    },
    chordUp: (chord: Chord, time = Tone.context.currentTime) => {
        const notes = [...chord.midiValues].map((value) => Tone.Midi(value).toNote());
        polysynth.triggerRelease(notes, time);
    },
    stopAll: () => {
        polysynth.releaseAll();
    },
    load: async () => {
        return new Promise((resolve) => resolve());
    },
});

const piano = new Piano({ velocities: 8 }).toDestination();

export const pianoInstrument = new Instrument(InstrumentType.Piano, {
    chordDown: (chord: Chord, time = Tone.context.currentTime, velocity = 0.1) => {
        for (const midiValue of chord.midiValues) {
            piano.keyDown({ 
                note: Tone.Midi(midiValue).toNote(),
                time,
                velocity,
            });
        }
    },
    chordUp: (chord: Chord, time = Tone.context.currentTime) => {
        for (const midiValue of chord.midiValues) {
            piano.keyUp({ 
                note: Tone.Midi(midiValue).toNote(),
                time,
            });
        }
    },
    stopAll: () => {
        piano.stopAll();
    },
    load: async () => {
        return piano.load();
    },
});
