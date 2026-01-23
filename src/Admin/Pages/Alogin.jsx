import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import axios from 'axios';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import { toast } from 'react-toastify';


// Main App Component
const Alogin = () => {

  const [adminName, setAdminName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editUserId, setUserId] = useState(null);
  const [editCategorieId, setCategorieId] = useState(null);


  useEffect(() => {
    const name = sessionStorage.getItem("s_aname");
    if (name) {
      setAdminName(name);
      setIsLoggedIn(true);
    }
  }, []);


  if (!isLoggedIn) {
    return <LoginPage onLogin={(name) => { setIsLoggedIn(true); setAdminName(name); }} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'products': return <ProductsList onAdd={() => setCurrentPage('add-product')} setCurrentPage={setCurrentPage} setEditProductId={setEditProductId} />;
      case 'add-product': return <AddProduct onBack={() => setCurrentPage('products')} />;
      case 'edit-product': return <EditProduct productId={editProductId} onBack={() => setCurrentPage('products')} />;
      case 'orders': return <OrdersList   onAdd={() => setCurrentPage()} setCurrentPage={setCurrentPage} setEditOrderId={setEditOrderId}/>;
      case 'edit-order': return <EditOrder OrderId={editOrderId} onBack={() => setCurrentPage('Orders')} />;
      case 'users': return <UsersList onAdd={() => setCurrentPage('add-users')} setCurrentPage={setCurrentPage} setUserId={setUserId} />;
      case 'add-users': return <AddUsers onBack={() => setCurrentPage('users')} />;
      case 'edit-users': return <EditUsers id={editUserId} onBack={() => setCurrentPage('users')} />;
      case 'categories': return <CategoriesList onAdd={() => setCurrentPage('edit-users')} setCurrentPage={setCurrentPage} setCategorieId={setCategorieId} />;
      case 'add-categories': return <AddCategories onBack={() => setCurrentPage('categories')} />;
      case 'edit-categories': return <EditCategories id={editCategorieId} onBack={() => setCurrentPage('categories')} />;
      case 'Customer': return <ReviewsList />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
      />
      <div style={styles.mainContent}>

        <TopNavbar
          adminName={adminName}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          onLogout={() => {
            sessionStorage.clear();
            setIsLoggedIn(false);
          }}
        />

        <div style={styles.pageContent}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.get(
      `https://react-project-zdz9.onrender.com/Admin?email=${formData.email}`
    );

    if (res.data.length === 0) {
      toast.error("Invalid Email");
      return;
    }

    if (res.data[0].password !== formData.password) {
      toast.error("Wrong Password");
      return;
    }

    // ✅ session
    sessionStorage.setItem("s_aid", res.data[0].id);
    sessionStorage.setItem("s_aname", res.data[0].name);

    // ✅ parent ko inform
    onLogin(res.data[0].name);
    navigate("/alogin");
    toast.success('login success')
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <h1 style={styles.loginLogo}>Shoppers</h1>
          <p style={styles.loginSubtitle}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.loginButton}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};


// Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },
    { id: 'Customer', label: 'Feedback', icon: <Star size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div style={{ ...styles.sidebar, width: isOpen ? '260px' : '0', overflow: 'hidden' }}>
      <div style={styles.sidebarHeader}>
        <h2 style={styles.sidebarLogo}>Shoppers</h2>
        <p style={styles.sidebarSubtitle}>Admin Dashboard</p>
      </div>
      <nav style={styles.sidebarNav}>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            style={{
              ...styles.menuItem,
              backgroundColor: currentPage === item.id ? '#7971ea' : 'transparent',
              color: currentPage === item.id ? '#fff' : '#8492a6'
            }}
          >
            {item.icon}
            <span style={styles.menuLabel}>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

// Top Navbar Component
const TopNavbar = ({
  adminName,
  onToggleSidebar,
  showProfileMenu,
  setShowProfileMenu,
  onLogout
}) => {
  return (
    <div style={styles.topNavbar}>

      <div style={styles.navLeft}>
        <button onClick={onToggleSidebar} style={styles.menuToggle}>☰</button>
      </div>

      <div style={styles.navRight}>
        <button style={styles.iconButton}>
          <Bell size={20} />
        </button>

        <div style={styles.profileSection}>


          <div
            style={styles.profileTrigger}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div style={styles.avatar}>
              {adminName?.charAt(0).toUpperCase()}
            </div>

            <span style={styles.profileName}>{adminName}</span>

            <ChevronDown size={16} />
          </div>

          {showProfileMenu && (
            <div style={styles.profileMenu}>
              <div style={styles.profileMenuItem}>Profile</div>
              <div style={styles.profileMenuItem}>Settings</div>
              <div
                style={{ ...styles.profileMenuItem, color: "red" }}
                onClick={onLogout}
              >
                Logout
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


// Dashboard Page
<Dashboard />

// Products List Page
const ProductsList = ({ onAdd, setCurrentPage, setEditProductId }) => {

  const [data1, setData1] = useState([])

  useEffect(() => {
    fetch_data1();
  }, [])

  const fetch_data1 = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Products`);
    setData1(obj.data)
  }

  const redirect = useNavigate();
  const deletehandle = async (id) => {

    const check = confirm('Are you Confirm to delete this product');
    if (check) {
      const obj = await axios.delete(`https://react-project-zdz9.onrender.com/Products/${id}`);
      fetch_data1();
      toast.error('product delete succeessfully!!', {
        position: "bottom-right"
      });
    }
    return false;
  }

  const [searchTerm, setSearchTerm] = useState('');


  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Products Management</h1>
        <button style={styles.primaryButton} onClick={onAdd}>
          <Plus size={18} />
          Add New Product
        </button>

      </div>

      <div style={styles.card}>
        <div style={styles.tableControls}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput2}
          />
        </div>

        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data1.map((value) => (
              <tr key={value.id} style={styles.tableRow}>
                <td style={styles.td}>
                  <img src={value.image} alt={value.name} style={styles.productImage} />
                </td>
                <td style={styles.td}>{value.name}</td>
                <td style={styles.td}>{value.category}</td>
                <td style={styles.td}>${value.price}</td>
                <td style={styles.td}>{value.stock}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(value.status)}>{value.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button style={styles.iconBtn} title="View">
                      <Eye size={16} />
                    </button>
                    <button
                      style={styles.iconBtn}
                      title="Edit"
                      onClick={() => {
                        setEditProductId(value.id);
                        setCurrentPage('edit-product');
                      }}
                    >
                      <Edit size={16} />
                    </button>

                    <button style={styles.iconBtnDanger} title="Delete" onClick={() => deletehandle(value.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Add Product Page
const AddProduct = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    fetch_data();
  }, []);

  const [cate, setCate] = useState([]);
  const fetch_data = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Categories`);
    setCate(obj.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = await axios.post(`https://react-project-zdz9.onrender.com/Products`, formData);
    setFormData({ ...formData, name: "", category: "", price: "", stock: "", image: "", description: "", status: "" });
    toast.success('Product added successfully!');
    onBack();
  };

  const changeHandel = (e) => {
    setFormData({ ...formData, id: new Date().getTime().toString(), [e.target.name]: e.target.value });
    console.log(formData);
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Products</button>
      <h1 style={styles.pageTitle}>Add New Product</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={changeHandel}
                style={styles.input}
                placeholder="Enter product name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={formData.category}
                onChange={changeHandel}
                name='category'
                style={styles.input}
                required
              >
                <option value="">Select category</option>
                {cate.map((value) => {
                  return (
                    <option value={value.name}>
                      {value.name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                name='price'
                onChange={changeHandel}
                style={styles.input}
                placeholder="0.00"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Quantity</label>
              <input
                type="number"
                value={formData.stock}
                onChange={changeHandel}
                name='stock'
                style={styles.input}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input type='url' onChange={changeHandel} value={formData.image} name='image' placeholder='Enter Image URL' />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={changeHandel}
              name='description'
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Enter product description"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={changeHandel}
              name='status'
              style={styles.input}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button style={styles.primaryButton} type='submit' >
              <Plus size={18} />
              Add New Product
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Product Page
const EditProduct = ({ productId, onBack }) => {

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    image: '',
    description: '',
    status: 'Active'
  });

  const [cate, setCate] = useState([]);

  // 🔹 fetch categories
  useEffect(() => {
    fetch_categories();
    fetch_product();
  }, []);

  const fetch_categories = async () => {
    const res = await axios.get(`https://react-project-zdz9.onrender.com/Categories`);
    setCate(res.data);
  };

  // 🔹 fetch single product
  const fetch_product = async () => {
    const res = await axios.get(`https://react-project-zdz9.onrender.com/Products/${productId}`);
    setFormData(res.data);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `https://react-project-zdz9.onrender.com/Products/${productId}`,
      formData
    );
    toast.success("Product updated successfully!");
    onBack();
  };

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Products</button>
      <h1 style={styles.pageTitle}>Edit Product</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={changeHandler}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={changeHandler}
                style={styles.input}
              >
                <option value="">Select Category</option>
                {cate.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={changeHandler}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={changeHandler}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={changeHandler}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={changeHandler}
              style={{ ...styles.input, minHeight: '100px' }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={changeHandler}
              style={styles.input}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button type="submit" style={styles.primaryButton}>
              Update Product
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};



// Orders List Page
const OrdersList = ({ onAdd, setCurrentPage, setEditOrderId }) => {

  const [dataorder, setOrder] = useState([])

  useEffect(() => {
    fetch_order();
  }, [])

  const fetch_order = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Orders`);
    setOrder(obj.data)
  }

  return (
    <div>
      <h1 style={styles.pageTitle}>Orders Management</h1>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataorder.map((value) => (
              <tr key={value.id} style={styles.tableRow}>
                <td style={styles.td}>{value.id}</td>
                <td style={styles.td}>{value.customer}</td>
                <td style={styles.td}>{value.date}</td>
                <td style={styles.td}>{value.items.qty}</td>
                <td style={styles.td}>₹{value.total}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(value.status)}>{value.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button style={styles.iconBtn} title="View">
                      <Eye size={16} />
                    </button>
                     <button
                      style={styles.iconBtn}
                      title="Edit"
                      onClick={() => {
                        setEditOrderId(value.id);
                        setCurrentPage('edit-order');
                      }}
                    >
                      <Edit size={16} />  
                    </button> 

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Edit order Page
const EditOrder = ({ OrderId, onBack }) => {

  const [order, setOrder] = useState({
    customer: "",
    date:"",
    status: "",
  });

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const res = await axios.get(
      `https://react-project-zdz9.onrender.com/Orders/${OrderId}`
    );
    setOrder(res.data);
  };

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    await axios.put(
      `https://react-project-zdz9.onrender.com/Orders/${OrderId}`,
      order
    );

    alert("Order Updated Successfully");
    onBack();
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Edit Order</h1>

      <div style={styles.card}>
        <form onSubmit={handleUpdate}>

          {/* CUSTOMER */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer Name</label>
            <input
              type="text"
              name="customer"
              value={order.customer}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* STATUS */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Order Status</label>
            <select
              name="status"
              value={order.status}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* BUTTON */}
          <button style={styles.saveBtn}>Update Order</button>
        </form>
      </div>
    </div>
  );
};

// Users List Page
const UsersList = ({ onAdd, setCurrentPage, setUserId }) => {

  const [user, setUsers] = useState([]);

  const fetch_Users = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Users`);
    setUsers(obj.data)
  }

  useEffect(() => {
    fetch_Users();
  }, [])

  const deletehandle = async (id) => {
    const check = confirm('are you confirm to delete this user')
    if (check) {
      const obj = await axios.delete(`https://react-project-zdz9.onrender.com/Users/${id}`);
      fetch_Users();
    }
    return false;
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Users Management</h1>
        <button style={styles.primaryButton} onClick={onAdd}>
          <Plus size={16} />
          Add Users
        </button>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Orders</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {user.map(user => (
              <tr key={user.id} style={styles.tableRow}>
                <td style={styles.td}>{user.fullName}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={getRoleStyle(user.role)}>{user.role}</span>
                </td>
                <td style={styles.td}>{user.joined}</td>
                <td style={styles.td}>{user.orders}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button style={styles.iconBtn} title="View">
                      <Eye size={16} />
                    </button>
                    <button
                      style={styles.iconBtn}
                      title="Edit"
                      onClick={() => {
                        setUserId(user.id);
                        setCurrentPage('edit-users');
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button style={styles.iconBtnDanger} onClick={() => deletehandle(user.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



// Add Users Page
const AddUsers = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    products: '',
    email: '',
    status: 'Active'
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = await axios.post(`https://react-project-zdz9.onrender.com/Users`, formData);
    setFormData({ ...formData, name: "", email: "", role: "", joined: "" });
    toast.success('Categories added successfully!');
    onBack();
  };

  const changeHandel = (e) => {
    setFormData({ ...formData, id: new Date().getTime().toString(), [e.target.name]: e.target.value });
    // console.log(formData);
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Users</button>
      <h1 style={styles.pageTitle}>Add New Users</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>User Name</label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={changeHandel}
                style={styles.input}
                placeholder="Enter User name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="text"
                value={formData.email}
                name='email'
                onChange={changeHandel}
                style={styles.input}
                placeholder="Add Email id"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={formData.role}
              name='role'
              onChange={changeHandel}
              style={styles.input}
              placeholder="Add User role"
              required
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button style={styles.primaryButton} type='submit' >
              <Plus size={18} />
              Add New User
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

// EDIT Users Page
const EditUsers = ({ id, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    status: 'Active'
  });

  useEffect(() => {
    fetch_edituser();
  }, [])

  const fetch_edituser = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Users/${id}`);
    setFormData(obj.data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = await axios.put(`https://react-project-zdz9.onrender.com/Users/${id}`, formData);
    toast.success('User Updated successfully!');
    onBack();
  };

  const changeHandel = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(formData);
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Users</button>
      <h1 style={styles.pageTitle}>Edit Users</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>User Name</label>
              <input
                type="text"
                value={formData.fullName}
                name="fullName"
                onChange={changeHandel}
                style={styles.input}
                placeholder="Enter User name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="text"
                value={formData.email}
                name='email'
                onChange={changeHandel}
                style={styles.input}
                placeholder="Add Email id"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={formData.role}
              name='role'
              onChange={changeHandel}
              style={styles.input}
              placeholder="Add User role"
              required
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button style={styles.primaryButton} type='submit' >
              <Plus size={18} />
              Update User
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};


// Categories List Page
const CategoriesList = ({ onAdd, setCurrentPage, setCategorieId }) => {

  useEffect(() => {
    fetch_data();
  }, []);

  const [cate, setCate] = useState([]);
  const fetch_data = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Categories`);
    setCate(obj.data)
  }

  const deletehandle = async (id) => {
    const check = confirm('Are you sure Delete category')
    if (check) {
      const obj = await axios.delete(`https://react-project-zdz9.onrender.com/Categories/${id}`)
    }
    else {

    }
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Categories Management</h1>
        <button style={styles.primaryButton} onClick={onAdd}>
          <Plus size={18} />
          Add Category
        </button>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>Category Name</th>
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cate.map(category => (
              <tr key={category.id} style={styles.tableRow}>
                <td style={styles.td}>{category.name}</td>
                <td style={styles.td}>{category.products}</td>
                <td style={styles.td}>
                  <span style={getStatusStyle(category.status)}>{category.status}</span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.iconBtn}
                      title="Edit"
                      onClick={() => {
                        setCategorieId(category.id);
                        setCurrentPage('edit-categories');
                      }}
                    >
                      <Edit size={16} />
                    </button>
                    <button style={styles.iconBtnDanger} onClick={() => deletehandle(category.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};




// Add Categories Page
const AddCategories = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    products: '',
    status: 'Active'
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = await axios.post(`https://react-project-zdz9.onrender.com/Categories`, formData);
    setFormData({ ...formData, name: "", products: "", status: "" });
    toast.success('Categories added successfully!');
    onBack();
  };

  const changeHandel = (e) => {
    setFormData({ ...formData, id: new Date().getTime().toString(), [e.target.name]: e.target.value });
    console.log(formData);
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Categories</button>
      <h1 style={styles.pageTitle}>Add New Categories</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Categories Name</label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={changeHandel}
                style={styles.input}
                placeholder="Enter product name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Products</label>
              <input
                type="text"
                value={formData.products}
                name='products'
                onChange={changeHandel}
                style={styles.input}
                placeholder="Add Products"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={changeHandel}
              name='description'
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Enter product description"
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button style={styles.primaryButton} type='submit' >
              <Plus size={18} />
              Add New Categories
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};
// Edit Categories Page
const EditCategories = ({ id, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    products: '',
    status: 'Active'
  });

  useEffect(() => {
    fetch_categories();
  }, [])

  const fetch_categories = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Categories/${id}`)
    setFormData(obj.data)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = await axios.put(`https://react-project-zdz9.onrender.com/Categories/${id}`, formData);
    toast.success('Categories Updated successfully!');
    onBack();
  };

  const changeHandel = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  }

  return (
    <div>
      <button onClick={onBack} style={styles.backButton}>← Back to Categories</button>
      <h1 style={styles.pageTitle}>Edit Categories</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Categories Name</label>
              <input
                type="text"
                value={formData.name}
                name="name"
                onChange={changeHandel}
                style={styles.input}
                placeholder="Enter product name"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Products</label>
              <input
                type="text"
                value={formData.products}
                name='products'
                onChange={changeHandel}
                style={styles.input}
                placeholder="Add Products"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={changeHandel}
              name='description'
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Enter product description"
            />
          </div>

          <div style={styles.formActions}>
            <button type="button" onClick={onBack} style={styles.secondaryButton}>
              Cancel
            </button>
            <button style={styles.primaryButton} type='submit' >
              <Plus size={18} />
              Edit Categories
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

// Reviews List Page
const ReviewsList = () => {


  useEffect(() => {
    fetch_data();
  }, []);

  const [cate, setCate] = useState([]);
  const fetch_data = async () => {
    const obj = await axios.get(`https://react-project-zdz9.onrender.com/Customer`);
    setCate(obj.data)
  }

  const deletehandle = async (id) => {
    const check = confirm('Are you sure Delete message')
    if (check) {
      const obj = await axios.delete(`https://react-project-zdz9.onrender.com/Customer/${id}`)
    }
    else {

    }
  }


  return (
    <div>
      <h1 style={styles.pageTitle}>Customer Management</h1>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>

              <th style={styles.th}>Customer</th>
              <th style={styles.th}>email</th>
              <th style={styles.th}>Comment</th>

              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cate.map(review => (
              <tr key={review.id} style={styles.tableRow}>

                <td style={styles.td}>{review.fname} {review.lname}</td>
                <td style={styles.td}>{review.email}</td>
                <td style={styles.td}>{review.message}</td>

                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button style={styles.iconBtn} title="View">
                      <Eye size={16} />
                    </button>
                    <button style={styles.iconBtnDanger} title="Delete" onClick={() => deletehandle(review.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// // Settings Page
// const Settings = () => {
//   return (
//     <div>
//       <h1 style={styles.pageTitle}>Settings</h1>
//       <div style={styles.card}>
//         <h3 style={styles.cardTitle}>General Settings</h3>
//         <form style={styles.form}>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Store Name</label>
//             <input
//               type="text"
//               defaultValue="Shoppers"
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Store Email</label>
//             <input
//               type="email"
//               defaultValue="support@shoppers.com"
//               style={styles.input}
//             />
//           </div>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Currency</label>
//             <select style={styles.input}>
//               <option value="USD">USD ($)</option>
//               <option value="EUR">EUR (€)</option>
//               <option value="GBP">GBP (£)</option>
//             </select>
//           </div>
//           <div style={styles.formActions}>
//             <button type="submit" style={styles.primaryButton}>
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// Helper Functions
const getStatusStyle = (status) => {
  const baseStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  };

  if (status === 'Active' || status === 'Delivered') {
    return { ...baseStyle, backgroundColor: '#c6f6d5', color: '#22543d' };
  } else if (status === 'Pending') {
    return { ...baseStyle, backgroundColor: '#feebc8', color: '#7c2d12' };
  } else if (status === 'Shipped') {
    return { ...baseStyle, backgroundColor: '#bee3f8', color: '#1e4e8c' };
  } else {
    return { ...baseStyle, backgroundColor: '#fed7d7', color: '#742a2a' };
  }
};

const getRoleStyle = (role) => {
  const baseStyle = {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  };

  if (role === 'Admin') {
    return { ...baseStyle, backgroundColor: '#e9d8fd', color: '#44337a' };
  } else {
    return { ...baseStyle, backgroundColor: '#e2e8f0', color: '#2d3748' };
  }
};

// Styles Object
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f7fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  sidebar: {
    backgroundColor: '#2d3748',
    color: '#fff',
    transition: 'width 0.3s ease',
    overflowY: 'auto',
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #4a5568',
  },
  sidebarLogo: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    color: '#7971ea',
  },
  sidebarSubtitle: {
    fontSize: '12px',
    color: '#a0aec0',
    margin: '4px 0 0 0',
  },
  sidebarNav: {
    padding: '20px 0',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    gap: '12px',
  },
  menuLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topNavbar: {
    height: '64px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#4a5568',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f7fafc',
    padding: '8px 16px',
    borderRadius: '8px',
    width: '300px',
  },
  searchInput: {
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
  },
  searchInput2: {
    border: '1px solid #e2e8f0',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconButton: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: '#4a5568',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#f56565',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 5px',
    borderRadius: '10px',
  },
  profileSection: {
    position: 'relative',
  },
  profileTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#7971ea',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
  profileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2d3748',
  },
  profileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '8px',
    backgroundColor: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minWidth: '180px',
    zIndex: 1000,
  },
  profileMenuItem: {
    padding: '12px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#2d3748',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  pageContent: {
    flex: 1,
    overflow: 'auto',
    padding: '24px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: '24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  statContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: '14px',
    color: '#718096',
    margin: '0 0 8px 0',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 4px 0',
  },
  statChange: {
    fontSize: '12px',
    color: '#48bb78',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '16px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#2d3748',
  },
  primaryButton: {
    backgroundColor: '#7971ea',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#7971ea',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '16px',
    padding: '8px 0',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  iconBtn: {
    background: 'none',
    border: '1px solid #e2e8f0',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#4a5568',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  iconBtnDanger: {
    background: 'none',
    border: '1px solid #fed7d7',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#f56565',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  productImage: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  tableControls: {
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#2d3748',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  rating: {
    fontSize: '16px',
  },
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
    padding: '20px',
  },
  loginCard: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  loginLogo: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#7971ea',
    margin: '0 0 8px 0',
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#718096',
    margin: 0,
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loginButton: {
    backgroundColor: '#7971ea',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  loginHint: {
    fontSize: '12px',
    color: '#a0aec0',
    textAlign: 'center',
    margin: 0,
  },
};

export default Alogin;