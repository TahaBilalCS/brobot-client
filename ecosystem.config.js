module.exports = {
  apps: [{
    name: 'BackendBill',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'http://ec2-3-231-208-118.compute-1.amazonaws.com/',
      key: '~/.ssh/billbo-key.pem',
      ref: 'origin/main',
      repo: 'git@github.com:TahaBilalCS/BackendBill.git',
      path: '/home/ubuntu/BackendBill',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}
