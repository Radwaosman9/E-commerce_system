import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link} from "react-router-dom";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";

const ManageHistory1 = () => {
    const auth = getAuthUser();
    const [order, setorder] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });
  

    useEffect(() => {
      setorder({ ...order, loading: true });
      axios
        .get("http://localhost:1000/admen/showmyorder",{
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setorder({ ...order, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setorder({
            ...order,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    }, [order.reload]);
  
    // const deleteuser = (id) => {
    //   axios
    //     .delete("http://localhost:1000/admen/deleteuser/" + id, {
    //       headers: {
    //         token: auth.token,
    //       },
    //     })
    //     .then((resp) => {
    //       setusers({ ...users, reload:users.reload + 1 });
    //     })
    //     .catch((err) => {});
    // };
  
    return (
      <div className="manage-Medicine p-5">
        <div className="header d-flex justify-content-between mb-5">
          <h3 className="text-center ">History</h3>
          {/* <Link to={"add_patient"} className="btn btn-success">
            Add New patient +
          </Link> */}
        </div>
  
         <Table striped bordered hover>
          <thead>
            <tr>
              <th>order id</th>
              {/* <th>user</th> */}
              <th>product</th>
              <th> amount</th>
              <th> state</th>
          
            </tr>
          </thead>
          <tbody>
            { order.results.map(order=> (
              <tr key={order.id}>
                <td>{order.id}</td>
                {/* <td>{order.user_id}</td> */}
                <td> {order.product_id} </td>
                <td>{order.amount}</td>
                <td>{order.state}</td>
               
              </tr>
            ))}
          </tbody>
        </Table> 
      </div>
    );
};

export default ManageHistory1;