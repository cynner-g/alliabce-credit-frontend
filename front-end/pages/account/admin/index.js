import Header from "../../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";
import UserSidebar from "../../../components/user_sidebar"
import TabButtonUser from "../../../components/tabbuttonuser"
import Address from "../../../components/address"


const AdminUsers = ({ data }) => {

    const router = useRouter()
    // const limit = 3
    // const lastPage = Math.ceil(totalPage / limit)
    // console.log(data)
    // console.log(listUsers)

    /**
     * Manage states
     */

    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [fullNname, setFullName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [country_code, setCountry_code] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [company_access, setCompany_access] = useState("");
    const [isActive, setActive] = useState("");
    const [userID, setUserId] = useState("");

    /**
     * Clear values
     */
    const handleClose = () => {
        setShow(false)
        setIsEdit(false);
        setUserId("")
        setFullName("");
        setEmailID("");
        setCountry_code("");
        setPhone_number("");
    };
    const handleShow = () => setShow(true);





    /**
     * Add User
     * @param {*} e 
     * @returns 
     */
    const addUser = async (e) => {

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
        const resUser = await fetch(`http://dev.alliancecredit.ca/user/create-sub-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "full_name": fullNname,
                "email_id": emailID,
                "country_code": "+1",
                "phone_number": phone_number,
                "api_token": token
            })

        })
        const res2User = await resUser.json();
        console.log(res2User);
        if (res2User.status_code == 200) {
            handleClose();
            setFullName("");
            setEmailID("");
            setCountry_code("");
            setPhone_number("");
        }
    }

    /**
     * Get user details basis of user id for edit purpose
     * @param {*} id 
     * @returns 
     */
    const getUser = async (id) => {
        // e.preventDefault();
        setIsEdit(true);
        setShow(true);
        setUserId(id)
        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        const userData = await fetch(`http://dev.alliancecredit.ca/user/user-details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": id,
                "language": "en",
                "api_token": token
            })

        })
        const userData2 = await userData.json();
        console.log(userData2);
        if (userData2.status_code == 200) {
            // handleClose();
            setFullName(userData2?.data?.full_name);
            setEmailID(userData2?.data?.email_id);
            setCountry_code(userData2?.data?.phone_number?.country_code);
            setPhone_number(userData2?.data?.phone_number?.phone_number);
        }
    }

    /**
     * Remove user 
     * Api is pending
     * @param {*} id 
     */
    const removeUser = async (id) => {

    }
    /**
     *Update User
     *
     * @return {*} 
     */
    const updateUser = async () => {
        // e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        const resUser = await fetch(`http://dev.alliancecredit.ca/user/update-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": userID,
                "full_name": fullNname,
                "email_id": emailID,
                "country_code": "+1",
                "phone_number": phone_number,
                "api_token": token,
                "is_active": isActive
            })

        })
        const res2User = await resUser.json();
        console.log(res2User);
        if (res2User.status_code == 200) {

            setFullName("");
            setEmailID("");
            setCountry_code("");
            setPhone_number("");
            setIsEdit(false);
            setShow(false);
            setUserId("")
        }
    }

    const address = {
        "address_line": "",
        "city_name": "",
        "state_name": "",
        "zip_code": ""
    }
    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <UserSidebar data={data} />
                    </div>
                    <div className="col">
                        <div className="sidebarwrap">
                            {/* <TabButtonUser id={data?._id} /> */}
                            <h3 className="acc_title">My Company</h3>
                            <h2 className="login_name">Alliance Credit</h2>
                            <div className="acc_email">
                                <a href="mailto:email@company.com">email@company.com</a>
                            </div>
                            <div className="acc_phone">+1234567890</div>
                            <Address address={address} />


                            <div className="ac_left acc_title">All Team Members</div>
                            <div className="ac_right">
                                <button className="btn btnedit" onClick={handleShow}>Add Sub Admin</button>
                            </div>
                            <div className="clearfix"></div>
                            <div className="listing">
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
                                        {data?.map((item, index) => (


                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{item.full_name}</td>
                                                <td>{item.date_added}</td>
                                                <td>{item.email_id}</td>
                                                <td>
                                                    <>
                                                        <button className="btn viewmore" onClick={() => getUser(item._id)}>Edit User</button>
                                                    </>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit == false
                        ? "Add Sub-Admin"
                        : "Edit Sub-Admin"
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
                                    {isEdit ? (
                                        <>
                                            <label htmlFor="phone_number" className="form-label">Active status</label>
                                            <select className="form-control form-select" onChange={(e) => setActive(e.target.value)}>
                                                <option value="0">Active</option>
                                                <option value="1">Deactivate</option>
                                            </select>
                                        </>
                                    ) : ''}
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
                            <Button variant="primary" className="btn btnremove" onClick={removeUser}>Remove User</Button>
                            <Button variant="primary" className="btn btnedit">Reset User</Button>
                            <Button variant="primary" onClick={updateUser}>Save</Button>
                        </>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

/**
 *
 *
 * @export
 * @param {*} { query: { page = 1, data = null, totalPage = 10 } }
 * @return {*} 
 */
// export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
export async function getServerSideProps(ctx) {
    // const start = +page === 1 ? 0 : (+page + 1)

    // const { locale, locales, defaultLocale, asPath } = useRouter();
    const { token } = parseCookies(ctx)

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const res = await fetch(`${process.env.API_URL}/user/list-sub-admin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })

    })

    const data = await res.json()


    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: data?.data || [],
        }
    }

}

export default AdminUsers