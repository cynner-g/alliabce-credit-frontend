import Header from "../../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";
import TabButton from "../../../components/tabbutton"


const Users = ({ data, page, totalPage, query, companiesData }) => {

    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)


    /**
     * Manage states
     */

    const [userList, setUserList] = useState(data);
    const [ischecked, setIsChecked] = useState([]);

    const [search, setSearch] = useState('');
    const [filter_user_role, setFilter_user_role] = useState([]);
    const [filter_company, setFilter_company] = useState([]);
    const [sort_by, setSortby] = useState('full_name');
    const [is_desc, setDesc] = useState(false);


    const [show, setShow] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [fullNname, setFullName] = useState("");
    const [emailID, setEmailID] = useState("");
    const [country_code, setCountry_code] = useState("");
    const [phone_number, setPhone_number] = useState("");
    const [company_access, setCompany_access] = useState("");
    const [user_role, setUser_role] = useState("");
    const [userID, setUserId] = useState("");

    const qstr = router.query;
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
        setCompany_access("");
        setUser_role("");
    };
    const handleShow = () => setShow(true);

    const handleOnChange = (e) => {
        var isChecked1 = e.target.checked;
        var item = e.target.value;
        if (isChecked1) {
            setIsChecked(oldArray => [...oldArray, item]);
        } else {
            let arr = ischecked.filter(val => val !== item);
            setIsChecked(arr);
        }
    };

    const fetchData = async () => {

        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }


        const req = await fetch('http://dev.alliancecredit.ca/user/list-user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "language": 'en',
                "api_token": token,
                "company_id": qstr.userid,
                "filter_user_role": filter_user_role,
                "filter_company": filter_company,
                "sort_by": sort_by,
                "is_desc": is_desc
            })

        });
        const newData = await req.json();
        console.log(newData);
        return setUserList(newData);
    };


    /**
     * Add User
     * @param {*} e 
     * @returns 
     */
    const addUser = async (e) => {

        e.preventDefault();
        const token = Cookies.get('token');
        const role = Cookies.get('role');
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
            //automatically verified if user is in an admin role
            body: JSON.stringify({
                "full_name": fullNname,
                "email_id": emailID,
                "country_code": "+1",
                "phone_number": phone_number,
                "company_access": ischecked,
                "user_role": user_role,
                "is_verified": role?.toLowerCase().indexOf('admin') >= 0,
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
            fetchData();
        }

    }

    /**
     * Verify user as a valid member of the team
     * @params {*} id
     * @returns
     */
    const AcceptUser = (id) => {

        const token = Cookies.get('token');
        const userId = Cookies.get('userid')
        const userData = fetch(`http://dev.alliancecredit.ca/user/verify-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "user_id": id,
                "request_by_user_id": "en",
                "api_token": token
            })
        })
    }
    /**
     * Get user details basis of user id for edit purpose
     * @param {*} id 
     * @returns 
     */
    const getUser = async (id) => {
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
            setUser_role(userData2?.data?.user_role);
            // setUser_role(userData2?.data?.display_user_role);
            setIsEdit(true);
            setShow(true);
            setUserId(id)
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
     * Stimulate user
     * @param {*} id 
     */
    const stimulateUser = async (id) => {
        return '';
    }

    /**
     * 
     * @returns 
     */

    const AcceptUser = async (id) => {
        return '';
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
                "company_access": ischecked,
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
            setIsEdit(false);
            setShow(false);
            setUserId("")
        }
    }

    const isUserManager = () => {
        let role = Cookies.get('role');
        return (role?.toLowerCase() === "user")

    }
    return (
        <>
            <Header />
            <TabButton id={data?._id || 0} url={`/companies/${qstr.userid}` || ''} />
            <div className="seaarch">
                <div className="row">
                    <div className="col">

                        <input type="text" className="form-control" id="companysearch" placeholder="Search" onChange={(e) => {
                            setSearch(e.target.value);
                            fetchData();
                        }
                        } />
                        <label htmlFor="companysearch" className="form-label">Search</label>
                    </div>
                    <div className="col  text-end">
                        <select className="form-select role" onChange={(e) => {
                            setFilter_user_role([e.target.value]);
                            fetchData();
                        }
                        }>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="user-manager">User Manager</option>
                        </select>
                        <select className="form-select f1" onChange={(e) => {
                            setFilter_company([e.target.value]);
                            fetchData();
                        }
                        }>
                            <option>Company Access</option>
                        </select>
                        <Link href="#"><a className="btn addbtn" onClick={handleShow} disabled={isUserManager}>Add User</a></Link>

                    </div>
                </div>
            </div>

            <div className="listing">
                <table id="example" className="table table-striped">
                    <thead>
                        <tr>
                            <th><div onClick={(e) => {
                                const srchval1 = 'full_name'
                                if (sort_by != srchval1) {
                                    setDesc(true);
                                    setSortby('full_name');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>User Name</div></th>
                            <th><div onClick={(e) => {
                                const srchval2 = 'date_added'
                                if (sort_by != srchval2) {
                                    setDesc(true);
                                    setSortby('date_added');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Date Added</div></th>
                            <th><div onClick={(e) => {
                                const srchval3 = 'email_id'
                                if (sort_by != srchval3) {
                                    setDesc(true);
                                    setSortby('email_id');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Email</div></th>
                            <th><div onClick={(e) => {
                                const srchval4 = 'user_role'
                                if (sort_by != srchval4) {
                                    setDesc(true);
                                    setSortby('user_role');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Role</div></th>
                            <th><div onClick={(e) => {
                                const srchval5 = 'company_access'
                                if (sort_by != srchval5) {
                                    setDesc(true);
                                    setSortby('company_access');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Company Access</div></th>
                            <th><div style={{ width: '310px' }}>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
<<<<<<< HEAD
                        {data?.data?.map((item, idx) => (

=======
                        {userList?.data?.map((item) => (
>>>>>>> 473d5595dcfb847a8f05e7b1415fa94896481de7

                            <tr key={idx}>
                                <td>{item.full_name}</td>
                                <td>{item.date_added}</td>
                                <td>{item.email_id}</td>
                                <td>{item.display_user_role}</td>
                                <td>{item?.company_access?.join(", ")}</td>
                                <td>
                                    <>{item.is_verified ? '' :
                                    <>
                                        <a className="btn accept" onClick={() => AcceptUser(item._id)}>Accept User</a> &nbsp;
                                        <button className="btn viewmore" onClick={() => getUser(item._id)}>Edit User</button> &nbsp;
                                        </>
                                    }
                                        {/* <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>

                                    }
                                </button> */}

                                        <a className="btn viewmore" onClick={() => stimulateUser(item._id)}>Stimulate User</a> &nbsp;
                                    </>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit == false
                        ? "Add User"
                        : "Edit User"
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="popupform">
                        <form method="POST" encType="multipart/form-data">

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
                                    <label htmlFor="portal_language" className="form-label">Role</label>
                                    <select className="form-select" value={user_role} id="portal_language" aria-label="" onChange={(e) => setUser_role(e.target.value)}>
                                        <option selected>Select Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                        <option value="user-manager">User Manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">

<<<<<<< HEAD

                        <label htmlFor="emailID" className="form-label">Email</label>
                        <input className="form-control" name="emailID" type="text" id="emailID" value={emailID} onChange={(e) => setEmailID(e.target.value.toLowerCase())} />

                        <label htmlFor="phone_number" className="form-label">Phone Number</label>
                        <input className="form-control" name="phone_number" type="text" id="phone_number" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />

                        <label htmlFor="portal_language" className="form-label">Role</label>
                        <select className="form-select form-select-sm" id="portal_language" aria-label=".form-select-sm example" onChange={(e) => setUser_role(e.target.value)}>
                            <option selected>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="user-manager">User Manager</option>
                        </select>

                        <div>
                            <label htmlFor="groups" className="form-label">Add to group</label>
                            <>
                                {companiesData?.map((item) => (
                                    <div className="form-check">
                                        <label className="form-check-label" htmlFor={item._id}>{item.company_name}</label>
                                        <input className="form-check-input" name="company_access" type="checkbox" value={item._id} id={item._id} onChange={(e) => setCompany_access(e.target.value)} />
=======
                                    <label htmlFor="groups" className="form-label">Add to group</label>
                                    <div className="chkox">
                                        {companiesData?.map((item) => (
                                            <div className="form-check">
                                                <label className="form-check-label" htmlFor={item._id}>{item.company_name}</label>
                                                <input className="form-check-input" name="company_access" type="checkbox" value={item._id} id={item._id} onChange={(e) => handleOnChange(e)} />
                                            </div>
                                        ))}
>>>>>>> 473d5595dcfb847a8f05e7b1415fa94896481de7
                                    </div>

                                    <input className="form-control" name="userID" type="hidden" id="company_logo_en" value={userID} />


                                </div>
                            </div>


                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {isEdit == false
                        ? <>
                            <Button variant="secondary btnedit" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" onClick={addUser}>Add User</Button>
                        </>
                        :
                        <>
                            <Button variant="primary" className="btnremove" onClick={removeUser}>Remove User</Button>
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
            "company_id": query.userid
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

export default Users