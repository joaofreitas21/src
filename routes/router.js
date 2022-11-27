const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../database/db.js");
const userMiddleware = require("../middleware/users.js");

// localhost:3000/api/register
router.post("/register", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT id FROM users WHERE LOWER(username) = LOWER(${req.body.username})`,
    (err, result) => {
      if (result) {
        return res.status(409).send({
          message: "This username is already in use!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            //throw err;
            return res.status(500).send({
              message: err,
            });
          } else {
            db.query(
              `INSERT INTO users (username,password,email,registered) VALUES 
                        (${db.escape(req.body.username)},'${hash}',${db.escape(
                req.body.email
              )}, now());`,
              (err, result) => {
                if (err) {
                  //throw err;
                  return res.status(400).send({
                    message: "Username or Email already in use",
                  });
                }
                return res.status(201).send({
                  message: "Registered successfully",
                });
              }
            );
          }
        });
      }
    }
  );
});

// localhost:3000/api/login
router.post("/login", (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,
    (err, result) => {
      if (err) {
        //throw err;
        return res.status(400).send({
          message: err,
        });
      }
      //console.log(result);
      if (!result.length) {
        //console.log("ENTREI AQUI");
        return res.status(403).send({
          message: "Username not found",
        });
      } else {
        bcrypt.compare(
          req.body.password,
          result[0]["password"],
          (bError, bResult) => {
            if (bError) {
              //throw bError;
              return res.status(400).send({
                message: "Incorrect Password",
              });
            }
            if (bResult) {
              console.log(result[0].id);
              const token = jwt.sign(
                {
                  username: result[0].username,
                  userID: result[0].id,
                },
                "SECRETKEY",
                { expiresIn: "7d" }
              );
              db.query(
                `UPDATE users SET last_login = now() WHERE id = ${result[0].id};`
              );
              result[0].password = '';
              return res.status(200).send({
                message: "Logged in",
                token,
                user: result[0],
              });
            }

            return res.status(401).send({
              message: "The password is incorrect",
            });
          }
        );
      }
    }
  );
});

// localhost:3000/api/secretauth
router.get("/secretauth", userMiddleware.isLoggedIn, (req, res, next) => {
  console.log(req.userData);
  res.send("This is an autenticated only area!");
});

module.exports = router;
