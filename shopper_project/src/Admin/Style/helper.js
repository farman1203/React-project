export const getStatusStyle = (status) => {
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

export const getRoleStyle = (role) => {
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