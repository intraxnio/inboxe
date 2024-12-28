const campaignQueue = require('./campaignQueue');

(async () => {
  console.log('Worker is starting...');

  campaignQueue.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
  });

  campaignQueue.on('failed', (job, err) => {
    console.error(`Job failed: ${job.id}, Error: ${err}`);
  });

  console.log('Worker is waiting for jobs...');
})();
