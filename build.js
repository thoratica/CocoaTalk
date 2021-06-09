const { build } = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');

build({
  entryPoints: ['src/index.tsx'],
  outdir: 'dist',
  minify: true,
  bundle: true,
  sourcemap: true,
  watch: process.env.NODE_ENV === 'development',
  platform: 'node',
  target: 'node16',
  tsconfig: 'tsconfig.json',
  plugins: [sassPlugin()],
});
