import React , { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert  from "react-bootstrap/Alert";
import './UpdateCategory.css'
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateCategory = () => {
  let { id } = useParams();
  const auth = getAuthUser();
  const [category, setcategory] = useState({
    name: "",
    description: "",
    image_url: null,
    err: "",
    loading: false,
    reload: false,
    success: null,
  });
  const image = useRef(null);
  const UpdateCategory = (e) => {
    e.preventDefault();

    setcategory({ ...category, loading: true });

    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:1000/category/updatecategory/" + id, formData, {
      headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setcategory({
        ...category,
        loading: false,
        success: "category updated successfully !",
        reload: category.reload + 1,
      });
    })
    .catch((err) => {
      setcategory({
        ...category,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later ",
      });
    });
};
useEffect(() => {
  axios
    .get("http://localhost:1000/category/showcategory/" + id)
    .then((resp) => {
      setcategory({
        ...category,
        name: resp.data.name,
        description: resp.data.description,
        image_url: resp.data.image_url,
      });
    })
    .catch((err) => {
      setcategory({
        ...category,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
      });
    });
}, [category.reload]);




    return(
        <div className="update-container1">
           <h2>Update Category form</h2>
           {category.err && (
        <Alert variant="danger" className="p-2">
          {category.err}
        </Alert>
      )}

      {category.success && (
        <Alert variant="success" className="p-2">
          {category.success}
        </Alert>
      )}
      <Form onSubmit={UpdateCategory} >
      <img 
          alt={category.name}
          style={{
            width: "40%",
            height: "300px",
            objectFit: "fill",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
            
            
          }}
          src={category.image_url}
        />
      <Form.Group className="n1">
        <Form.Control  type="text" placeholder="Category Name"  value={category.name} 
         onChange={(e) => setcategory({ ...category, name: e.target.value })}/>
      </Form.Group>

      <Form.Group className="mb-3">
        <textarea
        className="n"
         placeholder="Description"
         value={category.description}
         onChange={(e) =>
           setcategory({ ...category, description: e.target.value })
         }
         rows={5}
      
         ></textarea>
      </Form.Group>


      <Form.Group className="p4">
      <input type="file" className="form-control2" ref={image}/>
      </Form.Group>

    
      <Button className="n10 btn-blue w-50" variant="primary" type="submit">
        Update Category
      </Button>
    </Form>
        </div>
    )

};

export default UpdateCategory;