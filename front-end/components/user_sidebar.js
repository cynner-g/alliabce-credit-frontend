import Cookies from 'js-cookie';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";


const UserSidebar = ({ data }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const resetPassword = async (e) => {

        e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        // const resUser = await fetch(`http://dev.alliancecredit.ca/user/reset-password`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         "full_name": fullNname,
        //         "email_id": emailID,
        //         "country_code": "+1",
        //         "phone_number": phone_number,
        //         "company_access": [company_access],
        //         "user_role": user_role,
        //         "api_token": token
        //     })

        // })
        // const res2User = await resUser.json();
        // console.log(res2User);
        // if (res2User.status_code == 200) {
        //     handleClose();
        //     setFullName("");
        //     setEmailID("");
        //     setCountry_code("");
        //     setPhone_number("");
        //     setCompany_access("");
        //     setUser_role("");
        // }
    }

    const router = useRouter();



    return (
        <>
            <h3>My Account</h3>
            <h4>{data?.full_name}</h4>
            <div className="email">{data?.email_id}</div>
            <div className="phone">{data?.phone_number?.country_code} {data?.phone_number?.phone_number}</div>

            {/* <div className="logout">
                <>
                    <div><a className="dropdown-item" onClick={() => {
                        Cookies.remove('token');
                        Cookies.remove('role')
                        Cookies.remove('userid')
                        Cookies.remove('name')
                        Cookies.remove('company_id')
                        router.push('/');
                    }
                    }>Logout</a></div>
                </>
            </div> */}
            <button onClick={handleShow}>Reset password</button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to reset your password?</Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-primary" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={resetPassword}>Confirm</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UserSidebar