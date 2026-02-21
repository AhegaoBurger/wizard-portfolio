module.exports = {
  apps: [{
    name: 'wizard-portfolio',
    script: './server/dist/index.js',
    interpreter: 'bun',
    cwd: '/root/projects/wizard-portfolio',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
};
