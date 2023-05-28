import React , { useRef, useState }from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert  from "react-bootstrap/Alert";
import './AddCategory.css';
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";




const AddCategory = () => {



    const auth = getAuthUser();
    const [category, setcategory] = useState({
      name: "",
      description: "",
      err: "",
      loading: false,
      success: null,
    });
  
    const image = useRef(null);
    const createcategory = (e) => {
      e.preventDefault();
  
      setcategory({ ...category, loading: true });
      const formData = new FormData();
    formData.append("name", category.name);
    formData.append("description", category.description);
    if (image.current.files && image.current.files[0]) {
      formData.append("image", image.current.files[0]);
    }
    axios
      .post("http://localhost:1000/category/createcategory", formData, {
        headers: {
          token: auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setcategory({
          name: "",
          description: "",
          err: null,
          loading: false,
          success: "category Created Successfully !",
        });
        image.current.value = null;
      })
      
      .catch((err) => {
        setcategory({
          ...category,
          loading: false,
          success: null,
          err: "Something went wrong, please try again later !",
        });
      });
  };
  
    return(
        <div className="add-container2">
           <h1>Add New Category form</h1>
           {category.err && (
           <Alert variant="danger" className="p-2">{category.err}</Alert>
           )}
{category.success && (
           <Alert variant="success" className="p-2">{category.success}</Alert>
)}
           <Form onSubmit={createcategory}>
      <Form.Group className="b1">
        <Form.Control value={category.name}
            onChange={(e) => setcategory({ ...category, name: e.target.value })}
            type="text"
            required
            placeholder="category Name"
          />
      </Form.Group>

      <Form.Group className="mb-2">
        <textarea
        className="n4"
         placeholder="Description"
         value={category.description}
            required
            onChange={(e) =>
              setcategory({ ...category, description: e.target.value })
            }
         rows={5}
         ></textarea>
      </Form.Group>


      <Form.Group className="t5">
      <input type="file" className="form-control2" ref={image} required/>
      </Form.Group>

    
      <Button className="n10 btn-blue w-50" variant="primary" type="submit">
        Add New Category
      </Button>
    </Form>
        </div>
    )

};

// export default AddCategory;

// import React, { useRef, useState } from "react";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import Alert from "react-bootstrap/Alert";
// import './AddCategory.css';
// import { getAuthUser } from "../../helper/Storage";
// import axios from "axios";

// const AddCategory = () => {
//   const auth = getAuthUser();
//   const [category, setcategory] = useState({
//     name: "",
//     description: "",
//     err: "",
//     loading: false,
//     success: null,
//   });

//   const image = useRef(null);

//   const createcategory = (e) => {
//     e.preventDefault();

//     setcategory({ ...category, loading: true });

//     const formData = new FormData();
//     formData.append("name", category.name);
//     formData.append("description", category.description);
//     if (image.current.files && image.current.files[0]) {
//       formData.append("image", image.current.files[0]);
//     }
//     axios
//       .post("http://localhost:1000/category/createcategory", formData, {
//         headers: {
//           token: auth.token,
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((resp) => {
//         setcategory({
//           name: "",
//           description: "",
//           err: null,
//           loading: false,
//           success: "category Created Successfully !",
//         });
//         image.current.value = null;
//       })
//       .catch((err) => {
//         setcategory({
//           ...category,
//           loading: false,
//           success: null,
//           err: "Something went wrong, please try again later !",
//         });
//       });
//   };

//   return (
//     <div className="login-container">
//       <h1>Add New category Form</h1>

//       {category.err && (
//         <Alert variant="danger" className="p-2">
//           {category.err}
//         </Alert>
//       )}

//       {category.success && (
//         <Alert variant="success" className="p-2">
//           {category.success}
//         </Alert>
//       )}

//       <Form onSubmit={createcategory}>
//         <Form.Group className="mb-3">
//           <Form.Control
//             value={category.name}
//             onChange={(e) => setcategory({ ...category, name: e.target.value })}
//             type="text"
//             required
//             placeholder="category Name"
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <textarea
//             className="form-control"
//             placeholder="Description"
//             value={category.description}
//             required
//             onChange={(e) =>
//               setcategory({ ...category, description: e.target.value })
//             }
//             rows={5}></textarea>
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <input type="file" className="form-control" ref={image} required />
//         </Form.Group>

//         <Button className="btn btn-dark w-100" variant="primary" type="submit">
//           Add New category
//         </Button>
//       </Form>
//     </div>
//   );
// };

export default AddCategory;