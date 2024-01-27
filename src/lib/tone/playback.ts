import * as Tone from 'tone';
import { get } from 'svelte/store';
import { controlSocket, midiSocket } from '$lib/ws';
import { currentBeat, currentIndex, isLeader, isPlaying, isSustaining } from '$lib/stores';
import { playbackLoop } from '.';

export const startPlayback = () => {
    if (!get(isLeader))
        return;

    const ms = get(midiSocket);
    ms.sendStopAll(); 
    ms.sendChordDown(get(currentIndex));

    get(playbackLoop).start('1m');
    Tone.Transport.start();

    get(controlSocket).newBeat(0);
    currentBeat.set(0);
    isPlaying.set(true);
}

export const stopPlayback = () => {
    if (!get(isLeader))
        return;

    if (!get(isSustaining)) {
        get(midiSocket).sendStopAll(); 
    }

    get(playbackLoop).stop();
    Tone.Transport.stop();

    get(controlSocket).newBeat(0);
    currentBeat.set(0);
    isPlaying.set(false);
}

export const togglePlayback = () => {
    if (!get(isLeader))
        return;

    if (Tone.Transport.state === 'started') {
        stopPlayback();
    } else {
        startPlayback();
    }
}
