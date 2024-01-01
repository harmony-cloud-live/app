import type { TimeSignature } from "tone/build/esm/core/type/Units";

export type Client = {
    userId: string;
    username: string;
}

export enum PlaybackEventType {
    CHORD_DOWN = 0,
    CHORD_UP = 1,
    STOP_ALL = 2,
}

export type Chord = string; 

export type ChordMessage = {
    eventType: PlaybackEventType;
    chord: Chord;
}

export type Settings = {
    tempo: number;
    timeSignature: TimeSignature;
    musicLength: number;
    chordCollection: string;
    instrument: InstrumentType;
}

export enum InstrumentType {
    Polysynth = 'polysynth',
    Piano = 'piano',
}

interface InstrumentActions {
    // noteDown?: (note: string, time: number, velocity: number) => void;
    // noteUp?: (note: string, time: number ) => void;
    chordUp: (chord: Chord) => void;
    chordDown: (chord: Chord) => void;
    stopAll: () => void;
    load: () => Promise<void>;
}

export class Instrument {
    type: InstrumentType;
    // noteDown?: (note: string, time: number, velocity: number) => void;
    // noteUp?: (note: string, time: number ) => void;
    chordUp: (chord: Chord) => void;
    chordDown: (chord: Chord) => void;
    stopAll: () => void;
    load: () => Promise<void>;

    constructor(type: InstrumentType, actions: InstrumentActions) {
        this.type = type;
        // this.noteDown = actions.noteDown;
        // this.noteUp = actions.noteUp;
        this.chordUp = actions.chordUp;
        this.chordDown = actions.chordDown;
        this.stopAll = actions.stopAll;
        this.load = actions.load;
    }
}
