export default {
  server: {
    origin: "http://localhost:5173",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    minify: 'terser',
    lib: {
      entry: 'src/simple-gallery-card-dev.js',
      formats: ['es'],
      fileName: () => 'simple-gallery-card.js',
    },
  },
};
