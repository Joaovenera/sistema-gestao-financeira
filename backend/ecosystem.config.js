module.exports = {
  apps: [{
    name: 'financial-api',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3001
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3002
    },
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: 'logs/pm2/error.log',
    out_file: 'logs/pm2/out.log',
    log_file: 'logs/pm2/combined.log',
    time: true
  }]
}; 