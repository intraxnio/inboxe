
const express = require("express");
// const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();
// const bcrypt = require("bcryptjs");
const UserOnPlatform = require("../models/User");
const URL = require("../models/Url");
var jwt = require("jsonwebtoken");
var jwtSecret = "P@sswordIsDangerous#";
const { body, validationResult } = require("express-validator");
router.use(cookieParser());
const axios = require("axios");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const shortid = require("shortid");




router.post('/', async function (req, res) {

   const body = req.body;

   if(!body.url){
    return res.status(400).json({
      error: 'url is required'

    })
  }
    const shortId = shortid();
    await URL.create({
      shortId : shortId,
      redirectUrl : body.url,
      uniqueVisitors : [],
      repeatedVisitors : [],
    })

    return res.json({ id: shortId})
  
  });


module.exports = router;
