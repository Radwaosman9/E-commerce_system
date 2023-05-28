// import React, { useState,  useEffect } from "react";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Alert  from "react-bootstrap/Alert";
// import './UpdateHistory.css';
// import { getAuthUser } from "../../helper/Storage";
// import axios from "axios";
// import { useParams } from "react-router-dom";




// const UpdateOrder = () => {
//   let { id } = useParams();
//   const auth = getAuthUser();
//   const [order, setorder] = useState({
//     // user_id:"",
//     // product_id: "" ,
//     // amount:'' ,
//     state: "",
//     err: "",
//     loading: false,
//     reload: false,
//     success: null,
//   });
 
//   const Updateorder = (e) => {
//     e.preventDefault();

//     setorder({ ...order, loading: true });

//     const formData = new FormData();
//     // formData.append("user_id", order.user_id);
//     // formData.append("product_id", order.product_id);
//     // formData.append("amount", order.amount);
//     formData.append("state", order.state);
  
//     axios
//     .put("http://localhost:1000/admen/updateorder/" + id, formData, {
//       headers: {
//         token: auth.token,
//         // "Content-Type": "multipart/form-data",
//       },
//     })
//     .then((resp) => {
//       setorder({
//         ...order,
//         loading: false,
//         success: "order accepted !",
//         // reload: order.reload + 2
//       });
//     })
//     .catch((err) => {
//       setorder({
//         ...order,
//         loading: false,
//         success: null,
//         err: "Something went wrong, please try again later ",
//       });
//     });
// }; 
// useEffect(() => {
//   // setorder({ ...order, loading: true });
//   axios
//     .get("http://localhost:1000/admen/showoneorders/" + id,{
//       headers: {
//         token: auth.token,
//       },
//     })
//     .then((resp) => {
//       setorder({
//         ...order,
//         // user_id: resp.data.user_id,
//         // product_id: resp.data.product_id,
//         // amount: resp.data.amount,
//         state: resp.data.state,
     
//       });
//     })
//     .catch((err) => {
//       setorder({
//         ...order,
//         loading: false,
//         success: null,
//         err: "Something went wrong, please try again later !",
//       });
//     });
// }, [order.reload]);

//     return(
//       <div className="update-container1">
//       <h2>Update order form</h2>
//       {order.err && (
//    <Alert variant="danger" className="p-2">
//      {order.err}
//    </Alert>
//  )}

//  {order.success && (
//    <Alert variant="success" className="p-2">
//      {order.success}
//    </Alert>
//  )}
//  <Form onSubmit={Updateorder} >

// <Form.Group className="q3">
// <Form.Control  type="text" placeholder="state"  value={order.state} 
//   onChange={(e) => setorder({ ...order, state: e.target.value })}/>

// </Form.Group>



//  {/* <img 
//      alt={order.name}
//      style={{
//        width: "40%",
//        height: "300px",
//        objectFit: "fill",
//        borderRadius: "10px",
//        border: "1px solid #ddd",
//        marginBottom: "10px",
       
       
//      }}
//      src={Product.image_url}
//    /> */}
//  {/* <Form.Group className="q1">
//    <Form.Control  type="text" placeholder="user_id"  value={order.user_id}
//       onChange={(e) => setorder({ ...order, user_id: e.target.value })} />
    
//  </Form.Group>
//  <Form.Group className="q2">
//    <Form.Control  type="text" placeholder="product_id"  value={order.product_id}  
//     onChange={(e) => setorder({ ...order, product_id: e.target.value })} />

//  </Form.Group> */}
//  {/* <Form.Group className="q3">
//    <Form.Control  type="text" placeholder="amount"  value={order.amount}
//       onChange={(e) => setorder({ ...order, amount: e.target.value })} />

//  </Form.Group> */}

 



//  <Button className="n10 btn-blue w-50" variant="primary" type="submit">
//   accept order
//  </Button>
// </Form>
//    </div>
// )

// };

// export default UpdateOrder ;