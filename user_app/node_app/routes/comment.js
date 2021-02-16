const express = require('express');
const Joi = require('joi');
const pool = require('./db.js');

const commentRouter = express.Router({mergeParams: true});





module.exports= commentRouter
