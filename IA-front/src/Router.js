import {createBrowserRouter} from "react-router-dom";
import ProductList from "./pages/products/ProductList";
import Body from "../src/components/Body";
import Card from "./components/Cards";
import ManageProducts from "./pages/manage/ManageProducts";
import AddProducts from "./pages/manage/AddProducts";
import UpdateProducts from "./pages/manage/UpadteProducts";
import ManageCategory from "./pages/manageCategory/ManageCategory";
import AddCategory from "./pages/manageCategory/AddCategory";
import ManageUser from "./pages/manageuser/ManageUser";
import UpdateCategory from "./pages/manageCategory/UpdateCategory";
import App from "./App";
import NotFound from "./shared/NotFound";
import ProductInfo from "./pages/products/component/ProductInfo";
import Login from "./pages/login/Login";
import Register from "./pages/login/Registerr";
import ProductList1 from "./pages/categories/ProductList1";
// import ProductListMen from './pages/categories/ProductListMen';
// import ProductListAccessories from "./pages/categories/ProductListAccssesories";
import ShowHistory from "./pages/history/ShowHistory";
import ShowHistory1 from "./pages/history/ShowHistory1";
import Guest from "./middleware/Guest";
import admin from "./middleware/admin";
// import UpdateHistory from "./pages/history/UpdateHistory";

export const router = createBrowserRouter([
    {
        path:'/',
        element: <App/>,
        children:[
            {
                    path: "/",
                    element:     <>
                    <Body/>
                    <Card/>
                    <ProductList/>
                  </>,
                  },
                  {
                    path: "/product-info/:id",
                    element: <ProductInfo />,
                  },
                  
                  {
                      path: "/manageP",
                      element: <ManageProducts />,
                    },
                    {
                      path: "/addP",
                      element: <AddProducts/>,
                    },
                    {
                      path: "/updateP/:id",
                      element: <UpdateProducts/>,
                    },
                    {
                      path: "/manageC",
                      element: <ManageCategory />,
                    },
                    {
                      path: "/manageU",
                      element: <ManageUser />,
                    },
                    {
                      path: "/addC",
                      element: <AddCategory/>,
                    },
                    {
                      path: "/updateC/:id",
                      element: <UpdateCategory/>,
                    },
                    {
                      path:'/showall',
                      element:<ShowHistory/>
                 },
                  
                  
                    // {
                    //   path: "/updateH/:id",
                    //   element: <UpdateHistory/>,
                    // },
                    {
                        path:'*',
                        element:<NotFound/>
                   },
               
               {
                path:'/showAll1',
                element:<ShowHistory1/>
           },
                   {
                    path:"/Login",
                    element:<Login/>
               },
               {
                path:"/register",
                element:<Register/>
           },
           {
            path: "/:id",
            element: <ProductList1/>,
          },
    
          // {
          //   path: "/:id",
          //   element: <ProductListMen/>,
          // },
    
          // {
          //   path: "/2",
          //   element: <ProductListAccessories/>,
          // },
          
        ]
    },
  ]);
  