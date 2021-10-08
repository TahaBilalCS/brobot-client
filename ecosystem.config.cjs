// import dotenv from 'dotenv';
//
// if (process.env.NODE_ENV !== 'production') {
//     console.log("SUP")
//     dotenv.config();
// }
require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'brobot',
            script: 'dist/index.js',
            env: {
                NODE_ENV: 'development',
                TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.TWITCH_SECRET,
                TEST_SECRET: process.env.TEST_SECRET,
                TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
                SESSION_SECRET: process.env.SESSION_SECRET
            },
            env_production: {
                NODE_ENV: 'production',
                TWITCH_CLIENT_ID: process.env.PROD_TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.PROD_TWITCH_SECRET,
                TEST_SECRET: process.env.PROD_TEST_SECRET,
                TWITCH_CALLBACK_URL: process.env.PROD_TWITCH_CALLBACK_URL,
                SESSION_SECRET: process.env.PROD_SESSION_SECRET,
                PORT: process.env.PORT,
            },
            // watch_delay: 1000,
            // ignore_watch: ['node_modules']
        }
    ],
    deploy: {
        production: {
            user: 'ubuntu',
            host: 'ec2-34-234-175-84.compute-1.amazonaws.com',
            key: '~/.ssh/billbo-key.pem',
            ref: 'origin/main',
            repo: 'git@github.com:TahaBilalCS/brobot.git',
            path: '/home/ubuntu/brobot',
            // env: {
            //     // PORT: process.env.PORT,
            //     // TWITCH_CLIENT_ID: process.env.PROD_TWITCH_CLIENT_ID,
            //     // TWITCH_SECRET: process.env.PROD_TWITCH_SECRET,
            //     // TEST_SECRET: process.env.PROD_TEST_SECRET,
            //     // TWITCH_CALLBACK_URL: process.env.PROD_TWITCH_CALLBACK_URL,
            //     // SESSION_SECRET: process.env.PROD_SESSION_SECRET,
            //     // NODE_ENV: 'production',
            //     PORT: process.env.PORT,
            //     TWITCH_CLIENT_ID: '1234',
            //     TWITCH_SECRET: '12345',
            //     TEST_SECRET: '123456',
            //     TWITCH_CALLBACK_URL: process.env.PROD_TWITCH_CALLBACK_URL,
            //     SESSION_SECRET: process.env.PROD_SESSION_SECRET,
            //     NODE_ENV: 'production',
            // },
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env production --update-env'
        }
    }
};
