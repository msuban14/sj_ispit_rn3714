const express = require('express');
const Joi = require('joi');
const pool = require('../db.js');
//const commentRouter = require('./comment.js');
const mysql = require('mysql');




const areaRouter = express.Router();
//const commentRouter = express.Router({mergeParams: true});

//areaRouter.use('/:area_id/comments',commentRouter);

const schema = Joi.object().keys({
  name: Joi.string().min(3).max(200).required(),
  location: Joi.string().min(3).max(200).required(),
  body_of_water_type: Joi.string().min(3).max(200).required(),
  body_of_water_name: Joi.string().min(3).max(200).required(),
  licence_issuer: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1024).required(),
  app_user_id: Joi.number().integer().required()
});

const schema_u = Joi.object().keys({
  name: Joi.string().min(3).max(200).required(),
  location: Joi.string().min(3).max(200).required(),
  body_of_water_type: Joi.string().min(3).max(200).required(),
  body_of_water_name: Joi.string().min(3).max(200).required(),
  licence_issuer: Joi.string().min(3).max(200).required(),
  description: Joi.string().max(1024).required()
});


areaRouter.use(express.json());


// SELECT ALL
areaRouter.get('/areas', (req, res) => {
    // Saljemo upit bazi
    console.log(".");
    pool.query('SELECT * FROM stats_area', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        else
            res.send(rows);
    });
});

// INSERT
areaRouter.post('/areas', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    //let { error } = Joi.validate(req.body, schema);  // Object decomposition - dohvatamo samo gresku
    let { error } = schema.validate(req.body);
    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string
        //let query = "insert into poruke (user, message) values (?, ?)";
        let query = "INSERT INTO stats_area (name, location, body_of_water_type, body_of_water_name, licence_issuer, description, created_at, updated_at, views, app_user_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 0, ?);"
        let formated = mysql.format(query, [req.body.name, req.body.location, req.body.body_of_water_type, req.body.body_of_water_name,req.body.licence_issuer, req.body.description, req.body.app_user_id]);

        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from stats_area where id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

// SELECT
areaRouter.get('/area/:id', (req, res) => {
    let query = 'select * from stats_area where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows[0]);
    });
});

// Izmena poruke (vraca korisniku ceo red iz baze)
areaRouter.put('/area/:id', (req, res) => {
    let { error } = schema_u.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        //let query = "update poruke set user=?, message=? where id=?";
        let query = "UPDATE ispit.stats_area  SET name=?,location=?,body_of_water_type=?,body_of_water_name=?,licence_issuer=?,description=?, updated_at=NOW() WHERE id=?;"
        let formated = mysql.format(query, [req.body.name, req.body.location,req.body.body_of_water_type,req.body.body_of_water_name, req.body.licence_issuer,req.body.description, req.params.id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from stats_area where id=?';
                formated = mysql.format(query, [req.params.id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }

});


areaRouter.delete('/area/:id', (req, res) => {
    let query = 'select * from stats_area where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let area = rows[0];

            let query = 'delete from stats_area where id=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(area);
            });
        }
    });
});

module.exports = areaRouter;
