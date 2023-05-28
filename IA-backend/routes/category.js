const router = require("express").Router();
const conn =require("../db/dbconnection");
const authorized = require("../middleware/authorize");
const admin =require("../middleware/admin");
const {body, validationResult} = require("express-validator");
const upload =require("../middleware/upload");
const util = require("util"); // helper
const fs = require("fs");



//create category
router.post("/createcategory",authorized, admin,upload.single("image")
,body("name").isString().withMessage("please enter category name")
//  ,body("title").isString().withMessage("please enter category title")
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

   const categoryobj= {
       name: req.body.name,
      //  title: req.body.title,
       description: req.body.description,
       image_url: req.file.filename,
     };

     const query = util.promisify(conn.query).bind(conn);
     await query("insert into category set ? ", categoryobj);
     res.status(200).json({
       msg: "category created successfully !",
     });

   }catch (err) {
       res.status(500).json(err);
     }
});



//update category
router.put("/updatecategory/:id",authorized,admin,
upload.single("image"),body("name").isString()
.withMessage("please enter title name"),
// body("title").isString().withMessage("please enter catagory title")
body("description").isString().withMessage("please enter description").isLength({min:10})
.withMessage("name should at least 10 charcter")
,async (req ,res) =>{
   try {
       
       const query = util.promisify(conn.query).bind(conn);
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
 
       // 2- CHECK IF category EXISTS OR NOT
       const category1 = await query("select * from category where id = ?", [
         req.params.id,
       ]);
       if (!category1[0]) {
         res.status(404).json({ msg: "category not found !" });
       }
 
       // 3- PREPARE category
       const categories = {
         name: req.body.name,
         description: req.body.description,
        //  title: req.body.title,
         
       };
 
       if (req.file) {
         category1.image_url = req.file.filename;
         fs.unlinkSync("./upload/" + category1[0].image_url); // delete old image
       }
 
       // 4- UPDATE category
       await query("update category set ? where id = ?", [categories, category1[0].id]);
 
       res.status(200).json({
         msg: "product updated successfully",
       });
     } catch (err) {
       res.status(500).json(err);
     }
   });
 

// delete category
router.delete("/deletecategory/:id",authorized,admin, async (req ,res) =>{
   try {
       const query = util.promisify(conn.query).bind(conn);
       const cat = await query("select * from category where id = ?", [
         req.params.id,
       ]);
       if (!cat[0]) {
         res.status(404).json({ msg: "category not found !" });
       }
 
       //  delete image
       fs.unlinkSync("./upload/" + cat[0].image_url); // delete old image
       // 4- delete category
       await query("delete from category where id = ?", [cat[0].id]);
       res.status(200).json({
         msg: "category deleted successfully",
       });
     } catch (err) {
       res.status(500).json(err);
     }
   });

//show category
   router.get("/showcategory/:id", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const category = await query("select * from category where id = ?", [
      req.params.id,
    ]);
    if (!category[0]) {
      res.status(404).json({ msg: "category not found !" });
    }
    category[0].image_url = "http://" + req.hostname + ":1000/" + category[0].image_url;
    
    res.status(200).json(category[0]);
  });

  //show category
  router.get("/showcategory" ,async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    const category = await query("select * from category" )
    if (!category) {
      res.status(404).json({ msg: " no category  found !" });
    }
    category.map(category=>[ category.image_url = "http://" + req.hostname + ":1000/" + category.image_url]);
    
    res.status(200).json(category);
  });









module.exports = router;