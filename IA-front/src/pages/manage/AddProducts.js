import React , { useRef, useState }from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert  from "react-bootstrap/Alert";
import './AddProducts.css';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";




const AddProducts = () => {
  const auth = getAuthUser();
    const [Product, setproduct] = useState({
      name: "",
      description: "",
      price: "",
      category_id: "",
   
      err: "",
      loading: false,
      success: null,
    });
  
    const image = useRef(null);
    const createproduct = (e) => {
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
      .post("http://localhost:1000/product/create", formData, {
        headers: {
          token: auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setproduct({
          name: "",
          description: "",
          price: "",
          category_id: "",
          err: null,
          loading: false,
          success: "product Created Successfully !",
        });
        image.current.value = null;
      })
      
      .catch((err) => {
        setproduct({
          ...Product,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };
    return(
      <div className="add-container2">
      <h1>Add New product form</h1>
      {Product.err && (
      <Alert variant="danger" className="p-2">{Product.err}</Alert>
      )}
{Product.success && (
      <Alert variant="success" className="p-2">{Product.success}</Alert>
)}
      <Form onSubmit={createproduct}>
 <Form.Group className="g1">
   <Form.Control value={Product.name}
       onChange={(e) => setproduct({ ...Product, name: e.target.value })}
       type="text"
       required
       placeholder="product Name"
     />
 </Form.Group>
 <Form.Group className="g2">
   <Form.Control value={Product.price}
       onChange={(e) => setproduct({ ...Product, price: e.target.value })}
       type="text"
       required
       placeholder="product price"
     />
 </Form.Group>
 <Form.Group className="g3">
   <Form.Control value={Product.category_id}
       onChange={(e) => setproduct({ ...Product, category_id: e.target.value })}
       type="text"
       required
       placeholder="category_id"
     />
 </Form.Group>

 <Form.Group className="mb-2">
   <textarea
   className="z4"
    placeholder="Description"
    value={Product.description}
       required
       onChange={(e) =>
         setproduct({ ...Product, description: e.target.value })
       }
    rows={5}
    ></textarea>
 </Form.Group>


 <Form.Group className="n9">
 <input type="file" className="form-control2" ref={image} required/>
 </Form.Group>


 <Button className="n10 btn-blue w-50" variant="primary" type="submit">
   Add New product
 </Button>
</Form>
   </div>
)

};
export default AddProducts;