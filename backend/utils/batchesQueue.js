const Bull = require('bull');
const Batch = require('../models/Batches');
const QueueBatch = require('../models/QueueBatch');
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

  const lambda = new LambdaClient({
    region: "us-east-1",
  
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });



// Create a new Bull queue
const batchCheckQueue = new Bull('batchCheckQueue', {
  redis: {
    host: '127.0.0.1',
    port: 6379, 
  },
});

   

// Define the job processor
batchCheckQueue.process(async () => {
  const now = new Date();
  const batches = await Batch.find({ batch_will_starts_at: { $lte: now } });

  if (batches.length > 0) {

    const batchPromises = batches.map(async (batch) => {

        try {
    
            const queueBatch = {
             
              original_batch_id: batch._id,
              user_id : batch.user_id,
              campaign_id : batch.campaign_id,
              pendingContacts : batch.contacts,
              sentContacts: [],
        
            };

            const campaign_id = batch.campaign_id;
            const user_id = batch.user_id;
            const payload = { campaign_id, user_id };

            await QueueBatch.create(queueBatch);
            await Batch.findByIdAndDelete(batch._id);
        
            const command = new InvokeCommand({
              FunctionName: 'sendEmailsFunction', // The name of the Lambda function to invoke
              Payload: JSON.stringify(payload), // Convert payload to a JSON string
            });
        
            const response = await lambda.send(command);
        
            // Parse the response payload
            const responsePayload = JSON.parse(new TextDecoder().decode(response.Payload));
            console.log("Lambda function response:", responsePayload);
            return responsePayload;
          } catch (error) {
            console.error("Error invoking Lambda function:", error);
            throw error;
          }



    })

  } else {
    console.log('No batches found to start.');
  }
});

module.exports = batchCheckQueue;

// Function to add a job to the queue that runs every 10 seconds


// // Event handlers for logging
// batchCheckQueue.on('completed', (job) => {
//   console.log(`Batch check job with ID ${job.id} completed`);
// });

// batchCheckQueue.on('failed', (job, err) => {
//   console.error(`Batch check job with ID ${job.id} failed with error: ${err.message}`);
// });

// // Handle MongoDB connection errors
// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB connection error:', err.message);
// });
