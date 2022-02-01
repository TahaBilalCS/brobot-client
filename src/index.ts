/* eslint-disable */
import WebSocket from 'ws';
import process from 'process';
import { IncomingEvents, OutgoingEvents } from './interfaces/EventsInterface.js';
import { disableEnterKey, pokeRoar } from './commands.js';
import { voiceBan } from './commands.js';
import ioHook from 'iohook';

// Connect to websocket and handle reconnecting
const clientSocketConnect = () => {
    // TODO turn into classes when activating commands, pass the incoming event & websocket into commands class
    let brobotSocket: WebSocket | undefined;
    const timedOutShortcuts = {
        marker: false,
        prediction: false,
        ad: false
    };
    try {
        brobotSocket = new WebSocket(process.env.WS_URL || '');
    } catch (err) {
        console.log('Error Creating Websocket', err);
    }

    // Websocket created
    if (brobotSocket) {
        setInterval(() => {
            console.log('SENDING PING', new Date().toLocaleString());
            brobotSocket?.send(OutgoingEvents.PING);
        }, 1000 * 60 * 15);

        // When websocket opened, notify server
        brobotSocket.onopen = (event: WebSocket.Event) => {
            brobotSocket?.send(OutgoingEvents.TRAMA_CONNECTED);
            console.log('Connected to Websocket', new Date().toLocaleString());

            // Key codes todo cpu load it seems
            // ctrl+alt+f5 - MARKER
            ioHook.registerShortcut([29, 56, 63], (keys: any) => {
                // Avoid sending the same event repeatedly for 5 seconds
                if (!timedOutShortcuts.marker) {
                    timedOutShortcuts.marker = true;
                    setTimeout(() => {
                        timedOutShortcuts.marker = false;
                    }, 3000);
                    brobotSocket?.send(OutgoingEvents.CREATE_MARKER);
                }
            });
            // ctrl+alt+f6 - PREDICTION
            ioHook.registerShortcut([29, 56, 64], (keys: any) => {
                // Avoid sending the same event repeatedly for 5 seconds
                if (!timedOutShortcuts.prediction) {
                    timedOutShortcuts.prediction = true;
                    setTimeout(() => {
                        timedOutShortcuts.prediction = false;
                    }, 3000);
                    brobotSocket?.send(OutgoingEvents.CREATE_PREDICTION);
                }
            });
            // ctrl+alt+f7 - PLAY AD
            ioHook.registerShortcut([29, 56, 65], (keys: any) => {
                // Avoid sending the same event repeatedly for 5 seconds
                if (!timedOutShortcuts.ad) {
                    timedOutShortcuts.ad = true;
                    setTimeout(() => {
                        timedOutShortcuts.ad = false;
                    }, 3000);
                    brobotSocket?.send(OutgoingEvents.PLAY_AD);
                }
            });

            ioHook.start();
            console.log('Registered Keyboard Listeners', new Date().toLocaleString());
        };

        // When socket receives message, run a command
        brobotSocket.onmessage = (event: WebSocket.MessageEvent) => {
            // console.log('Received', event.data);
            switch (event.data) {
                case IncomingEvents.CHATBAN:
                    disableEnterKey(brobotSocket);
                    console.log('Received Chatban Event', new Date().toLocaleString());
                    break;
                case IncomingEvents.VOICEBAN:
                    voiceBan(brobotSocket);
                    console.log('Received Voiceban Event', new Date().toLocaleString());
                    break;
                case IncomingEvents.PONG:
                    console.log('RECEIVED PONG', new Date().toLocaleString());
                    break;
                default:
                    // todo should stringify all events
                    // If non standard string possibly sent
                    if (typeof event.data === 'string') {
                        const parsedEvent = JSON.parse(event.data);
                        if (parsedEvent.event && parsedEvent.pokemonName) {
                            console.log('Received', parsedEvent);
                            pokeRoar(brobotSocket, parsedEvent.pokemonName);
                        } else {
                            console.log('Event did not contain correct data for pokemon roar', event.data);
                        }
                    } else {
                        console.log('Unknown command received from server', event.data);
                    }
            }
        };

        // When client socket closes, reconnect again
        brobotSocket.onclose = (event: WebSocket.CloseEvent) => {
            setTimeout(() => {
                clientSocketConnect();
            }, 5000);

            ioHook.unregisterAllShortcuts(); // Unregister keyboard listeners
            console.log(
                'Socket is closed. Reconnect will be attempted in 5 seconds',
                event.reason,
                new Date().toLocaleString()
            );
        };

        // When socket errors out, close then reconnect
        brobotSocket.onerror = (event: WebSocket.ErrorEvent) => {
            console.log('Websocket Emitted Error', event.message);
            brobotSocket?.close();
        };
    }
};

clientSocketConnect();
