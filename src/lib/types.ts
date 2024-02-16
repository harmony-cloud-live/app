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

export type MidiSocket = WebSocket & {
    sendStopAll: () => void,
    sendChordDown: (index: number) => void,
    sendChordUp: (index: number) => void,
};

export type ControlSocket = WebSocket & { 
    newIndex: (index: number) => void,
    newBeat: (beat: number) => void,
    newMainSequence: (songTitle: string) => void,
    newLeader: (id: string) => void,
    newTimeSignature: (timeSignature: TimeSignature) => void,
    newLoop: (loopStart: number, loopEnd: number) => void,
    setNoteDelay: (noteDelay: number) => void,
    setVelocity: (noteDelay: number) => void,

    getIndex: () => void, 
    getBeat: () => void,
    getMainSequence: () => void,
    getLeader: () => void,
    setUsername: (username: string) => void,
    getClients: () => void,
    getTimeSignature: () => void,
    getLoop: () => void,
    getNoteDelay: () => void,
    getVelocity: () => void,
    
    manualChordDown: (songTitle: string, chord: Chord) => void,
    manualChordUp: () => void,
    getPlaybackMode: () => void,
    setPlaybackMode: (aiMode: boolean) => void,
    getManualModeIndex: () => void,
    setManualModeIndex: (index: number) => void,
}; 

export enum ControlEventType {
    GET_INDEX = 0,
    NEW_INDEX = 1,
    GET_BEAT = 2,
    NEW_BEAT = 3,
    GET_MAIN_SEQUENCE = 4,
    NEW_MAIN_SEQUENCE = 5,
    GET_SETTINGS = 6,
    NEW_SETTINGS = 7,
    GET_LEADER = 8,
    NEW_LEADER = 9,
    SET_USERNAME = 10,
    GET_CLIENTS = 11,
    GET_TIME_SIGNATURE = 12,
    NEW_TIME_SIGNATURE = 13,
    GET_LOOP = 14,
    NEW_LOOP = 15,
    GET_NOTE_DELAY = 16,
    SET_NOTE_DELAY = 17,
    GET_VELOCITY = 18,
    SET_VELOCITY = 19,
    MANUAL_CHORD_DOWN = 20,
    MANUAL_CHORD_UP = 21,
    GET_PLAYBACK_MODE = 22,
    SET_PLAYBACK_MODE = 23,
    GET_MANUAL_MODE_INDEX = 24,
    SET_MANUAL_MODE_INDEX = 25,
}

export type ControlPayload = {
    index?: number,
    beat?: number,
    chords?: Chord[],
    timeSignature?: TimeSignature,
    leaderId?: string,
    username?: string,
    clients?: Client[],
    songTitle?: string;
    loopStart?: number;
    loopEnd?: number;
    noteDelay?: number;
    velocity?: number;
    playbackMode?: string;
}

export type ControlEvent = {
    type: ControlEventType,
    payload: ControlPayload,
}
