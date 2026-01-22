import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const UAfter_login = () => {

    const s_id = sessionStorage.getItem("s_id");

  return (
    <div>
        {
            s_id ? <Outlet /> : <Navigate to="/" />
        }
    </div>
  )
}

export default UAfter_login
