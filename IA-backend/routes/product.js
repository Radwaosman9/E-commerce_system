const router = require("express").Router();
const conn =require("../db/dbconnection");
const authorized = require("../middleware/authorize");
const admin =require("../middleware/admin");
const {body, validationResult} = require("express-validator");
const upload =require("../middleware/upload");
const crypto = require("crypto");
const util = require("util"); // helper
const fs = require("fs"); // file system
 


//create product
 router.post("/create",authorized, admin,upload.single("image")
 ,body("name").isString().withMessage("please enter product name"),body("price").isNumeric()
 .withMessage("please enter product price"),
 body("category_id").isNumeric().withMessage("please enter catagory id")
 ,body("description").isString().withMessage("please enter description").isLength({min:10})
 .withMessage("name should at least 10 charcter")
 ,async (req ,res) =>{
    try{
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors :errors.array() });
        }

    if (!req.file) {
        return res.status(400).json({
            errors: [
             {
                  msg: "Image is Required",
             },
            ],
        });
    }

    const productobj = {
        name: req.body.name,
        description: req.body.description,
        image_url: req.file.filename,
        price: req.body.price,
        category_id	: req.body.category_id,
      };

      const query = util.promisify(conn.query).bind(conn);
      await query("insert into product set ? ", productobj);
      res.status(200).json({
        msg: "product created successfully !",
      });

    }catch (err) {
        console.log("err");
        res.status(500).json(err);
      }
 });

 //update product
 router.put("/update/:id",admin,
 upload.single("image"),body("name").isString()
 .withMessage("please enter product name"),body("price").isNumeric()
 .withMessage("please enter product price"),
 body("category_id").isNumeric().withMessage("please enter catagory id")
 ,body("description").isString().withMessage("please enter description").isLength({min:10})
 .withMessage("name should at least 10 charcter")
 ,async (req ,res) =>{
    try {
        
        const query = util.promisify(conn.query).bind(conn);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF product EXISTS OR NOT
        const product1 = await query("select * from product where id = ?", [
          req.params.id,
        ]);
        if (!product1[0]) {
          res.status(404).json({ msg: "product not found !" });
        }
  
        // 3- PREPARE product
        const products = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category_id: req.body.category_id,
        };
  
        if (req.file) {
          products.image_url = req.file.filename;
          fs.unlinkSync("./upload/" + product1[0].image_url); // delete old image
        }
  
        // 4- UPDATE product
        await query("update product set ? where id = ?", [products, product1[0].id]);
  
        res.status(200).json({
          msg: "product updated successfully",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });
  

// delete product
router.delete("/delete/:id",authorized,admin, async (req ,res) =>{
    try {
  
        // CHECK IF product EXISTS 
        const query = util.promisify(conn.query).bind(conn);
        const product1 = await query("select * from product where id = ?", [
          req.params.id,
        ]);
        if (!product1[0]) {
          res.status(404).json({ msg: "product not found !" });
        }
  
        //  delete image
        fs.unlinkSync("./upload/" + product1[0].image_url); // delete old image
        // 4- delete product
        await query("delete from product where id = ?", [product1[0].id]);
        res.status(200).json({
          msg: "product deleted successfully",
        });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });
 

 //list product

 router.get("/list", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if (req.query.search) {
      // QUERY PARAMS
      search = `where name LIKE '%${req.query.search}%' or description LIKE '%${req.query.search}%'`;
    }
    const prod = await query(`select * from product ${search}`);
    prod.map((product1) => {
      product1.image_url = "http://" + req.hostname + ":1000/" + product1.image_url;
    });
    res.status(200).json(prod);
  });

  router.get("/show/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const product1 = await query("select * from product where id = ?", [
      req.params.id,
    ]);
    if (!product1[0]) {
      res.status(404).json({ msg: "product not found !" });
    }
    product1[0].image_url = "http://" + req.hostname + ":1000/" + product1[0].image_url;
    product1[0].reviews = await query(
      "select * from user_product_review where product_id = ?",
      product1[0].id
    );
    res.status(200).json(product1[0]);
  });



 // product review (user)
 router.post(
    "/review",
    authorized,
    body("product_id").isNumeric().withMessage("please enter a valid product ID"),
    body("review").isString().withMessage("please enter a Review"),
    async (req, res) => {
      try {
        const query = util.promisify(conn.query).bind(conn);
        //  VALIDATION REQUEST [manual, express validation]
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        // 2- CHECK IF MOVIE EXISTS OR NOT
        const product1 = await query("select * from product where id = ?", [
          req.body.product_id,
        ]);
        if (!product1[0]) {
          res.status(404).json({ ms: "product not found !" });
        }
  
        // 3 - PREPARE MOVIE REVIEW OBJECT
        const reviewObj = {
         user_id: res.locals.user.id,
         product_id: product1[0].id,
         review: req.body.review,
        };
  
        // 4- INSERT MOVIE OBJECT INTO DATABASE
        await query("insert into user_product_review set ?", reviewObj);
  
        res.status(200).json({
          msg: "review added successfully !",
        });
      } catch (err) {
        res.status(500).json(err);
      }
    });

      //show product
  
   router.get("/showcategory/:category_id", authorized ,async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const product = await query("select * from product where category_id=?", [
      req.params.category_id,
    ]);
    if (!product) {
      res.status(404).json({ msg: " no product  found !" });
    }
    product.map(product=>[ product.image_url = "http://" + req.hostname + ":1000/" + product.image_url]);
    
    res.status(200).json(product);
  });


 


module.exports = router;