const express = require('express');
const Joi = require('joi');
const pool = require('../db.js');
const mysql = require('mysql');

const commentRouter = express.Router({mergeParams: true});

//get - area/2/comments , get - area/4/comments/5
//post - area/5/comments
//put - area/5/comments/6
//delete - area/5/comment/7

const schema = Joi.object().keys({
  content:Joi.string().max(512).required(),
  user_id: Joi.number().integer().required()
});

const schema_u = Joi.object().keys({
  content:Joi.string().max(512).required()
});

commentRouter.use(express.json());

// SELECT ALL
commentRouter.get('/comments', (req, res) => {
    // Saljemo upit bazi
    let query = 'SELECT * FROM stats_comment WHERE area_id=?';
    let formated = mysql.format(query, [req.params.area_id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        else
            res.send(rows);
    });
});
//SELECT specific
commentRouter.get('/comments/:id', (req, res) => {
    let query = 'select * from stats_comment where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows[0]);
    });
});

//INSERT
commentRouter.post('/comments', (req, res) => {
    let { error } = schema.validate(req.body);
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {
        let query = "INSERT INTO ispit.stats_comment (content, area_id, user_id,created_at,updated_at) VALUES (?, ?, ?,NOW(),NOW())"
        let formated = mysql.format(query, [req.body.content, req.params.area_id, req.body.user_id]);
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from stats_comment where id=?';
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

//UPDATE
commentRouter.put('/comments/:id', (req, res) => {
    let { error } = schema_u.validate(req.body);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "UPDATE ispit.stats_comment SET content=?, updated_at=NOW() WHERE id=?"
        let formated = mysql.format(query, [req.body.content, req.params.id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from stats_comment where id=?';
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

commentRouter.delete('/comments/:id', (req, res) => {
    let query = 'select * from stats_comment where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let area = rows[0];

            let query = 'delete from stats_comment where id=?';
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




module.exports= commentRouter
