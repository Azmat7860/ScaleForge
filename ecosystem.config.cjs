module.exports = {
  apps: [
    {
      name: "scaleforge-api",
      script: "apps/api/dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
