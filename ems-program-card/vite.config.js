export default {
  server: {
    origin: "http://localhost:5173",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    minify: 'terser',
    target: 'esnext',
    lib: {
      entry: 'src/ems-program-card-dev.ts',
      formats: ['es'],
      fileName: () => 'ems-program-card.js',
    },
  },
};
