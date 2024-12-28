const {sign, verify} = require("jsonwebtoken");
const JWT_SECRET_KEY= "secretPasswordjkknvivn2345^&*#$%^"






    


const createToken = (user, res) =>{


const token = sign({id: user._id, email: user.email}, JWT_SECRET_KEY, {expiresIn: '1d'});

const options = {
  expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  sameSite: "none",
  secure: true,
};

const userObj = { 'user_id': user._id, 'user_email': user.email };

res.status(201).cookie('token', token, options).json({
  token,
  userObj,
});

}








module.exports = {createToken};