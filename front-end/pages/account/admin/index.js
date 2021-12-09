import Header from "../../../components/header"
import UserList from "../../../components/userlist"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState, useEffect } from "react"
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

    // const [show, setShow] = useState(false);
    // const [isEdit, setIsEdit] = useState(false);

    // const [fullNname, setFullName] = useState("");
    // const [emailID, setEmailID] = useState("");
    // const [country_code, setCountry_code] = useState("");
    // const [phone_number, setPhone_number] = useState("");
    // const [company_access, setCompany_access] = useState("");
    // const [isActive, setActive] = useState("");
    // const [userID, setUserId] = useState("");
    // const [role, setRole] = useState("");
    const [thisUserData, setThisUser] = useState({})
    const [deleteUserDisplay, showDeleteUser] = useState(false)

    useEffect(() => {
        const token = Cookies.get('token');
        const uid = Cookies.get('userid');
        const thisUserData = await get_user_details({
                user_id: uid,
            api_token: token,
        })


        setThisUser(thisUserData?.data);
    }, []);

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

    const address = {
        "address_line": "",
        "city_name": "",
        "state_name": "",
        "zip_code": ""
    }

    return (
        <>
            <Modal show={deleteUserDisplay} onHide={() => closeDeleteUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body><div className="popupContent">Are you sure you want to reset your password?</div></Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btnedit" onClick={() => closeDeleteUser}>Cancel</button>
                    <button type="submit" className="btn btn-primary" onClick={() => deleteUser(userId)}>Reset Password</button>
                </Modal.Footer>
            </Modal>


            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <UserSidebar data={thisUserData} />
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

                            <div className="clearfix"></div>
                            <div className="listing">
                                <UserList
                                    allowDelete={true}
                                    allowEdit={true}
                                    addUser={true}
                                    data={data}
                                    allowAddTitle={"Sub-Admin"}
                                />
                                {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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

    const data = await list_sub_admin({
        "language": 'en',
        "api_token": token,
    });



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