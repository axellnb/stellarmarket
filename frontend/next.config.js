/** @type {import('next').NextConfig} */
const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@creit.tech/stellar-wallets-kit': path.resolve(__dirname, 'node_modules/@creit-tech/stellar-wallets-kit'),
    };
    return config;
  },
};
