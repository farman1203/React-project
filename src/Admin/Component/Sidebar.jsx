import React from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Star,
  Settings
} from 'lucide-react';
import styles from '../Style/adminStyles';

const Sidebar = ({ currentPage, setCurrentPage, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'categories', label: 'Categories', icon: <FolderTree size={20} /> },
    { id: 'Customer', label: 'Customer', icon: <Star size={20} /> },
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

export default Sidebar;