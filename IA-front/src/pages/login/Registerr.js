import React, {useState}  from "react";
import "./Register.css";

import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";

// import { useFetcher } from "react-router-dom";
const Register=  ()=> {
    const navigate = useNavigate();
  const [register, setRegister] = useState({
    email: "",
    password: "",
    name: "",
    loading: false,
    err: [],
  });



  const RegisterFun = (e) => {
    e.preventDefault();
    setRegister({ ...register, loading: true, err: [] });
    axios
      .post("http://localhost:1000/auth/register", {
        email: register.email,
        password: register.password,
        name: register.name,
      })
      .then((resp) => {
        setRegister({ ...register, loading: false, err: [] });
        setAuthUser(resp.data);
        navigate("/Login");
      })
      .catch((errors) => {
        setRegister({
          ...register,
          loading: false,
          err: errors.response.data.errors,
        });
      });
  };
    return (
        <div className="cover">
            <img src="./images1/login.jpeg" alt="login"/>
            <div className="form">
            <h2 className="hh">Register Form</h2>
            {register.err.map((error, index) => (
        <Alert key={index} variant="danger" className="p-2">
          {error.msg}
        </Alert>
      ))}
               <div className="name"> <input type="text" placeholder=" Enter name" required value={register.name}
            onChange={(e) => setRegister({ ...register, name: e.target.value })}/></div>
               <div className="email"> <input type="text" placeholder=" Enter username"required value={register.email}
            onChange={(e) => setRegister({ ...register, email: e.target.value })}/></div>
               <div className="pass"><input type="password" placeholder="Enter password"required value={register.password}
            onChange={(e) => setRegister({ ...register, password: e.target.value })}/></div>
              <div className="login-btn" >
                    <button onClick={RegisterFun}>
                   
                        Login</button>
                </div>
            </div>
        </div>
    );
};
export default Register ;