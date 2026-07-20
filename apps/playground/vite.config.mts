/// <reference types='vitest' />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

// Resolve the workspace libraries to their TypeScript source so the Angular
// plugin transforms them. Under Vitest, `nxViteTsPaths` alone lets the
// `@lumina/*` barrels resolve to empty modules (some are node_modules symlinks
// that Vitest externalizes, others are re-export barrels the transform drops),
// which surfaces as e.g. "provideLuminaTheme is not a function".
const luminaAliases = {
  '@lumina/tokens': resolve(__dirname, '../../libs/tokens/src/index.ts'),
  '@lumina/theme': resolve(__dirname, '../../libs/theme/src/index.ts'),
  '@lumina/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
};

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/playground',
  resolve: { alias: luminaAliases },
  plugins: [angular(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  test: {
    name: 'playground',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/playground',
      provider: 'v8' as const,
    },
  },
}));
