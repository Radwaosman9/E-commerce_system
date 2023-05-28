import React , { useState, useEffect }from "react";
import "../style/Cards.css"
import { Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";



const Cards = () => {
    const [category, setcategory] = useState({
        loading: true,
        results: [],
        err: null,
        reload: 0,
      });
 
      useEffect (() => {
        setcategory({ ...category, loading: true });
        axios
          .get("http://localhost:1000/category/showcategory")
          .then((resp) => {
            // console.log(resp);
            setcategory({ ...category, results: resp.data, loading: false, err: null });
          })
          .catch((err) => {
            setcategory({
              ...category,
              loading: false,
              err: " something went wrong, please try again later ! ",
            });
          });
      },[category.reload]);
    
    return (
       <div className="container">
        {category.results.map((category) => (
         <div className="card-container" key={category.id}>
            <div className="card-title">
              
           
                <h3>{category.name}</h3>
             </div>
         <div className="image-container" >
                <img src={category.image_url} alt="women" />
                </div>
                <p>{category.description}</p>
                <div className="button">
                    <button > <Link to={"/" + category.id}>Shop Now</Link> </button>
                </div> 
                 <Cards 
                  name={category.name}
                  image_url={category.image_url}
                  id={category.id}
                 description={category.description} />
          </div>
        ))};
{category.loading === false && category.err != null && (
        <Alert variant="danger" className="p-2">
          {category.err}
        </Alert>
      )}

      {category.loading === false &&
        category.err == null &&
        category.results.length === 0 && (
          <Alert variant="info" className="p-2">
            No category, please try again later !
          </Alert>
        )}
        </div>
    );
}; 

export default Cards;
