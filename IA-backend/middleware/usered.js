const conn = require("../db/dbConnection");
const util = require("util");
const accept = async (req, res, next) => {
    const query = util.promisify(conn.query).bind(conn);
    // const { token1 } = req.headers;
    // const historic = await query("select * from user_product_order where token1 = ?", [token1]);
  
    // if (historic[0]) {
    //   res.locals.historic = historic[0];
      
    //   next();
    // } else {
    //   res.status(403).json({
    //     msg: "you are not accepted to access this route !",
    //   });
    // }
  };
  
  module.exports = accept;