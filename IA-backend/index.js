const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('upload'));
const cors =require("cors");
app.use(cors()) ;  

const auth = require("./routes/Auth");
const product= require("./routes/product");
const category= require("./routes/category");
const admen= require("./routes/admen");
const order= require("./routes/order");
app.listen(1000,"localhost",()=>{
    
   console.log("server is run");
});

app.use("/auth",auth);
app.use("/product",product);
app.use("/category",category);
app.use("/admen",admen);
app.use("/order",order);