import Header from "../../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"
import { Modal, Button } from "react-bootstrap";
import TabButton from "../../../components/tabbutton"
import { CheckboxGroup, Checkbox } from 'rsuite'
import 'rsuite/dist/rsuite.min.css';
import {
    list_user,
    create_user,
    verify_user,
    get_user_details,
    update_user
} from '../../api/users';

import { get_company_details } from '../../api/companies';

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


    const [showEditUser, setShowEditUser] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [fullName, setFullName] = useState("");
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
        setShowEditUser(false)
        setIsEdit(false);
        setUserId("")
        setFullName("");
        setEmailID("");
        setCountry_code("");
        setPhone_number("");
        setCompany_access("");
        setUser_role("");
    };
    const handleShow = () => setShowEditUser(true);

    const handleOnChange = (items) => {
        // var isChecked1 = e.target.checked;
        // var item = e.target.value;
        // if (isChecked1) {
        //     setIsChecked(oldArray => [...oldArray, item]);
        // } else {
        //     let arr = ischecked.filter(val => val !== item);
        //     setIsChecked(arr);
        // }
        setIsChecked(items)
    };

    const fetchData = (type, data) => {

        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        let filter_user, filter_comp;
        try {
            filter_user = filter_user_role;
            filter_comp = filter_company;
        }
        finally {
            if (type !== null) {
                switch (type) {
                    case "user":
                        filter_user = data;
                        break;
                    case "company":
                        filter_comp = data;
                        break;
                    default: break;
                }
            }
        }

        let body = {
            "language": 'en',
            "api_token": token,
            "company_id": qstr.userid,
            "sort_by": sort_by,
            "is_desc": is_desc
        }
        if (filter_user[0] !== "") body.filter_user_role = filter_user;
        if (filter_comp[0] !== "") body.filter_company = filter_comp;

        list_user(body)
            .then(newData => {
                setUserList(newData)
            })
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

        if (!ischecked.includes(qstr.userid)) ischecked.push(qstr.userid);
        let body = {
            "full_name": fullName,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "company_access": ischecked,
            "user_role": user_role,
            "is_verified": (role?.toLowerCase().indexOf('admin') >= 0),
            "api_token": token
        }

        console.log(body);

        const res2User = create_user(body)
            .then(res => {
                if (res.status_code == 200) {
                    handleClose();
                    setFullName("");
                    setEmailID("");
                    setCountry_code("");
                    setPhone_number("");
                    setCompany_access("");
                    setUser_role("");
                    fetchData();
                }
            })
    }

    /**
     * Verify user as a valid member of the team
     * @params {*} id
     * @returns
     */
    const AcceptUser = (id) => {

        const token = Cookies.get('token');
        const userId = Cookies.get('userid')

        verify_user({
            "user_id": userId,
            "request_by_user_id": "en",
            "api_token": token
        })
    }

    /**
     * Get user details basis of user id for edit purpose
     * @param {*} id 
     * @returns 
     */
    const editUser = async (id) => {
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

        get_user_details({
            "user_id": id,
            "language": "en",
            "api_token": token
        }).then(userData => {

            console.log(userData);
            if (userData) {
                let checkedList = [userData.parent_companies?._id];
                for (let comp of userData?.child_companies) checkedList.push(comp._id)

                // handleClose();
                setIsChecked(checkedList)
                setFullName(userData?.full_name);
                setEmailID(userData?.email_id);
                setCountry_code(userData?.phone_number.country_code);
                setPhone_number(userData?.phone_number.phone_number);
                setCompany_access(userData?.full_name);
                setUser_role(userData?.user_role);
                // setUser_role(userData?.display_user_role);
                setIsEdit(true);
                setShowEditUser(true);
                setUserId(id)
            }
        })
    }

    /**
     * Remove user 
     * Api is pending
     * @param {*} id 
     */
    const removeUser = async (id) => {

    }

    /**
     * Simulate user
     * @param {*} id 
     */
    const simulateUser = async (id) => {
        return '';
    }

    /**
     * 
     * @returns 
     */

    // const AcceptUser = async (id) => {
    //     return '';
    // }

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

        const body = {
            "user_id": userID,
            "full_name": fullName,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "company_access": ischecked,
            "user_role": user_role,
            "api_token": token
        }

        const res2User = update_user(body)
            .then(res => {
                console.log(res);
                if (res.status_code == 200) {
                    handleClose();
                    // setFullName("");
                    // setEmailID("");
                    // setCountry_code("");
                    // setPhone_number("");
                    // setCompany_access("");
                    // setUser_role("");
                    // setIsEdit(false);
                    // setShowEditUser(false);
                    // setUserId("")
                }
            })
    }

    const isUserManager = () => {
        let role = Cookies.get('role');
        return (role?.toLowerCase() === "user")

    }
    return (
        <>
            <Header />
            <TabButton id={data?._id || 0} url={`/companies/${qstr.userid}` || ''} />
            <div className="search">
                <div className="row">
                    <div className="col">

                        <input type="text" className="form-control" id="companysearch" placeholder="Search" onChange={(e) => {
                            setSearch(e.target.value);
                            fetchData();
                        }} />
                        <label htmlFor="companysearch" className="form-label">Search</label>
                    </div>
                    <div className="col  text-end">
                        <select className="form-select role" onChange={(e) => {
                            setFilter_user_role([e.target.value]);
                            fetchData("user", [e.target.value]);
                        }}>
                            <option value="">All</option>
                            <option value="user">User</option>
                            <option value="user-manager">User Manager</option>
                        </select>
                        <select className="form-select f1" onChange={(e) => {
                            setFilter_company([e.target.value]);
                            fetchData("company", [e.target.value]);
                        }}>
                            <option>Company Access</option>
                            {companiesData?.map((item, idx) =>
                                <option key={idx} value={item._id}>{item.company_name}</option>
                            )}
                        </select>
                        <Link href="#"><a className="btn addbtn" onClick={handleShow} disabled={isUserManager()}>Add User</a></Link>

                    </div>
                </div>
            </div>

            <div className="listing">
                <table id="example" className="table table-striped">
                    <thead>
                        <tr>
                            <th className="sorted"><div onClick={(e) => {
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
                            }><span>User Name</span></div></th>
                            <th className="sorted"><div onClick={(e) => {
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
                            }><span>Date Added</span></div></th>
                            <th className="sorted"><div onClick={(e) => {
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
                            }><span>Email</span></div></th>
                            <th className="sorted"><div onClick={(e) => {
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
                            }><span>Role</span></div></th>
                            <th className="sorted"><div onClick={(e) => {
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
                            }><span>Company Access</span></div></th>
                            <th><div style={{ width: '310px' }}>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList?.data?.map((item, idx) => (

                            <tr key={idx}>
                                <td>{item.full_name}</td>
                                <td>{new Date(item.date_added).toLocaleString()}</td>
                                <td>{item.email_id}</td>
                                <td>{item.display_user_role}</td>
                                <td>{item?.company_access?.join(", ")}</td>
                                <td>
                                    <>{item.is_verified ? '' :
                                        <>
                                            <a className="btn accept" onClick={() => AcceptUser(item._id)}>Accept User</a> &nbsp;
                                            <button className="btn viewmore" onClick={() => editUser(item._id)}>Edit User</button> &nbsp;
                                        </>
                                    }
                                        {/* <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>

                                    }
                                </button> */}

                                        <a className="btn viewmore" onClick={() => simulateUser(item._id)}>Simulate User</a> &nbsp;
                                        <a className="btn viewmore" >Reset Password</a> &nbsp;
                                        {/* onClick={() => simulateUser(item._id)} */}
                                    </>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
            </div>
            <Modal show={showEditUser} onHide={handleClose}>
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
                                    <label htmlFor="fullName" className="form-label">Full Name</label>
                                    <input className="form-control" name="fullName" type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
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
                                        {/* <option value="admin">Admin</option> */}
                                        <option value="user">User</option>
                                        <option value="user-manager">User Manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">

                                    <label htmlFor="groups" className="form-label">Company Access</label>
                                    <div className="chkox">

                                        <CheckboxGroup name="checkboxList" value={ischecked} onChange={(e) => handleOnChange(e)}>
                                            {companiesData.map(item => (
                                                <Checkbox key={item._id} value={item._id} className="test" name="company_access" >
                                                    {/* className='form-check-input' - Causes display issues */}
                                                    <span className="form-check-label">{item.company_name}</span>
                                                </Checkbox>

                                            ))}
                                        </CheckboxGroup>


                                        {/* {companiesData?.map((item, idx) => (
                                            <div className="form-check" key={idx}>
                                                <label className="form-check-label" htmlFor={item._id}>{item.company_name}</label>
                                                <input className="form-check-input" name="company_access" type="checkbox" value={item._id} id={item._id} />
                                            </div>
                                        ))} */}
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

    let data = await Promise.all([
        list_user({
            "language": 'en',
            "api_token": token,
            "company_id": query.userid
        }),

        get_company_details({
            "language": 'en',
            "api_token": token,
            "company_id": query.userid
        }),


    ])

    const users = data[0]
    const resCompaniesData = data[1]?.data;

    let compData = [{ _id: resCompaniesData._id, company_name: resCompaniesData.company_name }];
    for (let company of resCompaniesData.sub_companies) {
        compData.push({ _id: company._id, company_name: company.company_name })
    }
    // console.log(users)
    if (!users) {
        return {
            notFound: true,
        }
    }

    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: users,
            page: 1,
            totalPage: 1,
            query,
            companiesData: compData
        }
    }
}

export default Users