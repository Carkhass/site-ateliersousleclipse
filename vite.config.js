// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'everything.js'
      }
    }
  }
}
