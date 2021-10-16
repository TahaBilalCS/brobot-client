/* eslint-disable */
import WebSocket from 'ws';
import process from 'process';
import { PythonShell } from 'python-shell';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scriptPath = path.join(__dirname, '../src/py_commands/');
console.log(scriptPath)

function startPythonShell() {
    // TODO
    let options = {
        pythonPath: 'C:\\Users\\Bilal\\AppData\\Local\\Programs\\Python\\Python39\\python',
        scriptPath: scriptPath
    };
    PythonShell.run('disable_key.py', options, (err: any, results: any) => {
        if (err) {
            console.log('Err', err);
        } else {
            console.log('Success', results);
        }
    });
}

startPythonShell();

// console.log(process.env.WS_URL);
//
// const brobotSocket = new WebSocket(process.env.WS_URL || '');
//
// // Connection opened
// brobotSocket.addEventListener('open', event => {
//     brobotSocket.send('Hello Server!');
// });

/**
 * if receive chatban-ws,
 */
