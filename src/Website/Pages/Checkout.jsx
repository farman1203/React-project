import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Checkout = () => {

  const navigate = useNavigate();
  const userId = sessionStorage.getItem("s_id");

  const [cartData, setCartData] = useState([]);
  const [errors, setErrors] = useState({});

  const [billing, setBilling] = useState({
    fname: "",
    lname: "",
    address: "",
    phone: "",
    payment: ""
  });

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const cart =
      JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    setCartData(cart);
  }, []);

  const handlePlaceOrder = async () => {
    let newErrors = {};

    if (!billing.fname) newErrors.fname = true;
    if (!billing.address) newErrors.address = true;
    if (!billing.phone) newErrors.phone = true;
    if (!billing.payment) newErrors.payment = true;

    if (cartData.length === 0) {
      alert("Cart is empty");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Please fill all required fields");
      return;
    }
    const customerName = sessionStorage.getItem("s_name");

    const orderObj = {
      userId,
      billingDetails: billing,
      items: cartData,
      total: cartData.reduce(
        (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 1),
        0
      ),
      status: "Pending",
      customer: "customerName",
      date: new Date().toLocaleString()
    };

    try {
      await axios.post("http://localhost:3001/Orders", orderObj);

      localStorage.removeItem(`cart_${userId}`);

      navigate("/thankyou");
    } catch (err) {
      alert("Order failed");
    }
  };

  return (
    <div>

      <div className="bg-light py-3">
        <div className="container">
          <Link to="/">Home</Link> / <strong>Checkout</strong>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row">

            {/* ================= BILLING ================= */}
            <div className="col-md-6 mb-5">
              <h2 className="h3 mb-3 text-black">Billing Details</h2>
              <div className="p-3 p-lg-5 border">

                <div className="form-group row">
                  <div className="col-md-6">
                    <label className="text-black">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        setBilling({ ...billing, fname: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-black">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        setBilling({ ...billing, lname: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-black">Address *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Street address"
                    onChange={(e) =>
                      setBilling({ ...billing, address: e.target.value })
                    }
                  />
                </div>

                <div className="form-group row">
                  <div className="col-md-6">
                    <label className="text-black">Phone *</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) =>
                        setBilling({ ...billing, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ================= ORDER ================= */}
            <div className="col-md-6">
              <h2 className="h3 mb-3 text-black">Your Order</h2>
              <div className="p-3 p-lg-5 border">

                <table className="table site-block-order-table mb-5">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartData.map(item => (
                      <tr key={item.id}>
                        <td>{item.name} x {item.qty}</td>
                        <td>₹{(Number(item.price) || 0) * (Number(item.qty) || 1)}</td>
                      </tr>
                    ))}

                    <tr>
                      <td><strong>Order Total</strong></td>
                      <td>
                        <strong>
                          ₹{cartData.reduce(
                            (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 1),
                            0
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* PAYMENT */}
                <div className="border p-3 mb-5">
                  <label>
                    <input
                      type="radio"
                      name="payment"
                      onChange={() =>
                        setBilling({ ...billing, payment: "COD" })
                      }
                    /> Cash On Delivery
                  </label> <br />
                  <label> 
                    <input
                      type="radio"
                      name="payment"
                      onChange={() =>
                        setBilling({ ...billing, payment: "COD" })
                      }
                    />  Pay Online
                  </label>
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout;
