import React from "react";
import "../style/ProductCard.css"
import { Link } from "react-router-dom";



const ProductCard = (props) => {
    return (
       <> <div className="productcard"> 
        <div className="productimg">
        <img alt="productcard" src={props.img} />
        </div>
        <div className="cardinfo">
        <h4 className="title"> {props.name} </h4>
        <p className="info"> {props.desc}</p></div>
        <button className="btun">
            <Link to="/women">SHOW MORE</Link>
            
            </button>
        </div>
    </>
    );
};  

export default ProductCard; 