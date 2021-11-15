import Header from "../../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";


const Companies = ({ data, page, totalPage, query, companiesData }) => {

    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)
    // console.warn(query);
    console.warn(data);
    // console.warn(companiesData);

    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleClose = () => {
        setShow(false)
        setIsEdit(false);
        setUserId("")
        setFullName("");
        setEmailID("");
        setCountry_code("");
        setPhone_number("");
        setCompany_access("");
        setUser_role("");
    };
    const handleShow = () => setShow(true);



    const [fullNname, setFullName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [country_code, setCountry_code] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [company_access, setCompany_access] = useState("");
    const [user_role, setUser_role] = useState("");
    const [userID, setUserId] = useState("");


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
        const resUser = await fetch(`http://dev.alliancecredit.ca/user/create-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "full_name": fullNname,
                "email_id": emailID,
                "country_code": "+1",
                "phone_number": phone_number,
                "company_access": [company_access],
                "user_role": user_role,
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
            setCompany_access("");
            setUser_role("");
        }
    }

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
            setCompany_access(userData2?.data?.full_name);
            setUser_role(userData2?.data?.display_user_role);
        }
    }

    // function getUser(id) {
    //     setUsers(users.map(x => {
    //         if (x.id === id) { x.isDeleting = true; }
    //         return x;
    //     }));
    //     userService.delete(id).then(() => {
    //         setUsers(users => users.filter(x => x.id !== id));
    //     });
    // }

    const removeUser = async (id) => {

    }
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
                "company_access": [company_access],
                "user_role": user_role,
                "api_token": token
            })

        })
        const res2User = await resUser.json();
        console.log(res2User);
        if (res2User.status_code == 200) {

            setFullName("");
            setEmailID("");
            setCountry_code("");
            setPhone_number("");
            setCompany_access("");
            setUser_role("");
            // handleClose();
            setIsEdit(false);
            setShow(false);
            setUserId("")
        }
    }

    return (
        <>
            <Header />
            <div className="seaarch">
                <div className="row">
                    <div className="col">

                        <input type="text" className="form-control" id="companysearch" placeholder="Search" />
                        <label htmlFor="companysearch" className="form-label">Search</label>
                    </div>
                    <div className="col">
                        <select>
                            <option>Role</option>
                        </select>
                        <select>
                            <option>Company Access</option>
                        </select>
                        <Link href="#"><a className="btn btn-primary" onClick={handleShow}>Accept User</a></Link> &nbsp;

                    </div>
                </div>
            </div>
            <table id="example" className="table table-striped">
                <thead>
                    <tr>
                        <th><div>User Name</div></th>
                        <th><div>Date Added</div></th>
                        <th><div>Email</div></th>
                        <th><div>Role</div></th>
                        <th><div>Company Access</div></th>
                        <th><div>Actions</div></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data?.map((item) => (


                        <tr>
                            <td>{item.full_name}</td>
                            <td>{item.date_added}</td>
                            <td>{item.email_id}</td>
                            <td>{item.display_user_role}</td>
                            <td>{item.full_name}</td>
                            <td>
                                <>
                                    <a className="btn btn-primary" onClick={() => AcceptUser(item._id)}>Accept User</a> &nbsp;
                                    <button className="btn btn-primary" onClick={() => getUser(item._id)}>Edit User</button> &nbsp;
                                    {/* <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button> */}
                                    <a className="btn btn-primary" onClick={() => stimulateUser(item._id)}>Stimulate User</a> &nbsp;
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit == false
                        ? "Add User"
                        : "Edit User"
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form method="POST" encType="multipart/form-data">

                        <label htmlFor="fullname" className="form-label">Full Name</label>
                        <input className="form-control" name="fullname" type="text" id="fullname" value={fullNname} onChange={(e) => setFullName(e.target.value)} />


                        <label htmlFor="emailID" className="form-label">Email</label>
                        <input className="form-control" name="emailID" type="text" id="emailID" value={emailID} onChange={(e) => setEmailID(e.target.value)} />

                        <label htmlFor="phone_number" className="form-label">Phone Number</label>
                        <input className="form-control" name="phone_number" type="text" id="phone_number" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />

                        <label htmlFor="portal_language" className="form-label">Role</label>
                        <select className="form-select form-select-sm" id="portal_language" aria-label=".form-select-sm example" onChange={(e) => setUser_role(e.target.value)}>
                            <option selected>Select Role</option>
                            <option value="user-manager">User Manager</option>
                        </select>

                        <div>
                            <label htmlFor="groups" className="form-label">Add to group</label>
                            <>
                                {companiesData?.map((item) => (
                                    <div className="form-check">
                                        <label className="form-check-label" htmlFor={item._id}>{item.company_name}</label>
                                        <input className="form-check-input" name="company_access" type="checkbox" value={item._id} id={item._id} onChange={(e) => setCompany_access(e.target.value)} />
                                    </div>
                                ))}
                            </>

                            <input className="form-control" name="userID" type="hidden" id="company_logo_en" value={userID} />

                        </div>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    {isEdit == false
                        ? <>
                            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={addUser}>Add User</Button>
                        </>
                        :
                        <>
                            <Button variant="primary" onClick={removeUser}>Remove User</Button>
                            <Button variant="primary" onClick={updateUser}>Update User</Button>
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
    const query = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const res = await fetch(`${process.env.API_URL}/user/list-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
            "company_id": query.id
        })

    })
    const users = await res.json()
    // console.log(users)
    if (!users) {
        return {
            notFound: true,
        }
    }
    const resCompanies = await fetch(`${process.env.API_URL}/company/list-companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })

    })
    const resCompaniesData = await resCompanies.json()
    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: users,
            page: 1,
            totalPage: 1,
            query,
            companiesData: resCompaniesData?.data
        }
    }

}

export default Companies