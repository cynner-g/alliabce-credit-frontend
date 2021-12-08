import Cookies from 'js-cookie';
import Link from 'next/link'
import Router, { useRouter } from 'next/router';
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";


const UserSidebar = ({ data }) => {
    const [showReset, setShowReset] = useState(false);
    const handleCloseReset = () => setShowReset(false);
    const handleShowReset = () => setShow(true);

    const [showChange, setShowChange] = useState(false);
    const handleCloseChange = () => setShowChange(false);
    const handleShowChange = (e) => { setShowChange(false); changePassword(e) }

    const changePassword = (e) => {
        e.preventDefault();
        const token = Cookies.get('token');
        if (token)
            Router.push({
                pathname: `/change-password`,
                query: { uId: data._id }
            });
    }

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
    }

    const router = useRouter();



    return (
        <div className="sidebarwrap">
            <h3 className="acc_title">My Account</h3>
            <h4 className="login_name">{data?.full_name}</h4>
            <div className="acc_email">{data?.email_id}</div>
            <div className="acc_phone">{data?.phone_number?.country_code} {data?.phone_number?.phone_number}</div>

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
            <div className='alignBottom'>
                {/* <button onClick={handleShowReset} className="btn btnedit resetPassBtn">Reset password</button> */}
                <button onClick={handleShowChange} className="btn btnedit changePassBtn">Change password</button>
            </div>
            <Modal show={showReset} onHide={handleCloseReset}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="popupContent">Are you sure you want to reset your password?</div></Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btnedit" onClick={handleCloseReset}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={resetPassword}>Reset Password</button>
                </Modal.Footer>
            </Modal>

            <Modal show={showChange} onHide={handleCloseChange}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="popupContent">Are you sure you want to change your password?</div></Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btnedit" onClick={handleCloseChange}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={changePassword}>Change Password</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UserSidebar