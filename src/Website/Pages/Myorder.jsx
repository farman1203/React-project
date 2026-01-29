import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const MyOrder = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("s_id");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await axios.get(
        "https://react-project-zdz9.onrender.com/Orders"
      );

      // ✅ only logged-in user orders
      const myOrders = res.data.filter(
        (order) => order.userId === userId
      );

      setOrders(myOrders);
      setLoading(false);
    } catch (error) {
      console.error("Orders fetch error", error);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* BREADCRUMB */}
      <div className="bg-light py-3">
        <div className="container">
          <Link to="/">Home</Link> / <strong>My Orders</strong>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <h2 className="h3 mb-4 text-black">My Orders</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="border p-4 mb-4 rounded"
              >
                <div className="d-flex justify-content-between mb-2">
                  <strong>Order ID:</strong> #{order.id}
                  <span className="text-muted">{order.date}</span>
                </div>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-primary">
                    {order.status}
                  </span>
                </p>

                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.qty}</td>
                        <td>
                          ₹
                          {(Number(item.price) || 0) *
                            (Number(item.qty) || 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h5 className="text-right">
                  Order Total: ₹{order.total}
                </h5>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
