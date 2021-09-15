const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    apps: [
        {
            name: 'BackendBill',
            script: 'dist/index.js',
        }
    ],
    deploy: {
        production: {
            user: 'ubuntu',
            host: 'ec2-3-231-208-118.compute-1.amazonaws.com',
            key: '~/.ssh/billbo-key.pem',
            ref: 'origin/main',
            repo: 'git@github.com:TahaBilalCS/BackendBill.git',
            path: '/home/ubuntu/BackendBill',
            env: {
                TWITCH_CLIENT_ID: process.env.TWITCH_CID,
                TWITCH_SECRET: process.env.TWITCH_CID,
                TEST_SECRET: process.env.TEST_SECRET
            },
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production'
        }
    }
};
