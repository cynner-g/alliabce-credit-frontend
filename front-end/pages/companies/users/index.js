import Header from "../../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"



const Companies = ({ data, page, totalPage }) => {

    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)
    console.warn(data);
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
                        <Link href="/companies/add-user"><a className="btn btn-primary">Add User</a></Link>
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
                            {/* {post.title} */}
                            <td>aa</td>
                            <td>System Architect</td>
                            <td>Edinburgh</td>
                            <td>61</td>
                            <td>2011/04/25</td>
                            <td>
                                <>
                                    <button className="btn btn-primary">View More</button> &nbsp;
                                    <button className="btn btn-primary">Transaction Detals</button>
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
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
    const res = await fetch(`${process.env.API_URL}/user/list-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })

    })
    const users = await res.json()
    console.log(users)
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
            totalPage: 1
        }
    }

}

export default Companies