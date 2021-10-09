require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'brobot',
            script: 'dist/index.js',
            env_development: {
                NODE_ENV: 'development',
                TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.TWITCH_SECRET,
                TEST_SECRET: process.env.TEST_SECRET,
                TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
                SESSION_SECRET: process.env.SESSION_SECRET,
            },
            // pm2 stop all to reload new environment variables
            env_production: {
                // We can't access some prod variables from localhost
                TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.TWITCH_SECRET,
                TWITCH_CALLBACK_URL: process.env.TWITCH_CALLBACK_URL,
                /////////////////////////////////////////////////////
                NODE_ENV: 'production',
                TEST_SECRET: process.env.PROD_TEST_SECRET,
                SESSION_SECRET: process.env.PROD_SESSION_SECRET,
            },
            // Don't overwrite injected variables on remote machine
            env_aws: {
                NODE_ENV: 'production',
            }
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
            env: {
                TWITCH_CLIENT_ID: process.env.PROD_TWITCH_CLIENT_ID,
                TWITCH_SECRET: process.env.PROD_TWITCH_SECRET,
                TEST_SECRET: process.env.PROD_TEST_SECRET,
                TWITCH_CALLBACK_URL: process.env.PROD_TWITCH_CALLBACK_URL,
                SESSION_SECRET: process.env.PROD_SESSION_SECRET,
            },
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env aws --update-env'
        }
    }
};
