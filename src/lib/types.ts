export type Client = {
    userId: string;
    username: string;
}

export enum PlaybackEventType {
    CHORD_DOWN = 0,
    CHORD_UP = 1,
    STOP_ALL = 2,
}

export type Chord = {
    chordSymbol: string;
}; 

export type TimeSignature = {
    upper: number;
    lower: number;
}

export const isValidTimeSignature = (timeSignature: TimeSignature) => {
    return timeSignature.upper > 0 && timeSignature.lower > 0;
}

export const isEqualTimeSignature = (a: TimeSignature, b: TimeSignature) => {
    return a.upper === b.upper && a.lower === b.lower;
}

export type ChordMessage = {
    eventType: PlaybackEventType;
    chord: Chord;
}

export type ChordCollection = {
    name: string;
    key: string;
    chords: string[];
}
