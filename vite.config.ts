import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    // Keep pinned upstream Skills unchanged; first-party files remain checked.
    ignorePatterns: ['.agents/skills/**'],
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
