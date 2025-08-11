const { getDefaultConfig } = require('expo/metro-config');
module.exports = (projectRoot) => {
  const config = getDefaultConfig(projectRoot);
  return config;
};

