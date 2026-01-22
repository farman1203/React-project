import React from 'react'
import { useEffect, useState } from 'react';
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
import TopNavbar from '../Component/Topnavbar';

// Dashboard Page
const Dashboard = () => {

  // states
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  // revenue calculation (TOP me rakho)
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // stats array (revenue ke BAAD)
  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue}`,
      icon: <DollarSign size={24} />,
      color: "#7971ea",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: <ShoppingCart size={24} />,
      color: "#48bb78",
    },
    {
      label: "Total Products",
      value: products.length,
      icon: <Package size={24} />,
      color: "#ed8936",
    },
    {
      label: "Total Users",
      value: users.length,
      icon: <Users size={24} />,
      color: "#4299e1",
    },
  ];


  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchDashboardData = async () => {
    try {
      const ordersRes = await axios.get("https://react-project-zdz9.onrender.com/Orders");
      const usersRes = await axios.get("https://react-project-zdz9.onrender.com/Users");
      const productsRes = await axios.get("https://react-project-zdz9.onrender.com/Products");

      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  return (
    <div>
        <TopNavbar/>
      <h1 style={styles.pageTitle}>Dashboard</h1>
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statContent}>
              <div>
                <p style={styles.statLabel}>{stat.label}</p>
                <h3 style={styles.statValue}>{stat.value}</h3>
                <span style={styles.statChange}>{stat.change} from last month</span>
              </div>
              <div style={{ ...styles.statIcon, backgroundColor: stat.color + '20', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.cardTitle}>Recent Orders</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id} style={styles.tableRow}>
                  <td style={styles.td}>{order.id}</td>
                  <td style={styles.td}>{order.customer}</td>
                  <td style={styles.td}>₹{order.total}</td>
                  <td style={styles.td}>
                    <span style={getStatusStyle(order.status)}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



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

export default Dashboard
