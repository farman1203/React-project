import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const Shop_single = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [qty, setQty] = useState(1);

    useEffect(() => {
        edit_data();
    }, [id]); // ✅ FIX

    const edit_data = async () => {
        const obj = await axios.get(`https://react-project-zdz9.onrender.com/Products/${id}`);
        setData(obj.data);
    };

    // ➕ QTY PLUS
    const handlePlus = () => {
        setQty(qty + 1);
    };

    // ➖ QTY MINUS
    const handleMinus = () => {
        if (qty > 1) setQty(qty - 1);
    };

    // 🛒 ADD TO CART
    const addToCart = () => {
        const userId = sessionStorage.getItem("s_id");

        if (!userId) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        const cartKey = `cart_${userId}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

        const existingItem = existingCart.find(item => item.id === data.id);

        if (existingItem) {
            existingItem.qty += qty;
        } else {
            existingCart.push({
                ...data,
                qty: qty
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(existingCart));
        navigate("/cart");
    };

    return (
        <div>

            {/* BREADCRUMB */}
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <Link to="/">Home</Link>
                            <span className="mx-2 mb-0">/</span>
                            <strong className="text-black">{data.name}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="site-section">
                <div className="container">
                    <div className="row">

                        <div className="col-md-6">
                            <img src={data.image} alt={data.name} className="img-fluid" />
                        </div>

                        <div className="col-md-6">

                            <h2 className="text-black">{data.name}</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur, vitae, explicabo?
                                Incidunt facere, natus soluta dolores iusto! Molestiae expedita veritatis nesciunt doloremque
                                sint asperiores fuga voluptas, distinctio, aperiam, ratione dolore.</p>
                            <p className="mb-4">Ex numquam veritatis debitis minima quo error quam eos
                                dolorum quidem perferendis. Quos repellat dignissimos minus, eveniet nam
                                voluptatibus molestias omnis reiciendis perspiciatis illum hic magni iste,
                                velit aperiam quis.</p>
                            <p>
                                <strong className="text-primary h4">${data.price}</strong>
                            </p>
                            <div className="mb-1 d-flex">
                                <label htmlFor="option-md" className="d-flex mr-3 mb-3">
                                    <span className="d-inline-block mr-2" style={{ top: '-2px', position: 'relative' }}>
                                        <input type="radio" id="option-md" name="shop-sizes" /></span>
                                    <span className="d-inline-block text-black">{data.size}</span>
                                </label>


                            </div>
                            {/* QTY */}
                            <div className="mb-5">
                                <div className="input-group mb-3" style={{ maxWidth: 120 }}>
                                    <div className="input-group-prepend">
                                        <button
                                            className="btn btn-outline-primary"
                                            type="button"
                                            onClick={handleMinus}
                                        >
                                            −
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={qty}
                                        readOnly
                                    />

                                    <div className="input-group-append">
                                        <button
                                            className="btn btn-outline-primary"
                                            type="button"
                                            onClick={handlePlus}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ADD TO CART */}
                            <p>
                                <button
                                    className="buy-now btn btn-sm btn-primary"
                                    onClick={addToCart}
                                >
                                    Add To Cart
                                </button>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default Shop_single;
