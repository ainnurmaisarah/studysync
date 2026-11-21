const app = require('./server/app');
const env = require('./server/config/env');

app.listen(env.port, () => {
  console.log(`StudySync running at http://localhost:${env.port}`);
});