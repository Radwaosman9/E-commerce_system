const router = require("express").Router();
const conn =require("../db/dbconnection");
const authorized = require("../middleware/authorize");
const admin =require("../middleware/admin");
const {body, validationResult} = require("express-validator");
const upload =require("../middleware/upload");
const crypto = require("crypto");
const util = require("util"); // helper
const fs = require("fs");
  

  // order product (user)
  router.post("/addorder",authorized,
  body("product_id").isNumeric().withMessage("please enter a valid product ID"),
  body("amount").isNumeric().withMessage("please enter amount of product"),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF product EXISTS OR NOT
      const product = await query("select * from product where id = ?", [
        req.body.product_id,
      ]);
      if (!product[0]) {
        res.status(404).json({ ms: "product not found !" });
      }

      // 3 - PREPARE product order OBJECT
      const orderobj = {
        user_id: res.locals.user.id,
        product_id: product[0].id,
        amount:req.body.amount,
        // token1: crypto.randomBytes(16).toString("hex"),
      };

      // 4- INSERT product OBJECT INTO DATABASE
      await query("insert into user_product_order set ?", orderobj);

      res.status(200).json({
        msg: "ordered successfully !",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

//update order
router.put("/updateorder/:id",authorized,

body("amount").isNumeric().withMessage("please enter amount of product")
,async (req ,res) =>{
   try {
       
       const query = util.promisify(conn.query).bind(conn);
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
 
       //  CHECK IF order EXISTS OR NOT
       const orders = await query("select * from user_product_order where id = ?", [
         req.params.id,
       ]);
       if (!orders[0]) {
         res.status(404).json({ msg: "order not found !" });
       }
 
       // 3- PREPARE order
       const orderobj = {
        user_id: res.locals.user.id,
        amount:req.body.amount,
        token1: crypto.randomBytes(16).toString("hex"),
      };
 
       // 4- UPDATE order
       await query("update user_product_order set ? where id = ?", [orderobj, orders[0].id]);
 
       res.status(200).json({
         msg: "order updated successfully",
       });
     } catch (err) {
        console.log(err);
       res.status(500).json(err);
     }
   });

//delte order

router.delete("/deleteorder/:id",authorized, async (req ,res) =>{
    try {
  
        // CHECK IF user EXISTS 
        const query = util.promisify(conn.query).bind(conn);
        const order = await query("select * from user_product_order where id = ?", [
          req.params.id,
        ]);
        if (!order[0]) {
          res.status(404).json({ msg: "order not found !" });
        }
  
        await query("delete from user_product_order where id = ?", [order[0].id]);
        res.status(200).json({
          msg: "order deleted successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });




module.exports = router;
