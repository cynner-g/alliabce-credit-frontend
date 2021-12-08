import { useState } from "react"
import { Modal, Button } from "react-bootstrap";



const ResetPassword = function () {
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const reset = async (e) => {

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

        let body = {
            "full_name": fullNname,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "company_access": [company_access],
            "user_role": user_role,
            "api_token": token
        }

        await reset_password(body)
        console.log(res2User);
        if (res2User.status_code == 200) {
            handleClose();
            setFullName("");
            setEmailID("");
            setCountry_code("");
            setPhone_number("");
            setCompany_access("");
            setUser_role("");
        }
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit == false
                        ? "Add User"
                        : "Edit User"
                    }</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <>
                        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                        <Button variant="primary" onClick={reset}>Reset Password</Button>
                    </>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ResetPassword