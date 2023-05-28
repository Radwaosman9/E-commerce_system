import React from 'react';
import "./style/ProductList.css";
import ProductCard from "./component/ProductCard";
import { Data } from "../../core/data/Website1";


const ProductList = () => {
    const items = Data ;
    return (
        <><div><h1> Best Sellers </h1> </div>
        <div className="productlist">
            {items.map( (item) => {
                return <ProductCard key={item.id} img={item.image} name={item.name} desc={item.description}  />;
            }
            )}
        </div></>  
    );
};
export default ProductList; 