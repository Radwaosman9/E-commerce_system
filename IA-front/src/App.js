
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import "./style/App.css";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};
export default App;
  