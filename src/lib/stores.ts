import { derived, writable } from 'svelte/store';
import { type TimeSignature, type Client, type ChordCollection } from './types';

// primary state
export const mainSequence = writable<Array<string>>([]);
export const songTitle = writable('');
export const isLoadingMainSequence = writable(false);
export const aiMode = writable(true);
export const chordCollection = writable<ChordCollection>();
export const manualModeRow = writable(-1);
export const manualModeCol = writable(-1);
export const manualProgression = writable<Array<Array<string>>>()

// sockets
import { midiSocketReady, controlSocketReady } from './ws';
export { midiSocketReady, controlSocketReady }
export { midiSocket, controlSocket } from './ws';

// leader state
export const isLeader = writable(false);
export const leaderId = writable('');
export const clients = writable<Array<Client>>([]);
export const listenOnly = writable(false);

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
export const isSustaining = writable(true);
export const noteDelay = writable(0);
export const velocity = writable(64);
export const currentIndex = writable(0);
export const previousIndex = writable(0);
export const tempo = writable(60);
export const timeSignature = writable<TimeSignature>({ upper: 4, lower: 4 });

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
