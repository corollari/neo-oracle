const CronJob = require("cron").CronJob
const updateOracle = require("./updateOracle")

new CronJob({
	cronTime: "0 0 8 * * *", // Run daily at 8am
	onTick: updateOracle,
	start: true,
	timeZone: "Asia/Singapore"
})
