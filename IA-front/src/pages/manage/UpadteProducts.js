import React, { useState, useRef, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert  from "react-bootstrap/Alert";
import './UpdateProucts.css';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";




const UpdateProducts = () => {
  let { id } = useParams();
  const auth = getAuthUser();
  const [Product, setproduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: null,
    err: "",
    loading: false,
    reload: false,
    success: null,
  });
  const image = useRef(null);
  const Updateproduct = (e) => {
    e.preventDefault();

    setproduct({ ...Product, loading: true });

    const formData = new FormData();
    formData.append("name", Product.name);
    formData.append("description", Product.description);
    formData.append("price", Product.price);
    formData.append("category_id", Product.category_id);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
    .put("http://localhost:1000/product/update/" + id, formData, {
      headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setproduct({
        ...Product,
        loading: false,
        success: "product updated successfully !",
        reload: Product.reload + 1,
      });
    })
    .catch((err) => {
      setproduct({
        ...Product,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later ",
      });
    });
};
useEffect(() => {
  axios
    .get("http://localhost:1000/product/show/" + id)
    .then((resp) => {
      setproduct({
        ...Product,
        name: resp.data.name,
        description: resp.data.description,
        price: resp.data.price,
        category_id: resp.data.category_id,
        image_url: resp.data.image_url,
      });
    })
    .catch((err) => {
      setproduct({
        ...Product,
        loading: false,
        success: null,
        err: "Something went wrong, please try again later !",
      });
    });
}, [Product.reload]);

    return(
      <div className="update-container1">
      <h2>Update product form</h2>
      {Product.err && (
   <Alert variant="danger" className="p-2">
     {Product.err}
   </Alert>
 )}

 {Product.success && (
   <Alert variant="success" className="p-2">
     {Product.success}
   </Alert>
 )}
 <Form onSubmit={Updateproduct} >
 <img 
     alt={Product.name}
     style={{
       width: "40%",
       height: "300px",
       objectFit: "fill",
       borderRadius: "10px",
       border: "1px solid #ddd",
       marginBottom: "10px",
       
       
     }}
     src={Product.image_url}
   />
 <Form.Group className="f1">
   <Form.Control  type="text" placeholder="product Name"  value={Product.name} 
    onChange={(e) => setproduct({ ...Product, name: e.target.value })}/>
 </Form.Group>
 <Form.Group className="b2">
   <Form.Control  type="text" placeholder="product price"  value={Product.price} 
    onChange={(e) => setproduct({ ...Product, price: e.target.value })}/>
 </Form.Group>
 <Form.Group className="b3">
   <Form.Control  type="text" placeholder="category_id"  value={Product.category_id} 
    onChange={(e) => setproduct({ ...Product, category_id: e.target.value })}/>
 </Form.Group>

 <Form.Group className="mb-3">
   <textarea
   className="n7"
    placeholder="Description"
    value={Product.description}
    onChange={(e) =>
      setproduct({ ...Product, description: e.target.value })
    }
    rows={5}
 
    ></textarea>
 </Form.Group>


 <Form.Group className="k4">
 <input type="file" className="form-control2" ref={image}/>
 </Form.Group>


 <Button className="n10 btn-blue w-50" variant="primary" type="submit">
   Update product
 </Button>
</Form>
   </div>
)

};

export default UpdateProducts ;