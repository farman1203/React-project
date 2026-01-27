import React, { useState } from 'react';
import { Eye, EyeOff, ShoppingBag, Mail, Lock, User, Check } from 'lucide-react';
import { Link, redirect, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';

// Main App Component
const Login = () => {

  const [currentPage, setCurrentPage] = useState('login');


  return (
    <div style={styles.app}>
      {currentPage === 'login' ? (
        <LoginPage onNavigateToRegister={() => setCurrentPage('register')} />
      ) : (
        <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
};

// Reusable Input Component
const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  name
}) => {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrapper}>
        {Icon && (
          <div style={styles.inputIcon}>
            <Icon size={20} />
          </div>
        )}
        <input
          type={showPasswordToggle && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            ...styles.input,
            paddingLeft: Icon ? '44px' : '16px',
            paddingRight: showPasswordToggle ? '44px' : '16px',
            borderColor: error ? '#f56565' : '#e2e8f0'
          }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            style={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

// Reusable Button Component
const Button = ({ children, onClick, variant = 'primary', fullWidth }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;

  const hoverStyle = variant === 'primary'
    ? { backgroundColor: '#6960d9', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(121, 113, 234, 0.3)' }
    : { backgroundColor: '#edf2f7', borderColor: '#cbd5e0' };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...buttonStyle,
        width: fullWidth ? '100%' : 'auto',
        ...(isHovered ? hoverStyle : {})
      }}
    >
      {children}
    </button>
  );
};

// Alert Component
const Alert = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const alertStyle = type === 'success' ? styles.successAlert : styles.errorAlert;

  return (
    <div style={alertStyle}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={styles.alertClose}>×</button>
      )}
    </div>
  );
};



// Login Page Component
const LoginPage = ({ onNavigateToRegister }) => {

  const redirect = useNavigate();

  const [obj_cate, setData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleChange = (e) => {
    setData({ ...obj_cate, [e.target.name]: e.target.value });
    console.log(obj_cate);
  }

  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (validateForm()) {
      const obj = await axios.get(`https://react-project-zdz9.onrender.com/Users?email=${obj_cate.email}`);
      //console.log(obj.data);
      if (obj.data.length > 0) {
        if (obj.data[0].password == obj_cate.password) {
          if (obj.data[0].status == "Unblock") {
            //session created
            const user = obj.data[0];

            // 🔥 ADD THIS (MOST IMPORTANT)
            localStorage.setItem(
              "user",
              JSON.stringify({
                id: user.id,
                name: user.fullName,
                email: user.email
              })
            );

            // optional (admin / header ke liye)
            sessionStorage.setItem('s_id', user.id);
            sessionStorage.setItem('s_name', user.fullName);

            toast.success('Login Success');
            redirect('/shop'); // ya redirect(-1)

          }
          else {
            toast.error('Login Failed Due to Blocked Account');
            return false;
          }
        }
        else {
          toast.error('Login Failed Due to Wrong Password');
          return false;
        }
      }
      else {
        toast.error('Login Failed Due to Wrong Email');
        return false;
      }
      return false;
    }
  }

  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  //   rememberMe: false
  // });


  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  // const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData(prev => ({
  //     ...prev,
  //     [name]: type === 'checkbox' ? checked : value
  //   }));
  //   if (errors[name]) {
  //     setErrors(prev => ({ ...prev, [name]: '' }));
  //   }
  // };

  const validateForm = () => {
    const newErrors = {};

    if (!obj_cate.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(obj_cate.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!obj_cate.password) {
      newErrors.password = 'Password is required';
    } else if (obj_cate.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const obj=await axios.get(`http://localhost:3000/?email=${obj_cate.email}`); 
  //   if (obj.data.length>validateForm()) {
  //     console.log('Login Form Data:', formData);
  //     setAlert({
  //       show: true,
  //       message: 'Login successful! Redirecting...',
  //       type: 'success' 
  //     });

  //     setTimeout(() => {
  //       setAlert({ show: false, message: '', type: '' });
  //     }, 2000);
  //     redirect('/');
  //   } else {
  //     setAlert({
  //       show: true,
  //       message: 'Please fix the errors before submitting',
  //       type: 'error'
  //     });
  //   }
  // };

  return (
    <div className='container'>
      <div style={styles.authContainer}>
        <div style={styles.authLeft}>
          <div style={styles.authLeftContent}>
            <div style={styles.brandSection}>
              <div style={styles.brandIcon}>
                <ShoppingBag size={40} color="#fff" />
              </div>
              <h1 style={styles.brandTitle}>Shoppers</h1>
              <p style={styles.brandSubtitle}>Your Perfect Shopping Destination</p>
            </div>
            <div style={styles.featureList}>
              <div style={styles.featureItem}>
                <Check size={24} color="#7971ea" />
                <span>Free Shipping Worldwide</span>
              </div>
              <div style={styles.featureItem}>
                <Check size={24} color="#7971ea" />
                <span>Easy Returns & Refunds</span>
              </div>
              <div style={styles.featureItem}>
                <Check size={24} color="#7971ea" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.authRight}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formSubtitle}>Please login to your account</p>
            </div>

            {alert.show && (
              <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ show: false, message: '', type: '' })}
              />
            )}

            <div style={styles.formWrapper}>
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={obj_cate.email}
                onChange={handleChange}
                placeholder="Enter your email"
                icon={Mail}
                error={errors.email}
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={obj_cate.password}
                onChange={handleChange}
                placeholder="Enter your password"
                icon={Lock}
                error={errors.password}
                showPasswordToggle
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              <div style={styles.formOptions}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={obj_cate.rememberMe}
                    onChange={handleChange}
                    style={styles.checkbox}
                  />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" style={styles.forgotLink} onClick={(e) => e.preventDefault()}>
                  Forgot Password?
                </a>
              </div>

              <Button onClick={handleSubmit} variant="primary" fullWidth>
                Sign In
              </Button>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine}></div>
            </div>

            <div style={styles.socialButtons}>
              <SocialButton>
                <GoogleIcon />
                Continue with Google
              </SocialButton>
            </div>

            <p style={styles.switchAuthText}>
              Don't have an account?{' '}
              <button
                onClick={onNavigateToRegister}
                style={styles.switchAuthLink}
              >
                Sign Up
              </button>
              <br />
              <button
                onClick={() => navigate("/alogin")}
                style={styles.switchAuthLink}
              >
                Admin Login Here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};



// Register Page Component
const RegisterPage = ({ onNavigateToLogin }) => {


  const [obj_cate, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "Unblock"
  });

  //  const handleChange=(e)=>{
  //     setData({...obj_cate,id:new Date().getTime().toString(),status:"Unblock",[e.target.name]:e.target.value});
  //     console.log(obj_cate);
  //  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const obj = await axios.post(`https://react-project-zdz9.onrender.com/Users`, obj_cate);
      setData({ ...obj_cate, fullName: "", email: "", password: "", conpassword: "" });
      setAlert({
        show: true,
        message: 'Account created successfully! Redirecting to login...',
        type: 'success'
      });
      toast.success('Account created successfully!');

      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
        onNavigateToLogin();
      }, 2000);
    } else {
      setAlert({
        show: true,
        message: 'Please fix the errors before submitting',
        type: 'error'
      });
    }
  };




  // const [formData, setFormData] = useState({
  //   fullName: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: ''
  // });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!obj_cate.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (obj_cate.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!obj_cate.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(obj_cate.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!obj_cate.password) {
      newErrors.password = 'Password is required';
    } else if (obj_cate.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!obj_cate.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (obj_cate.password !== obj_cate.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     console.log('Register Form Data:', formData);
  //     setAlert({
  //       show: true,
  //       message: 'Account created successfully! Redirecting to login...',
  //       type: 'success'
  //     });

  //     setTimeout(() => {
  //       setAlert({ show: false, message: '', type: '' });
  //       onNavigateToLogin();
  //     }, 2000);
  //   } else {
  //     setAlert({
  //       show: true,
  //       message: 'Please fix the errors before submitting',
  //       type: 'error'
  //     });
  //   }
  // };

  return (
    <div className='container' style={styles.authContainer}>
      <div style={styles.authLeft}>
        <div style={styles.authLeftContent}>
          <div style={styles.brandSection}>
            <div style={styles.brandIcon}>
              <ShoppingBag size={40} color="#fff" />
            </div>
            <h1 style={styles.brandTitle}>Shoppers</h1>
            <p style={styles.brandSubtitle}>Join Our Shopping Community</p>
          </div>
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <Check size={24} color="#7971ea" />
              <span>Exclusive Member Discounts</span>
            </div>
            <div style={styles.featureItem}>
              <Check size={24} color="#7971ea" />
              <span>Early Access to Sales</span>
            </div>
            <div style={styles.featureItem}>
              <Check size={24} color="#7971ea" />
              <span>Personalized Recommendations</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.authRight}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create Account</h2>
            <p style={styles.formSubtitle}>Sign up to start shopping</p>
          </div>

          {alert.show && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ show: false, message: '', type: '' })}
            />
          )}

          <div style={styles.formWrapper}>
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={obj_cate.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={User}
              error={errors.fullName}
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={obj_cate.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={Mail}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={obj_cate.password}
              onChange={handleChange}
              placeholder="Create a password"
              icon={Lock}
              error={errors.password}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={obj_cate.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={Lock}
              error={errors.confirmPassword}
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button onClick={handleSubmit} variant="primary" fullWidth>
              Create Account
            </Button>
          </div>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>OR</span>
            <div style={styles.dividerLine}></div>
          </div>

          <div style={styles.socialButtons}>
            <SocialButton>
              <GoogleIcon />
              Sign up with Google
            </SocialButton>
          </div>

          <p style={styles.switchAuthText}>
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              style={styles.switchAuthLink}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Social Button Component
const SocialButton = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.socialButton,
        ...(isHovered ? { backgroundColor: '#f7fafc', borderColor: '#cbd5e0' } : {})
      }}
    >
      {children}
    </button>
  );
};

// Google Icon SVG Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Styles Object
const isMobile = window.innerWidth <= 768;
const styles = {
  app: {
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  authContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: isMobile ? 'column' : 'row',
  },

  authLeft: {
    flex: '1',
    background: 'linear-gradient(135deg, #7971ea 0%, #5b54d6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    overflow: 'hidden',
  },
  authLeftContent: {
    maxWidth: '500px',
    color: '#fff',
    zIndex: 1,
  },
  brandSection: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  brandIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    backdropFilter: 'blur(10px)',
  },
  brandTitle: {
    fontSize: '48px',
    fontWeight: '700',
    margin: '0 0 12px 0',
    letterSpacing: '-1px',
  },
  brandSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    margin: 0,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '16px 20px',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  authRight: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#fff',
    overflowY: 'auto',
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
  },
  formHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 8px 0',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#718096',
    margin: 0,
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#a0aec0',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  passwordToggle: {
    position: 'absolute',
    right: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#a0aec0',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  errorText: {
    fontSize: '13px',
    color: '#f56565',
    marginTop: '4px',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#4a5568',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#7971ea',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#7971ea',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  primaryButton: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#7971ea',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
  },
  secondaryButton: {
    width: '100%',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#2d3748',
    backgroundColor: '#f7fafc',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: '14px',
    color: '#a0aec0',
    fontWeight: '500',
  },
  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  socialButton: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#2d3748',
    backgroundColor: '#fff',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  switchAuthText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#718096',
    marginTop: '24px',
  },
  switchAuthLink: {
    color: '#7971ea',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  successAlert: {
    backgroundColor: '#c6f6d5',
    color: '#22543d',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #9ae6b4',
  },
  errorAlert: {
    backgroundColor: '#fed7d7',
    color: '#742a2a',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #fc8181',
  },
  alertClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0',
    lineHeight: '1',
  },
};

export default Login;