const router = require("express").Router();
const conn =require("../db/dbconnection");
const {body, validationResult} = require("express-validator");
const util = require("util"); 
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const accept = require("../middleware/usered");

//  admin add a user
router.post('/add',authorized, admin, [
  body('name').isString().notEmpty().withMessage("please enter name"),
  body('email').isEmail().notEmpty().withMessage("please enter valid email"),
  body('password').isString({min:8}).withMessage("password at least 8 chracter").notEmpty()
], async (req, res) => {
  // Validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const query = util.promisify(conn.query).bind(conn);
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
  // Get user information from request body
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    token: crypto.randomBytes(16).toString("hex"),
  };
  try {
    // Insert user into database
    await query("insert into users set ? ", userData);
    delete userData.password;
    // Return success response
    res.status(200).json({ msg: 'User added successfully.' });
  } catch (err) {
    // Return error response
    res.status(500).json({ error: err.message });
  } 
});
// admin delete user
router.delete("/deleteuser/:id",authorized,admin, async (req ,res) =>{
  try {

      // CHECK IF user EXISTS 
      const query = util.promisify(conn.query).bind(conn);
      const user = await query("select * from users where id = ?", [
        req.params.id,
      ]);
      if (!user[0]) {
        res.status(404).json({ msg: "user not found !" });
      }

      await query("delete from users where id = ?", [user[0].id]);
      res.status(200).json({
        msg: "user deleted successfully",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


//update user
router.put("/updateuser/:id",authorized,admin,
body('name').isString().notEmpty().withMessage("please enter name"),
body('email').isEmail().notEmpty().withMessage("please enter valid email"),
body('password').isString({min:8}).withMessage("password at least 8 chracter").notEmpty()
,async (req ,res) =>{
   try {
       
       const query = util.promisify(conn.query).bind(conn);
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
 
       //  CHECK IF user EXISTS OR NOT
       const user = await query("select * from users where id = ?", [
         req.params.id,
       ]);
       if (!user[0]) {
         res.status(404).json({ msg: "user not found !" });
       }
 
       // 3- PREPARE user
       const userdata = {
         name: req.body.name,
         email: req.body.email,
         password: await bcrypt.hash(req.body.password, 10),
        token: crypto.randomBytes(16).toString("hex"),
       };
 
      
       // 4- UPDATE user
       await query("update users set ? where id = ?", [userdata, user[0].id]);
 
       res.status(200).json({
         msg: "user updated successfully",
       });
     } catch (err) {
       res.status(500).json(err);
     }
   });
 

   router.get("/showusers",authorized,admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const users = await query("select * from users");
    res.status(200).json(users);
  });


  router.get("/showmyorder",authorized, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const history = await query("select * from user_product_order where user_id = ?",
    [res.locals.user.id]);
    if (!history[0]) {
      res.status(404).json({ msg: "Empty" });
    }

    res.status(200).json(history);
  });

  router.get("/showorders",admin, async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const history = await query("select * from user_product_order ");
    if (!history[0]) {
      res.status(404).json({ msg: "Empty" });
    }

    res.status(200).json(history);
  });



  router.get("/showoneorders/:id",authorized,admin, async (req, res) => {
    const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const query = util.promisify(conn.query).bind(conn);
  const order = await query("select * from user_product_order where id = ?", [
    req.params.id,]);
  
  if (!order[0]) {
    res.status(404).send('Order not found');
    return;
  }

    res.status(200).json(order[0]);
  });
  


//accept or declined order

router.put('/acceptorder/:id',authorized,admin,body("state").isString()
,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const query = util.promisify(conn.query).bind(conn);
  const order = await query("select * from user_product_order where id = ?", [
    req.params.id,]);
  
  if (!order) {
    res.status(404).send('Order not found');
    return;
  }
  const orders = {
    state: req.body.state,
   
   //  title: req.body.title,
    
  };
  await query("update user_product_order set ? where id = ?", [orders, order[0].id]);
  res.status(200).json({
    msg: "product updated successfully",
  });


  
  // if (req.body.status === 'accepted') {
  //   await query("update user_product_order set ? where id = ?", [orders, order[0].id]);
  //   res.send('Order accepted');
  // } else if (req.body.status === 'declined') {
  //   await query("update user_product_order set ? where id = ?", [orders, order[0].id]);
  //   res.send('Order declined');
  // } else {
  //   res.status(400).send('Invalid status');
  // }
});

router.put("/updateorder/:id",
async (req ,res) =>{
   try {
       const query = util.promisify(conn.query).bind(conn);

       const err = validationResult(req);
       if (!err.isEmpty()) {
         return res.status(400).json({ err: err.array() });
       }

       // 2- CHECK IF order EXISTS OR NOT
       const order1 = await query("select * from user_product_order where id = ?", [
         req.params.id,
       ]);
       if (!order1[0]) {
         res.status(404).json({ msg: "order not found !" });
       }
 
       await query("update user_product_order set state='accepted' where id = ?",  [order1[0].id]);
 
       res.status(200).json({
         msg: "order updated successfully",
       });
     } catch (err) {
       res.status(500).json(err);
     }
   });






module.exports=router;