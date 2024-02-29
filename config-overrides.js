module.exports = function override(config, env) {
    config.module.rules.push({
       test: /\.js$/,
       enforce: "pre",
       use: ["source-map-loader"],
    });
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
   };