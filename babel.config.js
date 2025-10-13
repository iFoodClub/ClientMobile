module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // ... pode haver outros plugins aqui

      // IMPORTANTE: Este deve ser o ÚLTIMO plugin da lista
      "react-native-reanimated/plugin",
    ],
  };
};
