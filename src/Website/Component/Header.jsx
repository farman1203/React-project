import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
    const navigate = useNavigate();
    const [mobileMenu, setMobileMenu] = useState(false);

    const userId = sessionStorage.getItem('s_id');
    const userName = sessionStorage.getItem('s_name');

    const handleLogout = () => {
        const userId = sessionStorage.getItem("s_id");


        sessionStorage.clear();
        localStorage.removeItem("userId");

        toast.error('Logout Successfully');
        
        window.location.href = "/login";
    };

    return (
        <header className="site-navbar" role="banner">

            {/* TOP BAR */}
            <div className="site-navbar-top">
                <div className="container">
                    <div className="row align-items-center">

                        {/* SEARCH */}
                        <div className="col-6 col-md-4 order-2 order-md-1 site-search-icon text-left">
                            <form className="site-block-top-search">
                                <span className="icon icon-search2" />
                                <input
                                    type="text"
                                    className="form-control border-0"
                                    placeholder="Search"
                                />
                            </form>
                        </div>

                        {/* LOGO */}
                        <div className="col-12 mb-3 mb-md-0 col-md-4 order-1 order-md-2 text-center">
                            <div className="site-logo">
                                <Link to="/" className="js-logo-clone">Shoppers</Link>
                            </div>
                        </div>

                        {/* RIGHT ICONS */}
                        <div className="col-6 col-md-4 order-3 order-md-3 text-right">
                            <div className="site-top-icons">

                                {!userId ? (
                                    <ul>
                                        <li>
                                            <Link to="/login">
                                                <span className="icon icon-person" /> Sign In
                                            </Link>
                                        </li>

                                        {/* MOBILE MENU ICON */}
                                        <li className="d-inline-block d-md-none ml-md-0">
                                            <button
                                                className="site-menu-toggle js-menu-toggle"
                                                onClick={() => setMobileMenu(!mobileMenu)}
                                            >
                                                <span className="icon-menu" />
                                            </button>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul>
                                        <li className="dropdown">
                                            <a
                                                href="#!"
                                                className="dropdown-toggle"
                                                data-bs-toggle="dropdown"
                                            >
                                                👋 {userName}
                                            </a>

                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <NavLink className="dropdown-item" to="/user_profile">
                                                        Manage Profile
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <button className='btn-danger ' onClick={handleLogout}>Logout</button>

                                                </li>
                                            </ul>
                                        </li>

                                        {/* MOBILE MENU ICON */}
                                        <li className="d-inline-block d-md-none ml-md-0">
                                            <button
                                                className="site-menu-toggle  js-menu-toggle"
                                                onClick={() => setMobileMenu(!mobileMenu)}
                                            >
                                                <span className="icon-menu"></span>
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NAVIGATION */}
            <nav
                className={`site-navigation text-right text-md-center ${mobileMenu ? 'active' : ''
                    }`}
                role="navigation"
            >
                <div className="container">
                    <ul className={`site-menu js-clone-nav ${mobileMenu ? 'd-none' : 'd-none'} d-md-block`}>
                        <li><NavLink to="/" onClick={() => setMobileMenu(false)}>Home</NavLink></li>
                        <li><NavLink to="/about" onClick={() => setMobileMenu(false)}>About</NavLink></li>
                        <li><NavLink to="/shop" onClick={() => setMobileMenu(false)}>Shop</NavLink></li>
                        <li><NavLink to="/cart" onClick={() => setMobileMenu(false)}>Cart</NavLink></li>
                        <li><NavLink to="/contact" onClick={() => setMobileMenu(false)}>Contact</NavLink></li>
                    </ul>
                </div>
            </nav>

        </header>
    );
};

export default Header;
