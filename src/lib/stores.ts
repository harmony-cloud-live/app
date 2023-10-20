import { derived, writable } from 'svelte/store';
import { type Chord, type Settings, InstrumentType, type Client } from './types';

// primary state
export const mainSequence = writable<Array<Chord>>([]);
export const currentIndex = writable(0);
export const settings = writable<Settings>({
    tempo: 60,
    timeSignature: [3, 4],
    musicLength: 32,
    chordCollection: 'whole album',
    instrument: InstrumentType.Piano,
});

// sockets
import { midiSocketReady, controlSocketReady } from './ws';
export { midiSocketReady, controlSocketReady }
export { midiSocket, controlSocket } from './ws';

// leader state
export const isLeader = writable(false);
export const leaderUsername = writable('');
export const myUsername = writable(localStorage.getItem('hc-username') || '');
export const clients = writable<Array<Client>>([]);

// tone.js
export const toneContext = writable<AudioContextState | null>(null);
export const instrumentLoaded = writable(false);

// init modal
export const forceStart = writable(false);
export const isReady = derived(
    [toneContext, midiSocketReady, controlSocketReady, forceStart],
    ([
        $toneContext, 
        $midiSocketReady,
        $controlSocketReady,
        $forceStart,
    ]) => {
        return ($toneContext === 'running' && $midiSocketReady && $controlSocketReady) || $forceStart;
    },
);

// playback
export const isPlaying = writable(false);
export const currentBeat = writable(0);
export const isSustaining = writable(false);

// handles loop selection logic
export const dragging = writable(false);

// looping
export const loopStart = writable<number>(-1);
export const loopEnd = writable<number>(-1);
export const looping = derived([loopStart, loopEnd],
    ([$loopStart, $loopEnd]) => {
        return $loopStart !== -1 && 
            $loopEnd !== -1 &&
            $loopStart < $loopEnd;
    },
);
