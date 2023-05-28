import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { Link} from "react-router-dom";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";

const ManageUser = () => {
    const auth = getAuthUser();
    const [users, setusers] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0,
    });
  

    useEffect(() => {
      setusers({ ...users, loading: true });
      axios
        .get("http://localhost:1000/admen/showusers",{
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setusers({ ...users, results: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setusers({
            ...users,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    }, [users.reload]);
  
    const deleteuser = (id) => {
      axios
        .delete("http://localhost:1000/admen/deleteuser/" + id, {
          headers: {
            token: auth.token,
          },
        })
        .then((resp) => {
          setusers({ ...users, reload:users.reload + 1 });
        })
        .catch((err) => {});
    };
  
    return (
      <div className="manage-Medicine p-5">
        <div className="header d-flex justify-content-between mb-5">
          <h3 className="text-center ">Manage users</h3>
          {/* <Link to={"add_patient"} className="btn btn-success">
            Add New patient +
          </Link> */}
        </div>
  
         <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>name</th>
              <th>email</th>
              <th> type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            { users.results.map(users=> (
              <tr key={users.id}>
                <td>{users.id}</td>
                <td>{users.name}</td>
                <td> {users.email} </td>
                <td>{users.type}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                        deleteuser(users.id);
                    }}>
                    Delete
                  </button>
                  {/* <Link
                    to={update_patient/${userData.id}}
                    className="btn btn-sm btn-outline-primary m-t-3">
                    Update
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table> 
      </div>
    );
};

export default ManageUser;