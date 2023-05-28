import React , { useState, useEffect }from "react";
import "./style/ProductList1.css"
// import "./style/Cards.css"
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import { useParams } from "react-router-dom";
import { getAuthUser } from "../../helper/Storage";



const ProductCard = () => {
  let{id}=useParams();
  const auth = getAuthUser();
    const [products, setproducts] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0,
      });
 
      useEffect (() => {
        setproducts({ ...products, loading: true });
        axios
          .get("http://localhost:1000/product/showcategory/"+ id,{
            headers: {
              token: auth.token,
              "Content-Type": "multipart/form-data",
            },
          })
          .then((resp) => {
            // console.log(resp);
            setproducts({ ...products, results: resp.data, loading: false, err: null });
          })
          .catch((err) => {
            setproducts({
              ...products,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      },[products.reload]);
    
    return (
       <div className="container3">
        {products.results.map((products) => (
         <div className="card-container1" key={products.id}>
            <div className="card-title1">
              
           
                <h3>{products.name}</h3>
             </div>
         <div className="image-container1" >
                <img src={products.image_url} alt="women" />
                </div>
                <p>{products.description}</p>
                <p>{products.price} $</p>
                <div className="button">
                    <button > <Link to={"/product-info/"+ products.id}>buy now</Link> </button>
                </div> 
                 <ProductCard
                  name={products.name}
                  image_url={products.image_url}
                  id={products.id}
                 description={products.description} 
                 price={products.price} />
          </div>
        ))};
{products.loading === false && products.err != null && (
        <Alert variant="danger" className="p-2">
          {products.err}
        </Alert>
      )}

      {products.loading === false &&
        products.err == null &&
        products.results.length === 0 && (
          <Alert variant="info" className="p-2">
            No products, please try again later !
          </Alert>
        )}
        </div>
    );
}; 

export default ProductCard;