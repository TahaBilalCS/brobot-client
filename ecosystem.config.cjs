const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    apps: [
        {
            name: 'BackendBill',
            script: 'dist/index.js',
            // env: {
            //     NODE_ENV: 'development'
            // },
            // env_production: {
            //     NODE_ENV: 'production'
            // }
            // emv_test:{
            //     NODE_ENV: "test"
            // }
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
            // Setup better prod/dev environments
            env: {
                TWITCH_CLIENT_ID: process.env.TWITCH_CID,
                TWITCH_SECRET: process.env.TWITCH_SECRET,
                TEST_SECRET: process.env.TEST_SECRET,
                TWITCH_CID_PROD: process.env.TWITCH_CID_PROD,
                TWITCH_SECRET_PROD: process.env.TWITCH_SECRET_PROD
            },
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production'
        }
    }
};
