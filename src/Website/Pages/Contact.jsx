import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {

    const [obj_cate, setData] = useState({
        fname: '',
        lname: '',
        email: '',
        message: ''
    });

    const changeHandel = (e) => {
        setData({ ...obj_cate, id: new Date().getTime().toString(), [e.target.name]: e.target.value });
        console.log(obj_cate);
    }

     const submitHandel = async (e) => {
        e.preventDefault();
        const obj = await axios.post(`http://localhost:3001/Customer`,obj_cate);
        setData({...obj_cate,fname:"",lname:"",email:"",message:""});
        alert('Message send success');
        return false;
    }


    return (
        <div>
            <div>
                <div className="bg-light py-3">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 mb-0"><Link to="/">Home</Link> <span className="mx-2 mb-0">/</span> <strong className="text-black">Contact</strong></div>
                        </div>
                    </div>
                </div>
                <div className="site-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <h2 className="h3 mb-3 text-black">Get In Touch</h2>
                            </div>
                            <div className="col-md-7">
                                <form action="#" onSubmit={submitHandel} method="post">
                                    <div className="p-3 p-lg-5 border">
                                        <div className="form-group row">
                                            <div className="col-md-6">
                                                <label htmlFor="c_fname" className="text-black">First Name <span className="text-danger">*</span></label>
                                                <input type="text" value={obj_cate.fname} onChange={changeHandel} className="form-control"  name="fname" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="c_lname" className="text-black">Last Name <span className="text-danger">*</span></label>
                                                <input type="text" value={obj_cate.lname} onChange={changeHandel} className="form-control" id="lname" name="lname" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <label htmlFor="c_email" className="text-black">Email <span className="text-danger">*</span></label>
                                                <input type="email" value={obj_cate.email} onChange={changeHandel}  className="form-control" id="c_email" name="email" placeholder />
                                            </div>
                                        </div>
                                        {/* <div className="form-group row">
                                            <div className="col-md-12">
                                                <label htmlFor="c_subject" className="text-black">Subject </label>
                                                <input type="text" className="form-control" id="c_subject" name="c_subject" />
                                            </div>
                                        </div> */}
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <label htmlFor="c_message" className="text-black">Message </label>
                                                <textarea name="message" value={obj_cate.message} onChange={changeHandel} id="c_message" cols={30} rows={7} className="form-control" defaultValue={""} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-lg-12">
                                                <input type="submit"  className="btn btn-primary btn-lg btn-block"  defaultValue="Send Message" />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="col-md-5 ml-auto">
                                <div className="p-4 border mb-3">
                                    <span className="d-block text-primary h6 text-uppercase">New York</span>
                                    <p className="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
                                </div>
                                <div className="p-4 border mb-3">
                                    <span className="d-block text-primary h6 text-uppercase">London</span>
                                    <p className="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
                                </div>
                                <div className="p-4 border mb-3">
                                    <span className="d-block text-primary h6 text-uppercase">Canada</span>
                                    <p className="mb-0">203 Fake St. Mountain View, San Francisco, California, USA</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
