const router = require("express").Router();
const conn =require("../db/dbconnection");
const {body, validationResult} = require("express-validator");
const util = require("util"); 
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authorized = require("../middleware/authorize");
//registration 

router.post("/register" ,body("email").isEmail().withMessage("please enter a vaild email."),
 body("password").isLength({min: 8, max: 12})
 .withMessage("password should be between (8-12) character"),
 body("name").isString().withMessage("please enter a valid name.")
 .isLength({min:10, max:20}).withMessage("name should be between (10-20)charcter."),
 async (req ,res) =>{
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors :errors.array() });
        }
        //check email exsist
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const checkEmailExists = await query(
          "select * from users where email = ?",
          [req.body.email]
        );
        if (checkEmailExists.length > 0) {
          res.status(400).json({
            errors: [
              {
                msg: "email already exists !",
              },
            ],
          });
        }
        const userData = {
            name: req.body.name,
            status: "active",
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),
            token: crypto.randomBytes(16).toString("hex"), // JSON WEB TOKEN, CRYPTO -> RANDOM ENCRYPTION STANDARD
          };
    
          //  INSERT USER DATA INTO DB
          await query("insert into users set ? ", userData);
          delete userData.password;
          res.status(200).json(userData);
    }catch(err){
        rss.status(500).jason({err : err});
    }
});

//login
router.post(
    "/login",
    body("email").isEmail().withMessage("please enter a valid email!"),
    body("password")
      .isLength({ min: 8, max: 12 })
      .withMessage("password should be between (8-12) character"),
    async (req, res) => {
      try {
        //  VALIDATION REQUEST 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        //  CHECK IF EMAIL EXISTS
        const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
        const user = await query("select * from users where email = ?", [
          req.body.email,
        ]);
        if (user.length == 0) {
          res.status(404).json({
            errors: [
              {
                msg: "email or password not found !",
              },
            ],
          });
        }
  
        //  COMPARE HASHED PASSWORD
        const checkPassword = await bcrypt.compare(
          req.body.password,
          user[0].password
        );
        if (checkPassword) {

          await query("UPDATE users SET status = 'active' WHERE id = ?", [user[0].id]);

          delete user[0].password;
          res.status(200).json(user[0]);
        } else {
          res.status(404).json({
            errors: [
              {
                msg: "email or password not found !",
              },
            ],
          });
        }
      } catch (err) {
        res.status(500).json({ err: err });
      }
    }
  );





//logout
router.post("/logout",authorized,
    async (req, res) => {
        try {
          const query = util.promisify(conn.query).bind(conn);
            const id = res.locals.user.id;
            const user = await query("select * from users where id=?", [id]);
            if (user.length == 0) {
                res.status(404).json({
                    errors: [
                        {
                            "message": "user not found!",
                        },
                    ],

                });
            } else {
                await query("update users set status='inactive' where id=?", [user[0].id]);
                res.status(200).json({
                    message: "user logged out successfully"
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });

        }

    });




module.exports = router;