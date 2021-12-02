/* eslint-disable */
import WebSocket from 'ws';
import process from 'process';
import { IncomingEvents, OutgoingEvents } from './types/EventsInterface.js';
import { disableEnterKey, pokeRoar } from './commands.js';
import { voiceBan } from './commands.js';

// Connect to websocket and handle reconnecting
const clientSocketConnect = () => {
    // TODO turn into classes when activating commands, pass the incoming event & websocket into commands class
    let brobotSocket: WebSocket | undefined;
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
            console.log('Connected to Websocket', new Date().toLocaleString());
            brobotSocket?.send(OutgoingEvents.TRAMA_CONNECTED);
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

            console.log('Socket is closed. Reconnect will be attempted in 5 seconds', event.reason);
            console.log(new Date().toLocaleString());
        };

        // When socket errors out, close then reconnect
        brobotSocket.onerror = (event: WebSocket.ErrorEvent) => {
            console.log('Websocket Emitted Error', event.message);
            brobotSocket?.close();
        };
    }
};

clientSocketConnect();
