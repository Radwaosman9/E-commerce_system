import "../style/Header.css";
import { Link } from "react-router-dom";
import { removeAuthUser, getAuthUser } from "../helper/Storage";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

const Header = () => {
    const navigate = useNavigate();
    const auth = getAuthUser();
    const Logout = () => {
      removeAuthUser();
      navigate("/");
    };
    const Logoutu = () => {
        removeAuthUser();
        navigate("/");
      };
    return <header className="main-header">
        <nav>
        <label class="logo">E-Commerce</label>
            <ul>
            <li>
                <Link to={"/"}>Home</Link>
            </li>
            {!auth && (
                <>
            <li>
                <Link to={"/login"}>Login</Link>
            </li>
            <li>
                <Link to={"/register"}>Register</Link>
            </li>
            </>
            )}
              {auth && auth.type === 1 && (
              <>
            <li>
                <Link to={"/manageP"}>Manage Product</Link>
            </li>
            <li>
                <Link to={"/manageC"}>Manage Category</Link>
            </li>
            <li>
                <Link to={"/manageU"}>Manage User</Link>
            </li>
            <li>
                <Link to={"/showall"}>History</Link>
            </li>
            </>
              )}
            {auth && auth.type === 0 && (
              <>

              <li>
                <Link to={"/showall1"}>History</Link>
                </li>
              </>
              )}

              </ul>
            <Nav class="out text-white" >
            {/* Authenticated Routes  */}
            {auth && auth.type === 1 && ( <Nav.Link onClick={Logout}>Logout</Nav.Link>)}
          </Nav>
          <Nav class="outuser text-white" >
            {/* Authenticated Routes  */}
            {auth &&auth.type === 0 && (
              
              <Nav.Link onClick={Logoutu}>Logout</Nav.Link>)}
          </Nav>
        </nav>
     </header>
};
export default Header;