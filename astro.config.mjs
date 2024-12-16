// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore false positive due to Astro 5 and Tailwind 4 beta
    plugins: [(tailwindcss())],
  },
  integrations: [
    react()
  ],
});
