import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['styled-jsx/babel'],
      },
    }),
  ],server: {
    historyApiFallback: true,  // 👈 ensures React Router routes work
  },
});