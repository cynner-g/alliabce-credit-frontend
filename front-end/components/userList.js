import Pagination from "/components/datatable/pagination"
import { Modal, Button } from 'react-bootstrap'
import { useState } from 'react'
import { parseCookies } from "nookies"
import { useRouter } from 'next/router';
import Select from 'react-select';
import {
    getUserData,
    delete_user,
    create_sub_admin
} from '../pages/api/users';

const UserList = (props) => {
    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [fullNname, setFullName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [company_access, setCompany_access] = useState("");
    const [isActive, setActive] = useState("");
    const [userID, setUserId] = useState();
    const [country_code, setCountry_code] = useState("");
    const [deleteUserDisplay, showDeleteUser] = useState(false)

    const ownerRole = parseCookies().role;
    const token = parseCookies().token;

    const router = useRouter(); //to force page refresh with reload

    const setSelectedUserId = (id) => {
        setUserId(id)
    }
    const deleteUserId = () => {
        setUserId('');
    }
    /**
     * Get user details basis of user id for edit purpose
     * @param {*} id 
     * @returns 
     */
    const getUser = async (e, id) => {
        e.preventDefault();
        setIsEdit(true);
        setShow(true);
        setSelectedUserId(id)
        // const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        const body = {
            "user_id": id,
            "language": "en",
            "api_token": token
        }
        const userData = await getUserData(body);
        console.log(userData);
        if (userData.status_code == 200) {
            setFullName(userData?.data?.full_name);
            setEmailID(userData?.data?.email_id);
            setCountry_code(userData?.data?.phone_number?.country_code);
            setPhone_number(userData?.data?.phone_number?.phone_number);
            setActive(userData?.data?.is_active)
            setSelectedUserId(id)
        }
        console.log(id)
    }


    const setActiveStatus = (value => {
        let tmp = value;
        setActive(value.value);
    })
    /**
     * Clear values
     */
    const handleClose = () => {
        setShow(false)
        setIsEdit(false);
        setFullName("");
        setEmailID("");
        setCountry_code("");
        setPhone_number("");
    };
    const handleShow = () => setShow(true);

    const closeDeleteUser = () => {
        showDeleteUser(false);
        handleClose();
    }

    const askDeleteUser = () => {
        showDeleteUser(true)
        setIsEdit(false)
    }
    /**
     * Remove user 
     * Api is pending
     * @param {*} id 
     */
    const deleteUser = async () => {

        // const token = Cookies.get('token');

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        let body = {
            "api_token": token,
            "user_id": userID
        }

        console.log(body)
        delete_user(body)
        console.log(res2User);
        if (res2User.status_code == 200) {
            closeDeleteUser()
            setIsEdit(false);
            setShow(false);

            router.reload();
        }
    }
    /**
     *Update User
     *
     * @return {*} 
     */
    const updateUser = async () => {
        // e.preventDefault();
        // const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        const body = {
            "user_id": userID,
            "full_name": fullNname,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "api_token": token,
            "is_active": isActive
        }
        const res2User = await update_user(body);
        console.log(res2User);
        if (res2User.status_code == 200) {
            setFullName("");
            setEmailID("");
            setCountry_code("");
            setPhone_number("");
            setIsEdit(false);
            setShow(false);
            router.reload();
        }
    }

    /**
         * Add User
         * @param {*} e 
         * @returns 
         */
    const addUser = async (e) => {
        e.preventDefault();
        // const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        const body = {
            "full_name": fullNname,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "api_token": token
        }

        const resUser = await create_sub_admin(body)

        handleClose();
        deleteUserId();
        router.reload();
    }


    return (
        <>
            <Modal show={deleteUserDisplay} onHide={() => closeDeleteUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="popupContent">Are you sure you want to remove this user?</div></Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btnedit" onClick={closeDeleteUser}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={deleteUser}>Delete User</button>
                </Modal.Footer>
            </Modal>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit == false
                        ? `Add ${props.allowAddTitle}`
                        : `Edit ${props.allowAddTitle}`
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popupform">
                        <form method="POST">
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="fullname" className="form-label">Full Name</label>
                                    <input className="form-control" name="fullname" type="text" id="fullname" value={fullNname} onChange={(e) => setFullName(e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="emailID" className="form-label">Email</label>
                                    <input className="form-control" name="emailID" type="text" id="emailID" value={emailID} onChange={(e) => setEmailID(e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                                    <input className="form-control" name="phone_number" type="text" id="phone_number" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    {isEdit ?
                                        <>
                                            <label htmlFor="phone_number" className="form-label">Active status</label>
                                            {/* <select className="form-control form-select" onChange={(e) => setActive(e.target.value)}>
                                                <option value={true} selected={{ isActive }} >Active</option>
                                                <option value={true} selected={!isActive}>Deactivate</option>
                                            </select> */}
                                            <Select onChange={setActiveStatus}
                                                defaultValue={isActive ? { value: true, label: "Active" } : { value: false, label: "Inactive" }}
                                                options={[
                                                    { value: true, label: "Active" },
                                                    { value: false, label: "Inactive" },
                                                ]}

                                            />
                                        </>
                                        : ''
                                    }
                                </div>
                            </div>
                            <div>
                                <input className="form-control" name="userID" type="hidden" id="company_logo_en" value={userID} />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {isEdit == false
                        ? <>
                            <Button variant="secondary" className="btn btnedit" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={addUser}>Add User</Button>
                        </>
                        :
                        <>
                            {props.allowDelete ?
                                <Button variant="primary" className="btn btnremove" onClick={() => askDeleteUser()}>Remove User</Button>
                                : ''}
                            {props.allowReset ?
                                <Button variant="primary" className="btn btnedit">Reset User</Button>
                                : ''}
                            <Button variant="primary" onClick={updateUser}>Save</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>


            <div className="ac_right">
                {props.allowAddTitle ?
                    <button className="btn btnedit" onClick={handleShow}>Add {props.allowAddTitle}</button>
                    : ''}
            </div>
            <table id="example" className="table table-striped">
                <thead>
                    <tr>
                        <th><div>Sr. Number</div></th>
                        <th><div>User Name</div></th>
                        <th><div>Date Added</div></th>
                        <th><div>Email</div></th>

                        <th><div>Actions</div></th>
                    </tr>
                </thead>
                <tbody>
                    {props?.data?.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.full_name}</td>
                            <td>{item.date_added}</td>
                            <td>{item.email_id}</td>
                            <td>
                                <>
                                    <button className="btn viewmore" onClick={(e) => getUser(e, item._id)}>Edit</button>
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default UserList;
