const commonEnv = require('./config/commonEnv.cjs')

module.exports = {
    apps: [
        {
            name: 'brobot',
            script: 'dist/index.js',
            env_development: {
                ...commonEnv.dev,
            },
            env_production: {
                ...commonEnv.prod
            },
            env_test:{

            },
            watch_delay: 1000,
            ignore_watch: ['node_modules']
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
                ...commonEnv.prod
            },
            'post-deploy': 'npm install && npm run build && pm2 startOrRestart ecosystem.config.cjs --env test --update-env'
        }
    }
};
