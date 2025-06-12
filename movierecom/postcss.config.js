module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  webpack: function (config) {
    config.ignoreWarnings = [/Warning/]; // Ignore all warning types
    return config;
  },
};
