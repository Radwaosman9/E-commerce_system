
import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import './ManageProducts.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";





const ManageProducts = () => {
  const auth = getAuthUser();
  const [Product, setproduct] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0,
  });


  useEffect (() => {
    setproduct({ ...Product, loading: true });
    axios
      .get("http://localhost:1000/product/list")
      .then((resp) => {
        // console.log(resp);
    
        setproduct({ ...Product, results: resp.data, loading: false, err: null });
      })
      .catch((err) => {
        setproduct({
          ...Product,
          loading: false,
          err: " something went wrong, please try again later ! ",
        });
      });
  },[Product.reload]);

  const deleteproduct=(id)=>{
    axios
      .delete("http://localhost:1000/product/delete/"+id,{
        headers:{
          token: auth.token,
        },
      })
      .then((resp) => {
        setproduct({ ...Product, reload: Product.reload + 1 });
      })
      .catch((err) => {});
  };



    return(
        <div className="manage-products p-5">
            <div className="header d-flex justify-content-between mb-5">
            <h3 className="text-center ">Manage Products</h3>
            <Link to="/addP" className="btn btn-success">Add New Product +</Link>

            </div>


            <Table striped bordered hover >
      <thead >
        <tr>
          <th>id</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>price</th>
          <th>category</th>
          <th>Action</th>
        </tr>
      </thead>


      <tbody>
      {Product.results.map(Product=>(      
    <tr key={Product.id}>
          <td>{Product.id}</td>
          <td>
            <img src={Product.image_url}
              alt={Product.name}
             className="image-clothes" 
              />
          </td>
          <td>{Product.name}</td>
          <td> {Product.description}</td>
          <td> {Product.price}</td>
          <td> {Product.category_id}</td>
          <td>
            <button className="btn btn-sm btn-danger" onClick={(e)=>{deleteproduct(Product.id)}}>
              Delete</button>
            <Link to={"/updateP/" + Product.id} className="btn btn-sm btn-primary mx-2">Update</Link>
            <Link to={"/" +Product.category_id} className="btn btn-sm btn-info mx-2">Show</Link>
          </td>
        </tr>))}
      

   
      </tbody>
    </Table>
        </div>



     
    );

};

export default ManageProducts;