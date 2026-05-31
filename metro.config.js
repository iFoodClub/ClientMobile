const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Permite ao Metro resolver arquivos .wasm para o expo-sqlite no ambiente web
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

// Resolve o erro de destruturação do tslib no ambiente web/Metro (tslib.default __extends)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return context.resolveRequest(
      context,
      require.resolve("tslib/tslib.es6.js"),
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Configura cabeçalhos COEP e COOP para habilitar o SharedArrayBuffer para o expo-sqlite no navegador
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      return middleware(req, res, next);
    };
  },
};
 
module.exports = withNativeWind(config, { input: './app/global.css' });