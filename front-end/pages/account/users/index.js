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
import {
    get_user_details,
    list_associate_user,
    create_user,
    update_user
} from '../../api/users'

const Users = ({ data, listUsers, companiesData }) => {

    const router = useRouter()
    // const limit = 3
    // const lastPage = Math.ceil(totalPage / limit)
    // console.log(data)
    console.log(listUsers)

    /**
     * Manage states
     */

    const [userList, setUserList] = useState(listUsers);

    const [search, setSearch] = useState('');
    const [filter_user_role, setFilter_user_role] = useState([]);
    const [filter_company, setFilter_company] = useState([]);
    const [sort_by, setSortby] = useState('user_name');
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



    const fetchData = async (filterType, filterData, dir) => {

        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        /**************************************/
        /* This is because the function fires */
        /* before state is updated correctly  */
        /**************************************/
        let userRole = filter_user_role;
        let userComp = setFilter_company;
        let srch = search;
        let sort = sort_by;
        let desc = is_desc;

        switch (filterType) {
            case "search":
                setSearch(filterData);
                srch = filterData;
                break;
            case "role":
                setFilter_user_role(filterData);
                userRole = filterData;
                break;
            case "company":
                setFilter_company(filterData);
                userComp = filterData;
                break;
            case "sort":
                if (sort_by != filterData) {
                    setDesc(true);
                    desc = true;
                    setSortby(filterData);
                    sort = filterData;
                } else {
                    desc = !is_desc
                    setDesc(!is_desc);
                }

        }
        /**************************************/

        const body = {
            "language": 'en',
            "api_token": token,
            "sort_by": sort,
            "is_desc": desc,
            "search": srch
        }
        if (userRole.length > 0 && userRole[0] !== "") body.filter_user_role = userRole;
        if (userComp.length > 0 && userComp[0] !== "") body.filter_company = userComp;

        list_associate_user(body)
            .then(newData => {
                console.log(newData);
                setUserList(newData);
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
            "company_access": [company_access],
            "user_role": user_role,
            "api_token": token
        }

        const res2User = await create_user(body);
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

    /**
     * Get user details basis of user id for edit purpose
     * @param {*} id 
     * @returns 
     */
    const getUser = (id) => {
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

        get_user_details({
            "user_id": id,
            "language": "en",
            "api_token": token
       }).then(userData2 => {

            console.log(userData2);
            // handleClose();
            setFullName(userData2?.full_name);
            setEmailID(userData2?.email_id);
            setCountry_code(userData2?.phone_number?.country_code);
            setPhone_number(userData2?.phone_number?.phone_number);
            setCompany_access(userData2?.full_name);
            setUser_role(userData2?.display_user_role);
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
            "full_name": fullNname,
            "email_id": emailID,
            "country_code": "+1",
            "phone_number": phone_number,
            "company_access": [company_access],
            "user_role": user_role,
            "api_token": token
        }
        const res2User = await update_user(body);

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

    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <UserSidebar data={data} />
                    </div>
                    <div className="col">
                        <div className="sidebarwrap_inner">
                            <TabButtonUser id={data?._id} />
                            <div className="search inner_search">
                                <div className="row">
                                    <div className="col-4">
                                        <input type="text" className="form-control" id="companysearch" placeholder="Search"
                                            onChange={(e) => fetchData("search", e.target.value)} />
                                        <label htmlFor="companysearch" className="form-label">Search</label>
                                    </div>
                                    <div className="col  text-end">
                                        <select className="form-select role" onChange={(e) => {
                                            setFilter_user_role([e.target.value]);
                                            fetchData("role", [e.target.value]);
                                        }}>
                                            <option value="">All Roles</option>
                                            <option value="user">User</option>
                                            <option value="user-manager">User Manager</option>
                                        </select>
                                        <select className="form-select f1" onChange={(e) => {
                                            setFilter_company([e.target.value]);
                                            fetchData("company", [e.target.value]);
                                        }}>
                                            <option value="">All Companies</option>
                                            {companiesData?.map((item, idx) =>
                                                <option key={idx} value={item._id}>{item.company_name}</option>
                                            )}
                                        </select>
                                        {/* <Link href="#"><a className="btn addbtn" onClick={handleShow}>Add User</a></Link> */}

                                    </div>
                                </div>
                            </div>

                            <div className="listing">
                                <table id="example" className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th><div onClick={(e) => {
                                                fetchData("sort", "user_name");
                                                // const srchval1 = 'user_name'
                                                // if (sort_by != srchval1) {
                                                //     setDesc(true);
                                                //     setSortby('user_name');
                                                // } else {
                                                //     setDesc(!is_desc);
                                                // }
                                                // fetchData();
                                            }
                                            }>User Name</div></th>
                                            <th><div onClick={(e) => {
                                                fetchData("sort", "date_added");
                                            }
                                            }>Date Added</div></th>
                                            <th><div onClick={(e) => {
                                                fetchData("sort", "email_id");
                                                // const srchval3 = 'email_id'
                                                // if (sort_by != srchval3) {
                                                //     setDesc(true);
                                                //     setSortby('email_id');
                                                // } else {
                                                //     setDesc(!is_desc);
                                                // }
                                                // fetchData();
                                            }
                                            }>Email</div></th>
                                            <th><div onClick={(e) => {
                                                fetchData("sort", "display_user_role");
                                                // const srchval4 = 'display_user_role'
                                                // if (sort_by != srchval4) {
                                                //     setDesc(true);
                                                //     setSortby('display_user_role');
                                                // } else {
                                                //     setDesc(!is_desc);

                                                // }
                                                // fetchData();
                                            }
                                            }>Role</div></th>
                                            <th><div onClick={(e) => {
                                                fetchData("sort", "company_access");
                                                // const srchval5 = 'company_access'
                                                // if (sort_by != srchval5) {
                                                //     setDesc(true);
                                                //     setSortby('company_access');
                                                // } else {
                                                //     setDesc(!is_desc);
                                                // }
                                                // fetchData();
                                            }
                                            }>Company Access</div></th>
                                            {/* <th><div>Actions</div></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList?.map((item) => (


                                            <tr>
                                                <td>{item.full_name}</td>
                                                <td>{item.date_added}</td>
                                                <td>{item.email_id}</td>
                                                <td>{item.display_user_role}</td>
                                                <td>{item.company_access.join(', ')}</td>
                                                {/* <td>
                                                    <> */}
                                                {/* <a className="btn accept" onClick={() => AcceptUser(item._id)}>Accept User</a> &nbsp; */}
                                                {/* <button className="btn viewmore" onClick={() => getUser(item._id)}>Edit User</button> &nbsp; */}
                                                {/* <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button> */}
                                                {/* <a className="btn viewmore" onClick={() => stimulateUser(item._id)}>Stimulate User</a> &nbsp; */}
                                                {/* </>
                                                </td> */}
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
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="user-manager">User Manager</option>
                        </select>

                        <div>
                            <label htmlFor="groups" className="form-label">Add to group</label>
                            <>


                                {data?.child_companies?.map((item) => (
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
    const { token, userid } = parseCookies(ctx)
    const query = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    //Can use promise.all now
    const ret = await get_user_details({
            "language": 'en',
            "api_token": token,
            "user_id": userid
    })

    const body = {
            "language": 'en',
            "api_token": token,
    }

    console.log("BODY:", body)
    const users = await list_associate_user(body)



    if (!users) {
        return {
            notFound: true,
        }
    }


    let compData = [{ _id: ret.parent_companies._id, company_name: ret.parent_companies.company_name }];
    for (let company of ret.child_companies) {
        compData.push({ _id: company._id, company_name: company.company_name })
    }

    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: ret || [],
            listUsers: users,
            companiesData: compData
        }
    }

}

export default Users