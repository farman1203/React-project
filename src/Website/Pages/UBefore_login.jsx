import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const UBefore_login = () => {

    const s_id = sessionStorage.getItem ("s_id");

  return (
    <div>
        {
            s_id ? <Navigate to='/' /> : <Outlet/>
        }
    </div>
  )
}

export default UBefore_login
