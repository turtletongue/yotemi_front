const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: [],
  },
  sentry: {
    hideSourceMaps: true,
  },
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  experimental: {
    appDir: true,
  },
};

const sentryWebpackPluginOptions = {
  org: "yotemi",
  project: "javascript-nextjs",
  silent: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
