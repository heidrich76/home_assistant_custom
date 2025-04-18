export default {
  server: {
    origin: "http://localhost:5173",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    lib: {
      entry: 'src/ems-program-card-dev.js',
      formats: ['es'],
      fileName: () => 'ems-program-card.js',
    },
  },
};
