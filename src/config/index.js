const {
  DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME,
} = process.env;

module.exports = {
  mongoUri: `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  SECRET: 'ldeVaDcqH33N6WcQ',
};
