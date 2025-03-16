const config = {
  development: {
    wsUrl: `ws://localhost:5001`
  },
  production: {
    wsUrl: "wss://url.com"
  }
};

const currentEnv = process.env.NODE_ENV || "development";
export default config[currentEnv];