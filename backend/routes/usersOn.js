const express = require("express");
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserOnPlatform = require("../models/User");
const TempUserOnPlatform = require("../models/TempUser");
const mongoose = require('mongoose');
const UnverifiedSubdomain = require("../models/UnverifiedSubDomains");
const Tags = require("../models/TagsContacts");
const USER = require("../models/User");
const QueueBatch = require('../models/QueueBatch');
const BatchModel = require('../models/Batches');
const Contacts = require("../models/Contacts");
const CampaignModel = require("../models/Campaigns");
const campaignQueue = require("../utils/campaignQueue");
const batchCheckQueue = require("../utils/batchesQueue");
const TrackingCodes = require("../models/TrackingCodes");
router.use(cookieParser());
const sendMail = require("../utils/sendMail");
const { createToken } = require("../middleware/jwtToken");
const { SESClient, VerifyDomainIdentityCommand, VerifyDomainDkimCommand, GetIdentityVerificationAttributesCommand, GetIdentityDkimAttributesCommand, SendEmailCommand, SetIdentityMailFromDomainCommand  } = require("@aws-sdk/client-ses");
const multer = require('multer');
const { S3Client } = require("@aws-sdk/client-s3");
const csvParser = require("csv-parser");
const fs = require("fs");
const dns = require('dns').promises;
const disposableEmailDomains = require('disposable-email-domains-js');
const validator = require('validator');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyDRwSyy9biaPcFObW_7Gj9b3qClCaQVPZw");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const lambda = new LambdaClient({
  region: "us-east-1",

  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-south-1',
});

const storage = multer.memoryStorage();

const fileUpload = multer({ dest: "uploads/" });
const upload = multer({
  storage: storage,
});


// Create SES client
const sesClient = new SESClient({
  region: "us-east-1",
   credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


async function setupCustomMailFrom(subdomain) {

  try {

    const customMailFromDomain = 'bounces.'+subdomain;
    // Step 1: Set the MAIL FROM domain
    const mailFromCommand = new SetIdentityMailFromDomainCommand({
      Identity: subdomain,
      MailFromDomain: customMailFromDomain,
      BehaviorOnMXFailure: "UseDefaultValue",
    });

    const mailFromResponse = await sesClient.send(mailFromCommand);
    // Step 2: Generate DNS records for MAIL FROM domain
    const mxRecordName = `${customMailFromDomain}`;
    const mxRecordValue = "10 feedback-smtp.us-east-1.amazonses.com";

    const txtRecordName = `${customMailFromDomain}`;
    const txtRecordValue = "v=spf1 include:amazonses.com -all";

 

    return {
      mailFromDomain: customMailFromDomain,
      mxRecordName,
      mxRecordValue,
      txtRecordName,
      txtRecordValue,
    };
  } catch (error) {
    console.error("Error configuring custom MAIL FROM domain:", error);
    throw error;
  }
}

async function generateDNSRecords(subdomain) {

  // const domain = subdomain.split('.').slice(-2).join('.');
  let txtName = '';
  let txtValue = '';
  let spfTxtName = '';
  let spfTxtValue = '';
  let Cname1Name = '';
  let Cname1Value = '';
  let Cname2Name = '';
  let Cname2Value = '';
  let Cname3Name = '';
  let Cname3Value = '';

  try {
    // Step 1: Initiate domain verification
    const domainVerification = await sesClient.send(
      new VerifyDomainIdentityCommand({ Domain: subdomain })
    );

    // Assign TXT record values for domain verification
    txtName = `_amazonses.${subdomain}`;
    txtValue = domainVerification.VerificationToken;

    // Step 2: Generate DKIM records
    const dkimVerification = await sesClient.send(
      new VerifyDomainDkimCommand({ Domain: subdomain })
    );

    // Dynamically assign CNAME record values based on tokens
    dkimVerification.DkimTokens.forEach((token, index) => {
      if (index === 0) {
        Cname1Name = `${token}._domainkey.${subdomain}`;
        Cname1Value = `${token}.dkim.amazonses.com`;
      } else if (index === 1) {
        Cname2Name = `${token}._domainkey.${subdomain}`;
        Cname2Value = `${token}.dkim.amazonses.com`;
      } else if (index === 2) {
        Cname3Name = `${token}._domainkey.${subdomain}`;
        Cname3Value = `${token}.dkim.amazonses.com`;
      }
    });

    // Step 3: Generate SPF TXT record for the domain
    spfTxtName = `${subdomain}`; // Root domain for SPF record
    spfTxtValue = `v=spf1 include:amazonses.com -all`;

    // Return the formatted result as an object
    return {
      txtName: txtName,
      txtValue: txtValue,
      spfTxtName: spfTxtName,
      spfTxtValue: spfTxtValue,
      Cname1Name: Cname1Name,
      Cname1Value: Cname1Value,
      Cname2Name: Cname2Name,
      Cname2Value: Cname2Value,
      Cname3Name: Cname3Name,
      Cname3Value: Cname3Value,
    };
  } catch (error) {
    console.error("Error generating DNS records:", error);
    throw error; // Propagate the error
  }
}

async function generateDMARCRecords(subdomain, reportingEmail) {

  try {
    // DMARC TXT record name and value
    const dmarcName = `_dmarc.${subdomain}`;

    // DMARC policy: Modify as needed for your requirements
    const dmarcValue = `v=DMARC1; p=quarantine; rua=mailto:${reportingEmail}; ruf=mailto:${reportingEmail}; pct=100; sp=none; aspf=r;`;

    // Return the DMARC record
    return {
      dmarcName: dmarcName,
      dmarcValue: dmarcValue,
    };
  } catch (error) {
    console.error("Error generating DMARC record:", error);
    throw error;
  }
}




// Step-2: Check whether client saved and verified the records 

async function checkTxtRecordStatus(subdomain) {

  let txtRecordStatus = '';
  try {
    const command = new GetIdentityVerificationAttributesCommand({
      Identities: [subdomain],
    });

    const response = await sesClient.send(command);

    if (response.VerificationAttributes[subdomain]) {
      const status = response.VerificationAttributes[subdomain].VerificationStatus;
      console.log(`Verification status for ${subdomain}: ${status}`);
      if (status === "Success") {
        console.log(`subdomain ${subdomain} is successfully verified!`);
        txtRecordStatus = 'verified';
      } else {
        console.log(`subdomain ${subdomain} is not yet verified. Wait for DNS propagation.`);
        txtRecordStatus = 'pending';

      }
    } else {
      console.log(`No verification attributes found for ${subdomain}.`);
      txtRecordStatus = 'No attributes found';

    }

    return txtRecordStatus;

  } catch (error) {
    console.error("Error checking verification status:", error);
    txtRecordStatus = 'Server error. Please try again later';

    return txtRecordStatus;


  }
}

async function checkMailFromTxtRecordStatus(subdomain) {
  const mailFromDomain = `bounces.${subdomain}`;
  let mailFromRecordStatus = { spf: false, mx: false };

  try {
    // Check TXT record for SPF
    const txtRecords = await dns.resolveTxt(mailFromDomain);
    const spfRecord = txtRecords.find((record) =>
      record.join("").includes("v=spf1 include:amazonses.com")
    );

    if (spfRecord) {
      console.log(`SPF TXT record found for ${mailFromDomain}`);
      mailFromRecordStatus.spf = true;
    } else {
      console.log(`SPF TXT record not found for ${mailFromDomain}`);
    }

    // Check MX record
    const mxRecords = await dns.resolveMx(mailFromDomain);
    const mxRecordValid = mxRecords.some((record) =>
      record.exchange.endsWith("amazonses.com")
    );

    if (mxRecordValid) {
      console.log(`MX record found and valid for ${mailFromDomain}`);
      mailFromRecordStatus.mx = true;
    } else {
      console.log(`MX record not found or invalid for ${mailFromDomain}`);
    }
  } catch (error) {
    console.error(`Error checking DNS records for ${mailFromDomain}:`, error);
  }

  return mailFromRecordStatus;
}


async function checkSpfRecordStatus(subdomain) {

  let spfRecordStatus = '';

  try {
    // Resolve the TXT records for the domain
    const txtRecords = await dns.resolveTxt(subdomain);
    // Check if any TXT record contains the SPF policy
    const spfRecord = txtRecords.find(record => record.join('').includes('v=spf1'));

    if (spfRecord) {
      const spfValue = spfRecord.join('');
      // Check if it includes Amazon SES
      if (spfValue.includes('include:amazonses.com')) {
        spfRecordStatus = 'verified';
      } else {
        spfRecordStatus = 'pending';
      }
    } else {
      spfRecordStatus = 'No attributes found';
    }
  } catch (error) {
    // console.error(`Error checking SPF record for ${domain}:`, error);
    spfRecordStatus = 'error';
  }

  return spfRecordStatus;
}

async function checkDkimCnameStatus(subdomain) {

  let cnameRecordsStatus = '';

  try {
    const command = new GetIdentityDkimAttributesCommand({ Identities: [subdomain] });
    const response = await sesClient.send(command);

    if (response.DkimAttributes[subdomain]) {
      const { DkimEnabled, DkimVerificationStatus } = response.DkimAttributes[subdomain];
      // console.log(`DKIM enabled: ${DkimEnabled}`);
      // console.log(`DKIM verification status: ${DkimVerificationStatus}`);
      if (DkimVerificationStatus === "Success") {
        // console.log(`DKIM signing is active for ${subdomain}!`);
        cnameRecordsStatus = 'verified';

      } else {
        // console.log(`DKIM signing is not yet verified for ${subdomain}. Wait for DNS propagation.`);
        cnameRecordsStatus = 'pending';

      }
    } else {
      // console.log(`No DKIM attributes found for ${subdomain}.`);
      cnameRecordsStatus = 'No attributes found';

    }

    return cnameRecordsStatus;

  } catch (error) {
    console.error("Error checking DKIM status:", error);
    cnameRecordsStatus = 'Server error. Please try again later';

    return cnameRecordsStatus;
  }
}

async function checkDmarcRecordStatus(subdomain) {

  // const domain = subdomain.split('.').slice(-2).join('.');

  const dmarcRecordName = `_dmarc.${subdomain}`;

  let dmarcStatus = '';
  let dmarcDetails = '';

  try {
    // Query DNS for TXT records
    const records = await dns.resolveTxt(dmarcRecordName);
    
    // Search for a DMARC policy in the TXT records
    const dmarcRecord = records.find(recordSet =>
      recordSet.some(record => record.startsWith("v=DMARC1"))
    );

    if (dmarcRecord) {
      dmarcDetails = dmarcRecord.join(""); // Combine record parts if split
      // console.log(`DMARC record found for ${subdomain}:`, dmarcDetails);

      // Check for required DMARC policy fields (e.g., "p=none", "p=reject")
      if (dmarcDetails.includes("p=")) {
        dmarcStatus = "verified";
      } else {
        // console.log("DMARC policy is incomplete or missing.");
        dmarcStatus = "policy-missing";
      }

      return dmarcStatus;
    } else {
      // console.log(`No DMARC record found for ${subdomain}.`);
      dmarcStatus = "not-found";
      return dmarcStatus;
    }
  } catch (error) {
    // console.error(`Error verifying DMARC record for ${subdomain}:`, error);
    dmarcStatus = "error";
    console.log('error:::: ', error);
    return dmarcStatus;

  }

  // Return the DMARC record status and details
  return { status: dmarcStatus, details: dmarcDetails };
}




// Step-4: Test Email Sending 

async function sendTestEmail(htmlCode) {
  try {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: ["sriram@inboxe.in"], // Replace with a valid email
      },
      Message: {
        Body: {
          Html: {
            Data: htmlCode
          },
        },
        Subject: { Data: "Transaction was successful" },
      },
      Source: "testsender@impmails.pepwalk.in", // Replace with your verified sender
    });

    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response.MessageId);
    return true
  } catch (error) {
    console.error("Error sending test email:", error);
    return false
  }
}

async function invokeLambdaWithCampaignId(functionName, campaign_id, user_id) {
  try {
    const payload = { campaign_id, user_id };

    const batchToCopy = await BatchModel.findOne({ is_batch_completed: false });
    if (!batchToCopy) {
      throw new Error("No batch found with is_batch_completed: false");

      // Write operation to do something 
    }

    const queueBatch = {
     
      original_batch_id: batchToCopy._id,
      user_id : batchToCopy.user_id,
      campaign_id : batchToCopy.campaign_id,
      pendingContacts : batchToCopy.contacts,
      sentContacts: [],

    };

    await QueueBatch.create(queueBatch);

    // here mongoDB operation 

    const command = new InvokeCommand({
      FunctionName: functionName, // The name of the Lambda function to invoke
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
}


const scheduleBatchCheck = () => {
  console.log('Batches Queue Hit::::::::::::');
  batchCheckQueue.add(
    {}, // No additional data needed for this job
    { repeat: { every: 60000 } } // Run every 10 seconds
  );
};

// Start the process
// scheduleBatchCheck();

//Example Call

// (async () => {
//   const functionName = "sendEmailsFunction"; // Replace with your Lambda function name
//   const campaign_id = "6761c9872d15a11908eef7f2"; 
//   const user_id = "6755af8e399ae624909a65b6";

//   const result = await invokeLambdaWithCampaignId(functionName, campaign_id, user_id);
//   console.log("Result from Lambda function:", result);
// })();




// DNS lookup to validate an eamil address

async function validateDomain(email) {
    const domain = email.split('@')[1]; // Extract the domain from the email
    try {
        const mxRecords = await dns.resolveMx(domain);
        if (mxRecords && mxRecords.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

async function validateSubdomain(subdomain) {
  try {
    // Extract the parent domain (the part after the first dot)
    const domain = subdomain.split('.').slice(-2).join('.'); // e.g., 'pepwalk.in' from 'impmails.pepwalk.in'

    // Try resolving the domain to ensure it exists
    const addresses = await dns.resolve(domain);
    if (addresses && addresses.length > 0) {
      return true; // Parent domain is valid
    } else {
      return false; // Parent domain doesn't resolve to any address
    }
  } catch (err) {
    // If an error occurs, the parent domain is invalid
    return false;
  }
}

function isValidEmail(email) {
  // First, validate the email format
  if (!validator.isEmail(email)) {
      return false;
  }

  // Split into local part and domain
  const localPart = email.split('@')[0];

  // Check for meaningfulness using a regex (basic logic, can be improved)
  const meaningfulPattern = /^[a-zA-Z]{3,}([a-zA-Z0-9._]{0,})$/;

  return meaningfulPattern.test(localPart);
}



const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


router.post('/create-dns-records', async function (req, res) {
      
  const userId = req.body.user_id;
  const subdomain = req.body.subdomain;

  const validateSubDomain = await validateSubdomain(subdomain);

  if(validateSubDomain){

    const dnsRecords = await generateDNSRecords(subdomain);
    const mailFromRecords = await setupCustomMailFrom(subdomain);
   const dmarcRecords = await generateDMARCRecords(subdomain, 'dmarcreports@inboxe.in');

 try {
   const newSubdomain = await UnverifiedSubdomain.create({
     user_id: userId,
     subDomain: subdomain,
     txtName: dnsRecords.txtName,
     txtValue: dnsRecords.txtValue,
     spfTxtName : dnsRecords.spfTxtName,
     spfTxtValue : dnsRecords.spfTxtValue,
     cname1Name: dnsRecords.Cname1Name,
     cname1Value: dnsRecords.Cname1Value,
     cname2Name: dnsRecords.Cname2Name,
     cname2Value: dnsRecords.Cname2Value,
     cname3Name: dnsRecords.Cname3Name,
     cname3Value: dnsRecords.Cname3Value,
     dmarcRecordName: dmarcRecords.dmarcName,
     dmarcRecordValue: dmarcRecords.dmarcValue,
     mailFromTxtName : mailFromRecords.txtRecordName,
     mailFromTxtValue : mailFromRecords.txtRecordValue,
     mxName : mailFromRecords.mxRecordName,
     mxValue : mailFromRecords.mxRecordValue,
   });
 
   // Send response with created subdomain's _id
   res.status(200).send({ created: true, subdomain_id: newSubdomain._id });
  res.end();

} catch (error) {
  // Handle any errors that occurred during record creation
  console.error('Error creating subdomain record:', error);
  res.status(500).json({ error: 'Error creating subdomain record' });
 res.end();

}

  }

  else

  {
     // Send response with created subdomain's _id
     console.log('this got hit');
   res.status(200).send({ created: false, reason : 'invalid subdomain' });
   res.end();

  }
    
});

router.post("/signup-user", async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - EmailSender",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await UserOnPlatform.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempUserOnPlatform.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password ) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }

    else if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else if(existingUserInTemp){

      existingUserInTemp.password = hashedPassword;
      existingUserInTemp.brand_name = brand;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);

     return res.status(200).send({ success: true });

    }

    else{

    await TempUserOnPlatform.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/signup-user-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;
    const name = firstName + " " + lastName;
    const user = await UserOnPlatform.findOne({ email });

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempUserOnPlatform.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await UserOnPlatform.create({
        email: lowerCaseEmail,
        password: result.password,
        reset_pin : pin,
      });

      await TempUserOnPlatform.deleteOne({ email: lowerCaseEmail  });


  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post("/user-login", async (req, res, next) => {


  try {
    const { email, password } = req.body;

    if (!email || !password) {
     return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await UserOnPlatform.findOne({ email }).select("+hashPassword");

    if (!user) {
      return res.status(400).send({
        error: "User does not exists!",
        data: null,
        message: "User does not exists!",
      });
    }

    bcrypt.compare(password, user.password, function (err1, result) {
      if (result === true) {
      createToken(user, res);
      

      } else {
        logger.customerLogger.log('error', 'Error creating token');
        return res.status(400).send({
          error: "email, password mismatch",
          data: null,
          message: "Wrong Email or Password",
        });
      }

    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});

router.post("/user-login-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;

    const user = await UserOnPlatform.findOne({ email });

    const name = firstName + " " + lastName;

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


router.post('/all-subdomain-details', async (req, res, next) => {
  const user_id = req.body.userId;
  let recordsStatus = false;

  const result = await UnverifiedSubdomain.find({ 'user_id': user_id });

  result.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
  
    // Compare dates in descending order
    return dateB - dateA;
  });

  const tableData = await Promise.all(result.map(async (data, index) => {

    if(data.txtRecordStatus && data.cnameRecordStatus && data.dmarcRecordStatus){

      recordsStatus = true;
    }

    return {
      id: index + 1,
      recordsStatus : recordsStatus,
      createdDate: data.created_at,
      subdomain : data.subDomain,
      subdomain_id : data._id
      
    };
  }));

  res.status(200).send({ data: tableData });
  res.end();

});

router.post('/get-all-tags', async (req, res, next) => {
  const user_id = req.body.user_id;

  try {
    // Fetch tags for the given user_id
    const result = await Tags.find({ 'user_id': user_id });

    // Map the result to send tag details with tag name and tag_id
    const tagsArray = result.map(tag => ({
      tag: tag.tag,
      tag_id: tag._id 
    }));

    // Send the response
    res.status(200).send({ tags: tagsArray });
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).send({ message: 'Failed to fetch tags', error: error.message });
  }
});




router.post('/get-all-tags-with-count', async (req, res, next) => {
  try {
    const user_id = req.body.user_id;

    let allContactsSet = new Set();  // Set to keep unique contacts

    // Fetch all tags linked to the user_id from the Tags collection
    const tagsResult = await Tags.find({ user_id: user_id });
    const finalTagsArray = []; // Array to hold the tag count results

    for (const tagObj of tagsResult) {
      const tag = tagObj.tag;
      const tag_id = tagObj._id;

      // Fetch the unique contacts linked to the tag
      const contactsWithTag = await Contacts.find({ user_id: user_id, tags: { $in: [tag_id] } }, { _id: 1 });

      // Add unique contact IDs to the Set
      contactsWithTag.forEach(contact => allContactsSet.add(contact._id));

      // Add tag and its count to the final tags array
      finalTagsArray.push({ tag: tag, count: contactsWithTag.length, tag_id: tag_id });
    }

    // Add the "All Contacts" count as the size of the unique contacts set
    finalTagsArray.push({
      tag: 'All Contacts',
      count: allContactsSet.size,  // Unique contacts count
      tag_id: 'thisisjustdummyid'
    });

    // Send the final array to the frontend
    res.status(200).send({ tags: finalTagsArray }); // Send array directly
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while processing tags.' });
  }
});



router.post('/create-campaign', async (req, res) => {
  try {
    const { user_id, htmlCode, campaignTitle, tags, from, subject, previewText } = req.body;

    // Step 1: Create a new campaign record
    const newCampaign = await CampaignModel.create({
      // user_id: mongoose.Types.ObjectId(user_id),
      user_id : user_id,
      tags :  tags,
      campaignTitle : campaignTitle,
      fromName : from,
      subject : subject,
      previewText : previewText,
      emailContent : htmlCode,
      status : 'pending',
      contacts_delivered : [],
      contacts_opened : [],
      contacts_clicked : [],
      contacts_bounced : [],
      contacts_spam : [],
    });

    // Step 2: Add a job to Bull queue to process contacts in batches
    await campaignQueue.add({
      userId: user_id,
      campaignId: newCampaign._id,
      tags
    });

    // const prompt = "I need 10 different variations of this subject:" +subject;

// const result =  await model.generateContent(prompt);
// console.log(result.response.text());

    res.status(201).json({
      message: 'Campaign created and processing started!',
      campaignId: newCampaign._id
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




router.post('/create-new-tag', async function (req, res) {
  try {
    const user_id = req.body.user_id;
    const selectedTags = req.body.selectedTags; // Array of tag objects { tag, tag_id }

    console.log('selected tags :', selectedTags);

    if (!user_id || !Array.isArray(selectedTags)) {
      return res.status(400).send({ error: 'Invalid input' });
    }

    // Extract tag names from selectedTags to find if they already exist
    const selectedTagNames = selectedTags.map(tag => tag.tag);

    // Fetch existing tags for this user from the database
    const existingTags = await Tags.find({ tag: { $in: selectedTagNames } });

    const existingTagNames = existingTags.map(tag => tag.tag); // Get the names of existing tags

    // Identify new tags that need to be created
    const newTags = selectedTags.filter(tag => !existingTagNames.includes(tag.tag));

    let createdTags = [];

    // If there are new tags, create them in the database
    if (newTags.length > 0) {
      // Include the user_id while creating new tags
      const newTagDocuments = newTags.map(tag => ({ 
        tag: tag.tag, 
        user_id: user_id // Add user_id to the new tag document
      }));
    
      createdTags = await Tags.insertMany(newTagDocuments);
    
      // Map newly created tags to their _id
      createdTags = createdTags.map(tag => tag._id);
    }
    

    // Combine existing tags and newly created tags
    const allTags = [
      ...existingTags.map(tag => tag._id),
      ...createdTags
    ];

    console.log('All tags : ', allTags);

    // Send back the tag IDs
    res.status(200).send({ created: true, tag_ids: allTags });
    res.end();

  } catch (error) {
    console.error('Error creating tags:', error);
    res.status(500).send({ error: 'An error occurred while creating tags' });
    res.end();
  }
});



router.post('/upload-single-contact', async function (req, res) {

  try {
    const { user_id, email, name, tags, status } = req.body;
    console.log('tags :', tags);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const domain = email.split("@")[1];

    // Step 1: Validate input early
    if (!user_id || !email || !name || !tags) {
      return res.status(400).send({ error: 'Invalid input' });
    }

    // Step 2: Check if email already exists for the user
    const existingContact = await Contacts.findOne({ user_id, email });
    if (existingContact) {
      return res.status(200).send({ created: false, message: 'Contact with this email already exists', contact: existingContact });
    }

    // Step 3: Validate Email Format
    if (!emailRegex.test(email)) {
      return res.status(200).send({ created: false, message: 'Invalid Email Address' });
    }

    // Step 4: Check if the local part of the email is meaningful
    if (!isValidEmail(email)) {
      return res.status(200).send({ created: false, message: 'Invalid Email Address' });
    }

    // Step 5: Validate Domain
    const isDomainValid = await validateDomain(email);
    if (!isDomainValid || disposableEmailDomains.isDisposableEmailDomain(domain) || disposableEmailDomains.isDisposableEmail(email)) {
      return res.status(200).send({ created: false, message: 'Invalid Email Address' });
    }

    // Step 6: Create a new contact
    const newContact = new Contacts({
      user_id,
      email,
      name,
      tags,
      status,
    });

    await newContact.save();

    res.status(201).send({ created: true, message: 'Contact created successfully', contact: newContact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).send({ error: 'An error occurred while creating the contact' });
  }
});






router.post('/get-subdomain-details', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;



  UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then((result)=>{

    res.status(200).send({ subdomainData: result});
    res.end();


  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

// sendTestEmail();

router.post('/check-dns-records-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const txtRecordStatus = await checkTxtRecordStatus(fetchedSubdomain);
      const cnameRecordsStatus = await checkDkimCnameStatus(fetchedSubdomain);
      const dmarcRecordStatus = await checkDmarcRecordStatus(fetchedSubdomain);

      res.status(200).send({ txtRecordStatus, cnameRecordsStatus, dmarcRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});



router.post('/check-spf-txt-record-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const txtRecordStatus = await checkTxtRecordStatus(fetchedSubdomain);

      console.log('txtRecordStatus : ', txtRecordStatus);

      if(txtRecordStatus === 'verified'){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { txtRecordStatus: true } }
        );

      }

      res.status(200).send({ txtRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/check-mailFrom-txt-record-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const mailFromRecordStatus = await checkMailFromTxtRecordStatus(fetchedSubdomain);

      if(mailFromRecordStatus.spf){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { mailFromRecordStatus: true } }
        );

      }

      if(mailFromRecordStatus.mx){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { mxRecordStatus: true } }
        );

      }

      res.status(200).send({ mailFromRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/check-spf-record-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const spfRecordStatus = await checkSpfRecordStatus(fetchedSubdomain);

      if(spfRecordStatus === 'verified'){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { spfRecordStatus: true } }
        );

      }

      res.status(200).send({ spfRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/check-dmarc-record-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const dmarcRecordStatus = await checkDmarcRecordStatus(fetchedSubdomain);

      if(dmarcRecordStatus === 'verified'){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { dmarcRecordStatus: true } }
        );

      }


      res.status(200).send({ dmarcRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});

router.post('/check-cname-record-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const cnameRecordsStatus = await checkDkimCnameStatus(fetchedSubdomain);

      if(cnameRecordsStatus === 'verified'){

        await UnverifiedSubdomain.updateOne(
          { user_id: user_id, _id: subdomain_id },
          { $set: { cnameRecordStatus: true } }
        );

      }

      res.status(200).send({ cnameRecordsStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


router.post("/upload-bulk-contacts", fileUpload.single("file"), async function (req, res) {
  const user_id = req.body.user_id;
  const tagsArray = req.body.fetchedTags.split(',');
  const status = req.body.status;
  const updateExisting = req.body.updateExisting;
  const filePath = req.file.path;
  const validContacts = [];
  const invalidEmails = [];
  const disposableEmails = [];
  const dnsFailures = [];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to validate the email against all 4 steps
  const validateEmail = async (email, name) => {
    // Step 1: Regex validation
    if (!emailRegex.test(email)) {
      invalidEmails.push(email); // Invalid syntax
      return;
    }

    // Step 2: Check if the local part of the email is meaningful
    if (!isValidEmail(email)) {
      invalidEmails.push(email); // Invalid local part
      return;
    }

    // Step 3: Extract domain and validate MX records
    const domain = email.split("@")[1];
    const isDomainValid = await validateDomain(email);
    if (!isDomainValid) {
      dnsFailures.push(email); // Invalid domain (no MX records)
      return;
    }

    // Step 4: Check if the domain is disposable
    if (disposableEmailDomains.isDisposableEmailDomain(domain)) {
      disposableEmails.push(email); // Disposable domain detected
      return;
    }

    // Step 5: Check if the full email is disposable
    if (disposableEmailDomains.isDisposableEmail(email)) {
      disposableEmails.push(email); // Disposable email detected
      return;
    }

    // Passed all validations, prepare contact data
    validContacts.push({ email, name, user_id, tags: tagsArray, status, updateExisting });
  };

  const emailValidationTasks = []; // Store validation promises

  // Parse CSV file
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      const email = row["Email"];
      const name = row["Name"];
      emailValidationTasks.push(validateEmail(email, name)); // Add validation task
    })
    .on("end", async () => {
      try {
        // Wait for all email validations to complete
        await Promise.all(emailValidationTasks);

        // Loop through valid contacts and insert or update them in the database
        for (const contact of validContacts) {
          const { email, name, tags, status, user_id } = contact;
          
          if (updateExisting) {
            // Update the contact if it already exists, else create a new one
            await Contacts.findOneAndUpdate(
              { email }, // Match based on email
              { $set: { name, tags, status, user_id } }, // Set fields to update
              { upsert: true } // If no match is found, create a new document
            );
          } else {
            // Only insert new contacts, no update
            await Contacts.create({ email, name, tags, status, user_id });
          }
        }

        // Combine invalid emails (invalid, disposable, dns failures)
        const allInvalidEmails = [
          ...invalidEmails,
          ...disposableEmails,
          ...dnsFailures,
        ];

        const validContactsLength = validContacts.length;

        res.status(200).send({ data: { validContactsLength, allInvalidEmails } });
        res.end();

      } catch (error) {
        console.error("Error saving to database:", error);
        res.status(500).json({ message: "Failed to save data to the database." });
      } finally {
        // Delete the uploaded file after processing
        fs.unlinkSync(filePath);
      }
    })
    .on("error", (err) => {
      console.error("Error reading file:", err);
      res.status(500).json({ message: "Failed to process the file." });
    });
});


router.post('/get-all-contacts', async function (req, res) {

  const { page = 1, limit = 50, user_id, tag } = req.body;

  try {
    const filter = { user_id, is_del: false };

    // Check if `tag` is provided and is a valid ObjectId
    if (tag && mongoose.Types.ObjectId.isValid(tag)) {
      filter.tags = { $elemMatch: { $eq: new mongoose.Types.ObjectId(tag) } }; // Match the tag as an ObjectId
    }

    // Use MongoDB's built-in sorting, filtering, and pagination
    const totalContacts = await Contacts.countDocuments(filter); // Total count for pagination

    const paginatedContacts = await Contacts.find(filter)
      .sort({ created_at: -1 }) // Sort by `created_at` in descending order
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(limit) // Limit the number of documents returned
      .exec();

    const formattedContacts = paginatedContacts.map(contact => ({
      id: contact._id,
      email: contact.email,
      name: contact.name,
      status: contact.status,
    }));

    res.status(200).json({ contacts: formattedContacts, total: totalContacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



router.post('/delete-contacts', async function (req, res) {
  const { ids } = req.body;
  console.log('IDs: ', ids);

  try {
    // Update the contacts with the given ids, marking them as deleted by setting `is_del` to true
    const result = await Contacts.updateMany(
      { _id: { $in: ids } }, 
      { $set: { is_del: true } }
    );

    // Check if any contacts were updated
    if (result.modifiedCount > 0) {
      res.status(200).send({ deleted : true, message: "Contacts marked as deleted successfully" });
      res.end();

    } else {
      res.status(404).send({ message: "No contacts found to update" });
      res.end();

    }
  } catch (error) {
    console.error("Error marking contacts as deleted:", error);
    res.status(500).send({ deleted: false, message: "Internal Server Error" });
    res.end();

  }
});

router.post('/send-email', async function (req, res) {
  const { user_id, htmlCode } = req.body;

  const emailSent = await sendTestEmail(htmlCode);

  if(emailSent){

    
    res.status(200).send({ sent : true, message: "Contacts marked as deleted successfully" });
    res.end();

  }

  else {
    console.log('error sending email');
  }

 

});


router.post('/get-user-tracking-codes', async function (req, res){

  const userId = req.body.userId;

  TrackingCodes.find({'user_id' : userId}).then((result)=>{

    if(result){

    res.status(200).send({ data: result});
    res.end();

    }

    else{
    res.status(200).send({ data: null });
    res.end();

    }

  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


  router.post("/change-password", async function (req, res) {

    const { userId, password, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
    USER.findById(userId).select("+hashPassword").then((result)=>{
  
      if(result){
  
        bcrypt.compare(password, result.password, async function (err1, ress) {
          if (ress === true) {
  
            console.log('Correct Password');
  
            await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
            res.status(200).send({ success: true});
            res.end();
          
    
          } else {
            console.log('Wrong Password');
            return res.status(400).send({
              error: "Wrong current password",
              data: null,
              message: "Wrong current password",
            });
          }
    
        });
  
      }
  
      else{
  
        res.status(200).send({ success: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  });

  router.post("/check-email-exists-sendMail", async function (req, res) {

    const { email } = req.body;
    const pin = generatePin();
  
    
    USER.findOne({ email : email}).then( async (result)=>{
  
      if(result){
  
        const options = {
          to: email,
          subject: "Password Reset PIN - BroadReach",
          text: `Your 6-digit PIN: ${pin}`,
      }
  
      await USER.findByIdAndUpdate(result._id, { reset_pin: pin });
      await sendMail(options);
  
      res.status(200).send({ exists : true, emailSent: true});
      res.end();
  
  
      }
  
      else{
  
        res.status(200).send({ exists: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  
  });

  router.post("/check-resetPin-withDb", async function (req, res) {

    const { email, pin } = req.body;
    const pinAsInt = parseInt(pin);
    
    USER.findOne({ email : email}).then(async (result)=>{
  
      if(result.reset_pin === pinAsInt){
  
    res.status(200).send({ matching: true, email: email});
    res.end();
  
      }
  
      else{
  
        res.status(200).send({ matching: false});
        res.end();
  
      }
  
    }).catch((err) =>{
  
    })
  
  });

  router.post("/update-password", async function (req, res) {

    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    
    USER.findOne({ email : email}).then(async (result)=>{
  
      if(result){
  
        await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
   
    res.status(200).send({ success: true});
    res.end();
  
  
      }
  
      else{
  
        res.status(200).send({ success: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  });




module.exports = router;
