const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

//signup
router.post('/signup', async(req, res)=>{
  try {
    const {username, email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = User.create({
      username,
      password: hash,
      email
    });
    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '1d'}
    );
    res.json({token})
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
})

//signin
router.post('/signin', async(req, res)=>{
  try {
    const {email, password} = req.body;
    if(!email || !password){
      res.status(400).json({
        message: 'username and password required'
      })
    }
    const user = findOne({email});
    if(!user){
      res.status(404).json({
        message: 'user not found'
      })
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match){
      res.status(401).json({
        message: 'incorrect password'
      })
    }
    const token = await jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '1d'}
    );
    res.json({token});
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router