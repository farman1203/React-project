import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Shop = () => {

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(10000);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("https://react-project-zdz9.onrender.com/Products");
    setProducts(res.data);
  };

  // 🔹 DYNAMIC CATEGORIES
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // 🔹 SIZE HANDLER
  const handleSizeChange = (value) => {
    setSizes(prev =>
      prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value]
    );
  };



  // 🔹 FILTER LOGIC (ALL COMBINED)
  const filteredProducts = products.filter(item => {
    const matchCategory =
      category === "All" || item.category === category;

    const matchPrice =
      Number(item.price) <= Number(price);

    const matchSize =
      sizes.length === 0 || sizes.includes(item.size);

    return matchCategory && matchPrice && matchSize;
  });



  const navigate = useNavigate();

  const addToCart = (product) => {
    const userId = sessionStorage.getItem("s_id");

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const cartKey = `cart_${userId}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const index = existingCart.findIndex(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (index !== -1) {
      // ✅ product already in cart → increase qty
      updatedCart = [...existingCart];
      updatedCart[index].qty =
        (updatedCart[index].qty || 1) + 1;
    } else {
      // ✅ new product → add with qty = 1
      updatedCart = [
        ...existingCart,
        { ...product, qty: 1 }
      ];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    navigate("/cart");
  };

  return (
    <div>
      <div className="bg-light py-3">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mb-0">
              <Link to="/">Home</Link>
              <span className="mx-2 mb-0">/</span>
              <strong className="text-black">Shop</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="site-section">
        <div className="container">
          <div className="row mb-5">

            {/* PRODUCTS */}
            <div className="col-md-9 order-2">
              <div className="row mb-5">
                {filteredProducts.length === 0 && (
                  <div className="col-12 text-center">
                    <h4>No products found</h4>
                  </div>
                )}

                {filteredProducts.map((value) => (
                  <div key={value.id} className="col-sm-6 col-lg-4 mb-4 " data-aos="fade-up">
                    <div className="block-4 text-center border">
                      <figure className="block-4-image">
                        <button className='btn-link no-border-button' onClick={() => navigate(`/shop-single/${value.id}`)}>
                          <img
                            src={value.image}
                            alt={value.name}
                            className="img-fluid "
                            style={{ height: "200px", objectFit: "contain" }}
                          />
                        </button>
                      </figure>
                      <div className="block-4-text p-4">
                        <h3>{value.name}</h3>
                        <p className="text-primary font-weight-bold">
                          ₹{value.price}
                        </p>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => addToCart(value)}
                        >
                          Add To Cart
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FILTER SIDEBAR */}
            <div className="col-md-3 order-1 mb-5">
              {/* CATEGORY */}
              <div className="border p-4 rounded mb-4">
                <h3 className="mb-3 h6 text-uppercase">Categories</h3>
                <ul className="list-unstyled mb-0">
                  {categories.map((cat, i) => (
                    <li key={i} className="mb-1">
                      <button
                        className={`btn btn-link p-0 ${category === cat ? "text-primary font-weight-bold" : ""
                          }`}
                        onClick={() => setCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRICE */}
              <div className="border p-4 rounded mb-4">
                <h3 className="mb-3 h6 text-uppercase">Filter by Price</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-100"
                />
                <p className="mt-2">Max Price: ₹{price}</p>
              </div>

              {/* SIZE */}
              <div className="border p-4 rounded mb-4">
                <h3 className="mb-3 h6 text-uppercase">Size</h3>

                {["Small", "Medium", "Large"].map(sz => (
                  <label key={sz} className="d-flex">
                    <input
                      type="checkbox"
                      checked={sizes.includes(sz)}
                      onChange={() => handleSizeChange(sz)}
                      className="mr-2 mt-1"
                    />
                    <span>{sz}</span>
                  </label>
                ))}
              </div>

              {/* RESET */}
              <button
                className="btn btn-danger w-100"
                onClick={() => {
                  setCategory("All");
                  setPrice(10000);
                  setSizes([]);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
