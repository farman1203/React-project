import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  // 🔹 Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const Id = sessionStorage.getItem("s_id") || 1; // demo
        const res = await axios.get(`http://localhost:3001/Users/${Id}`);
        setProfile(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // 🔹 Update profile
  const handleUpdate = async () => {
    try {
      const Id = sessionStorage.getItem("s_id") || 1;
      await axios.put(`http://localhost:3001/Users/${Id}`, profile);
      toast.success("Profile updated successfully ✅");
      setEditMode(false);
    } catch (error) {
      alert("Failed to update profile ❌");
    }
  };

  if (loading) {
    return <h3 style={{ padding: 20 }}>Loading profile...</h3>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Manage Profile</h1>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {profile.fullName?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 style={styles.name}>{profile.fullName}</h2>
            <p style={styles.email}>{profile.email}</p>
          </div>

          <button
            style={editMode ? styles.cancelBtn : styles.editBtn}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div style={styles.form}>
          <Input
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Email"
            name="email"
            value={profile.email}
            disabled={!editMode}
          />

          <Input
            label="Phone"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!editMode}
          />

          <Input
            label="Address"
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!editMode}
          />


          {editMode && (
            <button style={styles.saveBtn} onClick={handleUpdate}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable Input Component
const Input = ({ label, ...props }) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <input style={styles.input} {...props} />
  </div>
);

// 🎨 Styles (Shoppers theme inspired)
const styles = {
  container: {
    padding: "30px",
    background: "#f8f9fa",
    minHeight: "100vh",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    maxWidth: "800px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },
  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#7971ea",
    color: "#fff",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
  name: {
    margin: 0,
    fontSize: "22px",
  },
  email: {
    margin: 0,
    color: "#6c757d",
  },
  editBtn: {
    marginLeft: "auto",
    background: "#7971ea",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cancelBtn: {
    marginLeft: "auto",
    background: "#dee2e6",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ced4da",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  saveBtn: {
    marginTop: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default ManageProfile;
