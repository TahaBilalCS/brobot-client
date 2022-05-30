/* eslint-disable */
import WebSocket, { ClientOptions } from 'ws';
import process from 'process';
import { IncomingEvents, OutgoingEvents } from './interfaces/EventsInterface.js';
import { disableEnterKey, pokeRoar, voiceBan } from './commands.js';
import ioHook from 'iohook';

interface IncomingPokemonEvent {
    event: IncomingEvents.POKEMON_ROAR;
    pokemonName?: string;
}

/** Tracks if we need to prevent an event from triggering */
interface TimedOutShortcuts {
    marker: boolean;
    prediction: boolean;
    ad: boolean;
}

class ClientSocketHandler {
    private pingTimeout?: NodeJS.Timeout;
    private clientSocket?: WebSocket;

    private timedOutShortcuts: TimedOutShortcuts;

    constructor(private url: string, private wsOptions: ClientOptions) {
        // Init Timeout for Keyboard Shortcuts
        this.timedOutShortcuts = {
            marker: false,
            prediction: false,
            ad: false
        };
    }

    /** Attach event listeners on socket connection */
    public connect(): void {
        try {
            this.clientSocket = new WebSocket(this.url, this.wsOptions);

            // When client socket connection opened, start disconnect timer
            this.clientSocket.on('open', (event: WebSocket.Event) => {
                console.log('Connected to Websocket', new Date().toLocaleString());
                this.heartbeat(); // Start connection loss monitoring

                // Key codes todo cpu load it seems
                // ctrl+alt+f5 - MARKER
                ioHook.registerShortcut([29, 56, 63], (keys: any) => {
                    // Avoid sending the same event repeatedly for 5 seconds
                    if (!this.timedOutShortcuts.marker) {
                        this.timedOutShortcuts.marker = true;
                        // Timeouts are cleared on completion
                        setTimeout(() => {
                            this.timedOutShortcuts.marker = false;
                        }, 3000);
                        this.clientSocket?.send(OutgoingEvents.CREATE_MARKER);
                    }
                });

                // ctrl+alt+f4 - PREDICTION
                ioHook.registerShortcut([29, 56, 62], (keys: any) => {
                    // Avoid sending the same event repeatedly for 5 seconds
                    if (!this.timedOutShortcuts.prediction) {
                        this.timedOutShortcuts.prediction = true;
                        setTimeout(() => {
                            this.timedOutShortcuts.prediction = false;
                        }, 3000);
                        this.clientSocket?.send(OutgoingEvents.CREATE_PREDICTION);
                    }
                });

                // ctrl+alt+f7 - PLAY AD
                ioHook.registerShortcut([29, 56, 65], (keys: any) => {
                    // Avoid sending the same event repeatedly for 5 seconds
                    if (!this.timedOutShortcuts.ad) {
                        this.timedOutShortcuts.ad = true;
                        setTimeout(() => {
                            this.timedOutShortcuts.ad = false;
                        }, 3000);
                        this.clientSocket?.send(OutgoingEvents.PLAY_AD);
                    }
                });

                ioHook.start();
                console.log('Registered Keyboard Listeners', new Date().toLocaleString());
            });

            // When client socket receives message, run a command
            this.clientSocket.on('message', (event: WebSocket.MessageEvent) => {
                // console.log('Received', event.data);
                switch (event.data) {
                    case IncomingEvents.CHATBAN:
                        disableEnterKey(this.clientSocket);
                        console.log('Received Chatban Event', new Date().toLocaleString());
                        break;
                    case IncomingEvents.VOICEBAN:
                        voiceBan(this.clientSocket);
                        console.log('Received Voiceban Event', new Date().toLocaleString());
                        break;
                    default:
                        // todo should stringify all events
                        // If non standard string possibly sent
                        if (typeof event.data === 'string') {
                            const parsedEvent = JSON.parse(event.data) as IncomingPokemonEvent;
                            if (parsedEvent.event === IncomingEvents.POKEMON_ROAR && parsedEvent.pokemonName) {
                                console.log('Received Pokemon Roar:', parsedEvent);
                                pokeRoar(this.clientSocket, parsedEvent.pokemonName);
                            } else {
                                console.log('Event did not contain correct data for pokemon roar', event.data);
                            }
                        } else {
                            console.log('Unknown command received from server', event.data);
                        }
                }
            });

            // pong is sent automatically on ping
            this.clientSocket.on('ping', () => {
                this.heartbeat(); // Clear and reset disconnect timer
            });

            // When client socket closes, reconnect again
            this.clientSocket.on('close', (event: WebSocket.CloseEvent) => {
                if (this.pingTimeout) clearTimeout(this.pingTimeout);

                ioHook.unregisterAllShortcuts(); // Unregister keyboard listeners

                console.log(
                    'Socket is closed. Reconnect will be attempted in 5 seconds',
                    event.reason,
                    new Date().toLocaleString()
                );

                // Reconnect socket
                setTimeout(() => {
                    this.connect();
                }, 5000);
            });

            // When socket errors out, close then reconnect
            this.clientSocket.on('error', (event: WebSocket.ErrorEvent) => {
                console.log('Websocket Emitted Error', event.message);
                this.clientSocket?.terminate();
            });
        } catch (err) {
            console.log('Error Creating Websocket', err);
        }
    }

    /**
     * Detects connection loss on a timer
     * @private
     */
    private heartbeat(): void {
        // Clear the current timeout so we don't terminate the socket if this func is called again
        if (this.pingTimeout) clearTimeout(this.pingTimeout);

        /**
         * Use `WebSocket#terminate()`, which immediately destroys the connection,
         * instead of `WebSocket#close()`, which waits for the close timer.
         * Delay should be equal to the interval at which your server
         * sends out pings plus a conservative assumption of the latency.
         */
        this.pingTimeout = setTimeout(() => {
            console.log('Socket Timed Out... terminate');
            this.clientSocket?.terminate();
        }, 5000 + 1000);
    }
}

const url = process.env.WS_URL ?? '';
const wsOptions: ClientOptions = {
    headers: { token: process.env.WS_SECRET ?? '' }
};
new ClientSocketHandler(url, wsOptions).connect();
