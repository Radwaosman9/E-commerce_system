import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import './ManageCategory.css';
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";





const ManageCategory = () => {
  const auth = getAuthUser();
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

  const deletcategory=(id)=>{
    axios
      .delete("http://localhost:1000/category/deletecategory/"+id,{
        headers:{
          token: auth.token,
        },
      })
      .then((resp) => {
        setcategory({ ...category, reload: category.reload + 1 });
      })
      .catch((err) => {});
  };


    return(
        <div className="manage-products p-5">
            <div className="header d-flex justify-content-between mb-5">
            <h3 className="text-center ">Manage categories</h3>
            <Link to="/addC" className="btn btn-success">Add New Category +</Link>

            </div>


            <Table striped bordered hover >
      <thead >
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Name</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>


      <tbody>
{category.results.map(category=>(      
    <tr key={category.id}>
          <td>{category.id}</td>
          <td>
            <img src={category.image_url}
              alt={category.name}
             className="image-clothes" 
              />
          </td>
          <td>{category.name}</td>
          <td> {category.description}</td>
          <td>
            <button className="btn btn-sm btn-danger" onClick={(e)=>{deletcategory(category.id)}}>
              Delete</button>
            <Link to={"/updateC/" + category.id} className="btn btn-sm btn-primary mx-2">Update</Link>
            <Link to={"/" +category.id} className="btn btn-sm btn-info mx-2">Show</Link>
          </td>
        </tr>))}
      

        {/* <tr>
          <td>2</td>
          <td>
            <img src="./images1/women.jpg"
              alt=""
             className="image-clothes" 
              />
          </td>
          <td>Women's clothes</td>
          <td>At Lady of the Roses, we offer quality women’s fashion</td>
          <td>
            <button className="btn btn-sm btn-danger">Delete</button>
            <Link to="/updateC" className="btn btn-sm btn-primary mx-2">Update</Link>
            <Link to={"/5"} className="btn btn-sm btn-info mx-2">Show</Link>

          </td>
        </tr>


        {/* .......... */}

        {/* <tr>
          <td>3</td>
          <td>
            <img src="./images1/bag.jpg"
              alt=""
             className="image-clothes" 
              />
          </td>
          <td>Accessories</td>
          <td>smaller items that can be added to outfits to complete them.</td>
          <td>
            <button className="btn btn-sm btn-danger">Delete</button>
            <Link to="/updateC" className="btn btn-sm btn-primary mx-2">Update</Link>
            <Link to={"/5"} className="btn btn-sm btn-info mx-2">Show</Link>

          </td>
        </tr> */} 
      </tbody>
    </Table>
        </div>



     
    );

};

export default ManageCategory;