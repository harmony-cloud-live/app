import { get } from 'svelte/store';
import { marshalControlEvent, unmarshalControlEvent } from './encoding';
import { controlSocket, controlSocketReady, myUserId, myUsername } from '.';
import { ControlEventType, type Client, type TimeSignature, type ControlSocket, type Chord } from '$lib/types';
import {
    aiMode,
    clients,
    currentBeat,
    currentIndex,
    isLeader,
    isLoadingMainSequence,
    isPlaying,
    isSustaining,
    leaderId,
    listenOnly,
    loopEnd,
    loopStart,
    mainSequence,
    manualModeCol,
    manualModeRow,
    noteDelay,
    songTitle,
    timeSignature,
    velocity
} from '$lib/stores';

export const initControlSocket = (baseUrl: string) => {
    console.log('initializing control socket...', baseUrl);
    const userId = get(myUserId);
    const username = get(myUsername);
    const url = `${baseUrl}?userId=${userId}`;
    console.log('control socket url', url);
    
    let ws: WebSocket;
    try {
        ws = new WebSocket(url);
    } catch (e) {
        console.log('error creating control socket', e);
        return;
    }
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        if (ws.readyState === WebSocket.OPEN) {
            controlSocketReady.set(true);
            console.log('control socket ready', ws);

            const cs = get(controlSocket);
            if (username) cs.setUsername(username);
            cs.getLeader();
            cs.getClients();
            cs.getMainSequence();
            cs.getIndex();
            cs.getBeat();
            cs.getTimeSignature();
            cs.getNoteDelay();
            cs.getVelocity();
            cs.getPlaybackMode();
            cs.getManualModeChord();
        }
    }

    ws.onclose = () => {
        if (ws.readyState === WebSocket.CLOSED) {
            controlSocketReady.set(false);
        }
        setTimeout(() => {
            console.log('reconnecting control socket...');
            controlSocket.set(<ControlSocket>initControlSocket(baseUrl));
        }, 1000);
    }
    
    ws.onerror = (event) => {
        console.log('control socket error', event);
    }

    ws.onmessage = (event) => {
        const data = unmarshalControlEvent(event.data);
        if (!data) return;

        switch (data.type) {
            case ControlEventType.NEW_INDEX:
                if (data.payload.index !== undefined)
                    currentIndex.set(data.payload.index);
                break;
            case ControlEventType.NEW_MAIN_SEQUENCE:
                console.log('new main sequence', data.payload.songTitle);
                if (Array.isArray(data.payload.chords) && data.payload.chords.length > 0) {
                    mainSequence.set(data.payload.chords.map(c => c.chordSymbol));
                    isLoadingMainSequence.set(false);
                }
                if (data.payload.songTitle !== undefined)
                    songTitle.set(data.payload.songTitle);
                break;
            case ControlEventType.NEW_BEAT:
                if (data.payload.beat !== undefined)
                    currentBeat.set(data.payload.beat);
                break;
            case ControlEventType.NEW_TIME_SIGNATURE:
                if (data.payload.timeSignature !== undefined)
                    timeSignature.set(data.payload.timeSignature as TimeSignature);
                break;
            case ControlEventType.NEW_LEADER:
            case ControlEventType.GET_LEADER:
                if (data.payload.leaderId !== undefined) {
                    if (data.payload.leaderId === userId) {
                        isLeader.set(true);
                        leaderId.set(data.payload.leaderId);
                    } else {
                        isLeader.set(false);
                        leaderId.set(data.payload.leaderId);
                        isPlaying.set(false);
                        isSustaining.set(true);
                    }
                }
                break;
            case ControlEventType.GET_CLIENTS:
                if (Array.isArray(data.payload.clients)) {
                    const sortedClients = (data.payload.clients as Client[]).sort((a, b) => a.username.localeCompare(b.username));
                    clients.set(sortedClients);
                } else {
                    clients.set([]);
                }
                break;
            case ControlEventType.NEW_LOOP:
                if (data.payload.loopStart !== undefined && data.payload.loopEnd !== undefined) {
                    loopStart.set(data.payload.loopStart);
                    loopEnd.set(data.payload.loopEnd);
                }
                break;
            case ControlEventType.GET_NOTE_DELAY:
                if (data.payload.noteDelay !== undefined)
                    noteDelay.set(data.payload.noteDelay);
                break;
            case ControlEventType.GET_VELOCITY:
                if (data.payload.velocity !== undefined)
                    velocity.set(data.payload.velocity);
                break;
            case ControlEventType.GET_PLAYBACK_MODE:
                if (data.payload.playbackMode !== undefined) {
                    if (data.payload.playbackMode === 'ai') {
                        aiMode.set(true);
                    } else if (data.payload.playbackMode === 'manual') {
                        aiMode.set(false);
                    }
                }
                break;
            case ControlEventType.GET_MANUAL_MODE_CHORD:
                if (data.payload.row !== undefined && data.payload.col !== undefined) {
                    manualModeRow.set(data.payload.row);
                    manualModeCol.set(data.payload.col);
                }
                break;
            default:
                console.log('unknown control event type', data.type)
                break;
        }
    }

    const getClients = () => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.GET_CLIENTS, {}));
    }

    
    const setUsername = (username: string) => {
        if (get(listenOnly)) {
            if (ws.readyState === WebSocket.OPEN)
                ws.send(marshalControlEvent(ControlEventType.SET_USERNAME, {username: "$listener$"}));
        } else if (username) {
            myUsername.set(username);
            localStorage.setItem("hc-username", username);

            if (ws.readyState === WebSocket.OPEN)
                ws.send(marshalControlEvent(ControlEventType.SET_USERNAME, {username}));
        }
    }

    const newIndex = (index: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_INDEX, {index}));
    }

    const getIndex = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_INDEX, {}));
        }
    }

    const newBeat = (beat: number) => {
        if (ws.readyState === WebSocket.OPEN)
            ws.send(marshalControlEvent(ControlEventType.NEW_BEAT, {beat}));
    }

    const getBeat = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_BEAT, {}));
        }
    }
    
    const newTimeSignature = (timeSignature: TimeSignature) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader))
            ws.send(marshalControlEvent(ControlEventType.NEW_TIME_SIGNATURE, {timeSignature}));
    }

    const getTimeSignature = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_TIME_SIGNATURE, {}));
        }
    }

    const newMainSequence = (songTitle: string) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.NEW_MAIN_SEQUENCE, {songTitle}));
            isLoadingMainSequence.set(true);
        }
    }

    const getMainSequence = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_MAIN_SEQUENCE, {}));
        }
    }

    const getLeader = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_LEADER, {}));
        }
    }

    const newLeader = (leaderId: string) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.NEW_LEADER, {leaderId}));
        }
    }
    
    const getLoop = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_LOOP, {}));
        }
    }

    const newLoop = (loopStart: number, loopEnd: number) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.NEW_LOOP, {loopStart, loopEnd}));
        }
    }
    
    const getNoteDelay = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_NOTE_DELAY, {}));
        }
    }
    
    const setNoteDelay = (noteDelay: number) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.SET_NOTE_DELAY, {noteDelay}));
        }
    }
    
    const getVelocity = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_VELOCITY, {}));
        }
    }

    const setVelocity = (velocity: number) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.SET_VELOCITY, {velocity}));
        }
    }
    
    const manualChordDown = (songTitle: string, chord: Chord) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.MANUAL_CHORD_DOWN, {songTitle, chords: [chord]}));
        }
    }
    
    const manualChordUp = () => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.MANUAL_CHORD_UP, {}));
        }
    }
    
    const setPlaybackMode = (aiMode: boolean) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            const playbackMode = aiMode ? 'ai' : 'manual';
            ws.send(marshalControlEvent(ControlEventType.SET_PLAYBACK_MODE, {playbackMode}));
        }
    }
    
    const getPlaybackMode = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_PLAYBACK_MODE, {}));
        }
    }
    
    const setManualModeChord = (row: number, col: number) => {
        if (ws.readyState === WebSocket.OPEN && get(isLeader)) {
            ws.send(marshalControlEvent(ControlEventType.SET_MANUAL_MODE_CHORD, {row, col}));
        }
    }
    
    const getManualModeChord = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(marshalControlEvent(ControlEventType.GET_MANUAL_MODE_CHORD, {}));
        }
    }

    return { 
        ...ws,
        getIndex,
        newIndex,
        getBeat,
        newBeat,
        getMainSequence,
        newMainSequence,
        getLeader,
        newLeader,
        setUsername,
        getClients,
        getTimeSignature,
        newTimeSignature,
        getLoop,
        newLoop,
        getNoteDelay,
        setNoteDelay,
        getVelocity,
        setVelocity,
        manualChordDown,
        manualChordUp,
        getPlaybackMode,
        setPlaybackMode,
        getManualModeChord,
        setManualModeChord,
    };
}

