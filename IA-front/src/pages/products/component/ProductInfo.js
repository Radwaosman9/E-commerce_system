import React, { useState, useEffect } from "react";
import "../style/ProductInfo.css";
// import ReviewMovie from "../../components/ReviewMovie";
import axios from "axios";
import { useParams } from "react-router-dom";
// import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../../helper/Storage";
import Form from "react-bootstrap/Form";

const  ProductInfo=() => {
    let { id } = useParams();
    const auth = getAuthUser();
    const [product, setproduct] = useState({
      loading: true,
      result: null,
      err: null,
      reload: 0,
    });
  
    const [amount, setamount] = useState({
      amount: "",
      loading: false,
      err: null,
    });
  
    useEffect(() => {
      setproduct({ ...product, loading: true });
      axios
        .get("http://localhost:1000/product/show/" + id)
        .then((resp) => {
          setproduct({ ...product, result: resp.data, loading: false, err: null });
        })
        .catch((err) => {
          setproduct({
            ...product,
            loading: false,
            err: " something went wrong, please try again later ! ",
          });
        });
    }, [product.reload]);
  
    const sendAmount = (e) => {
      e.preventDefault();
      setamount({ ...amount, loading: true });
      axios
        .post(
          "http://localhost:1000/order/addorder",
          {
            product_id: id,
            amount: amount.amount,
          },
          {
            headers: {
              token: auth.token,
            },
          }
        )
        .then((resp) => {
          setamount({ err: null, amount: "", loading: false });
        //   setMovie({ ...movie, reload: movie.reload + 1 });
        })
        .catch((errors) => {
          setamount({ ...amount, loading: false });
        });
    };
  
    return (
      <div className="movie-details-container p-5">
        {/* Loader  */}
        {/* {product.loading === true && (
          <div className="text-center">
            {/* <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> */}
          {/* </div>
        )}  */}
  
        {/* LIST MOVIES  */}
        {product.loading === false && product.err == null && (
          <>
            {/* Details Movie  */}
            <div className="row">
              <div className="col-3">
                <img
                  className="movie-image"
                  src={product.result.image_url}
                  alt={product.result.name}
                />
              </div>
  
              <div className="col-9">
                <h3> {product.result.name} </h3>
                <p>{product.result.description}</p>
                <p>{product.result.price}</p>
              </div>
            </div>
  
            {/* Reviews For Movies  */}
            <hr />
            {/* <h5 className="text-center bg- text-white p-2">add order</h5> */}
  
            {/* {movie.result.reviews.map((review) => (
              <ReviewMovie review={review.review} />
            ))} */}
            {/* Handle No Review 
            {movie.result.reviews.length === 0 && (
              <Alert variant="info" className="p-2">
                there is no review currently for this movie
              </Alert>
            )} */}
  
            {auth && (
              <Form onSubmit={sendAmount}>
                <Form.Group className="mb-7">
                  <textarea
                  className="l1"
                    value={amount.amount}
                    onChange={(e) =>
                      setamount({ ...amount, amount: e.target.value })
                    }
                    // className="form-control"
                    placeholder="please write an amount"
                    rows={2}></textarea>
                </Form.Group>
  
                <Form.Group className="mb-9">
                  <button className="o1 btn-blue">Send order</button>
                </Form.Group>
              </Form>
            )}
          </>
        )}
  
        {/* ERRORS HANDLING  */}
        {product.loading === false && product.err != null && (
          <Alert variant="danger" className="p-2">
            {product.err}
          </Alert>
        )}
  
        {!auth && (
          <Alert variant="warning" className="p-2">
            please login first to be able to send an order
          </Alert>
        )}
      </div>
    );
  };
export default ProductInfo ;