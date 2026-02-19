import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(async ({ command }) => {

  const plugins = [
    react(),
    tailwindcss()
  ]

  if (command === 'build') {
    const { default: prerender } = await import('vite-plugin-prerender')

    plugins.push(
      prerender({
        routes: ['/', '/nit-kkr-pyqs']
      })
    )
  }

  return {
    plugins,
    resolve: {
      alias: {
        'react-helmet': 'react-helmet-async'
      }
    }
  }
})
