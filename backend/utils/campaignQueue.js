const Queue = require('bull');
const mongoose = require('mongoose');
const ContactModel = require('../models/Contacts'); // Contact schema
const BatchModel = require('../models/Batches');    // Batch schema

// Initialize Redis-backed Bull queue
const campaignQueue = new Queue('campaignQueue', {
  redis: {
    host: '127.0.0.1', // Replace with your Redis host
    port: 6379         // Replace with your Redis port
  }
});

// Helper function to generate a random time delay between 1 and 30 minutes
const getRandomDelay = (min = 1, max = 3) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Process job function
campaignQueue.process(5, async (job, done) => {
  try {
    const { userId, campaignId, tags } = job.data;
    let processedContacts = new Set();
    const batchSize = 1;
    let lastId = null; // Initialize lastId for pagination

    let currentTime = Date.now();
    let batchIndex = 0; // To track the batch creation
    const usedTimestamps = new Set();  // To store previously used batch start times (timestamps)

    while (true) {
      // Efficient pagination using lastId
      const query = lastId
        ? { user_id: userId, tags: { $in: tags }, _id: { $gt: lastId } }
        : { user_id: userId, tags: { $in: tags } };

      const contacts = await ContactModel.find(query).limit(batchSize);

      // Break if no more contacts are found
      if (contacts.length === 0) {
        break;
      }

      let batch = [];

      // Avoid redundancy using the Set
      for (const contact of contacts) {
        if (!processedContacts.has(contact._id.toString())) {
          batch.push(contact._id);
          processedContacts.add(contact._id.toString());
        }
      }

      // Assign random unique delay for batch start time between 1 to 30 minutes
      let randomDelay;
      let batchWillStartAt;

      do {
        randomDelay = getRandomDelay(); // Generate random delay
        batchWillStartAt = new Date(currentTime + randomDelay * 60 * 1000); // Convert minutes to milliseconds
      } while (usedTimestamps.has(batchWillStartAt.getTime())); // Ensure uniqueness by checking timestamp

      // Store the new timestamp to avoid future conflicts
      usedTimestamps.add(batchWillStartAt.getTime());

      // Save batch to the Batches collection with the random start time
      if (batch.length > 0) {
        await BatchModel.create({
          user_id: userId,
          campaign_id: campaignId,
          tag: tags.join(', '),
          contacts: batch,
          batch_will_starts_at: batchWillStartAt,
        });

        console.log(`Batch ${batchIndex + 1} created with start time: ${batchWillStartAt}`);
      }

      // Update lastId to the ID of the last contact in the current batch
      lastId = contacts[contacts.length - 1]._id;
      batchIndex++;
    }

    console.log(`Campaign job completed for campaign ID: ${campaignId}`);
    done();
  } catch (error) {
    console.error('Error processing campaign job:', error);
    done(error); // Mark the job as failed
  }
});

module.exports = campaignQueue;


// const Queue = require('bull');
// const mongoose = require('mongoose');
// const ContactModel = require('../models/Contacts'); // Contact schema
// const BatchModel = require('../models/Batches');     // Batch schema

// // Initialize Redis-backed Bull queue
// const campaignQueue = new Queue('campaignQueue', {
//   redis: {
//     host: '127.0.0.1', // Replace with your Redis host
//     port: 6379        // Replace with your Redis port
//   }
// });

// // Process job function
// campaignQueue.process(async (job, done) => {
//   try {
//     const { userId, campaignId, tags } = job.data;
//     let processedContacts = new Set();
//     const batchSize = 2;
//     let skip = 0;

//     while (true) {
//       // Fetch contacts in batches
//       const contacts = await ContactModel.find({
//         user_id: userId,
//         tags: { $in: tags }
//       })
//         .skip(skip)
//         .limit(batchSize);

//       // Break if no more contacts are found
//       if (contacts.length === 0) {
//         break;
//       }

//       let batch = [];

//       // Avoid redundancy using the Set
//       for (const contact of contacts) {
//         if (!processedContacts.has(contact._id.toString())) {
//           batch.push(contact._id);
//           processedContacts.add(contact._id.toString());
//         }
//       }

//       // Save batch to the Batches collection
//       if (batch.length > 0) {
//         await BatchModel.create({
//           user_id: userId,
//           campaign_id: campaignId,
//           tag: tags.join(', '),
//           contacts: batch
//         });
//       }

//       // Increment to fetch the next batch
//       skip += batchSize;
//     }

//     console.log(`Campaign job completed for campaign ID: ${campaignId}`);
//     done();
//   } catch (error) {
//     console.error('Error processing campaign job:', error);
//     done(error); // Mark the job as failed
//   }
// });

// module.exports = campaignQueue;
