/* eslint-disable */
import process from 'process';
import { PythonShell, PythonShellError } from 'python-shell';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import WebSocket from 'ws';
import { OutgoingEvents } from './types/EventsInterface.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scriptPath = path.join(__dirname, '../src/py_commands/');

// TODO this could be a class we initialize with brobotSocket so we don't have to pass it in to every function
export const disableEnterKey = (brobotSocket: WebSocket | undefined): void => {
    const options = {
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: scriptPath,
        args: ['300'] /** How long to disable Enter key? (seconds) */
    };
    PythonShell.run('chatban.py', options, (err?: PythonShellError, output?: any[]) => {
        if (err) brobotSocket?.send('broke');
        brobotSocket?.send(OutgoingEvents.CHATBAN_COMPLETE);
    });
};

export const voiceBan = (brobotSocket: WebSocket | undefined): void => {
    const options = {
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: scriptPath,
        args: ['30'] /** How long to keep mic muted? (seconds) */
    };
    PythonShell.run('voiceban.py', options, (err?: PythonShellError, output?: any[]) => {
        if (err) {
            console.log('err', err);
            brobotSocket?.send('broke');
        }
        brobotSocket?.send(OutgoingEvents.VOICEBAN_COMPLETE);
    });
};

export const pokeRoar = (brobotSocket: WebSocket | undefined, pokemonName: string): void => {
    // Outliers that need to be fixed in order to play sound properly
    if (pokemonName === 'Mr. Mime') {
        pokemonName = 'MrMime';
    } else if (pokemonName.toLowerCase().includes('farfetch')) {
        pokemonName = 'farfetchd';
    }
    const options = {
        pythonPath: process.env.PYTHON_PATH,
        scriptPath: scriptPath,
        args: [`${scriptPath}\\poke_sounds\\${pokemonName}.mp3`] /** Pokemon Name */
    };
    PythonShell.run('pokeRoar.py', options, (err?: PythonShellError, output?: any[]) => {
        if (err) {
            console.log('err', err);
            brobotSocket?.send('broke');
        }
    });
};
