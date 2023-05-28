import React,{useState} from "react";
import "./Login.css";
import { Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { setAuthUser } from "../../helper/Storage";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";




const Login = () =>{
    const navigate = useNavigate();
    const [login, setLogin] = useState({
        email: "",
        password: "",
        loading: false,
        err: [],
      });
    
      const LoginFun = (e) => {
        e.preventDefault();
        console.log(login);
        setLogin({ ...login, loading: true, err: [] });
        axios
          .post("http://localhost:1000/auth/login", {
            email: login.email,
            password: login.password,
          })
          .then((resp) => {
            setLogin({ ...login, loading: false, err: [] });
            setAuthUser(resp.data);
            navigate("/");
          })
          .catch((errors) => {
            setLogin({
              ...login,
              loading: false,
              err: errors.response.data.errors,
            });
          });
      };
    return (
        <div className="cover" >
            <img src="./images1/login.jpeg" alt="login"/>
            <div className="form" >
                <h2>Login Form</h2>
                {login.err.map((error, index) => (
        <Alert key={index} variant="danger" className="p-2">
          {error.msg}
        </Alert>
      ))}
                <input type="text" placeholder=" Enter username" value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}  required />
                <input type="password" placeholder="Enter password" value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}  required />
                <div className="login-btn" >
                    <button onClick={LoginFun}>
                   
                        Login</button>
                </div>
   
            </div>
        </div>
    );
};
export default Login ;


