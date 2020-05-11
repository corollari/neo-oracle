const { CronJob } = require('cron');
const updateOracle = require('./updateOracle');

const job = new CronJob({
  cronTime: '0 0 8 * * *', // Run daily at 8am
  onTick: updateOracle,
  timeZone: 'Asia/Singapore',
});
job.start();
