import Header from "../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"



const Companies = ({ data, page, totalPage }) => {

    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)
    console.warn(data.data);
    return (
        <>
            <Header />

            <div className="seaarch">
                <div className="row">
                    <div className="col">
                        <input type="text" className="form-control" id="companysearch" placeholder="Search" />
                        <label htmlFor="companysearch" className="form-label"></label>
                    </div>
                    <div className="col text-end">
                        <Link href="/companies/add-company"><a className="btn btn-primary">Add Company</a></Link>
                    </div>
                </div>
            </div>
            <div className="listing">
                <table id="example" className="table table-striped">
                    <thead>
                        <tr>
                            <th><div>Ref. Id</div></th>
                            <th><div>Company Name</div></th>
                            <th><div>Date added</div></th>
                            <th><div>Group</div></th>
                            <th><div>No. of Sub-company</div></th>
                            <th><div>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((item) => (


                            <tr key={item._id}>
                                {/* {post.title} */}
                                <td>{item?._id}</td>
                                <td>{item?.company_name}</td>
                                <td>{item?.date_added}</td>
                                <td>{item?.group_data.join(", ")}</td>
                                <td>{item?.sub_companies_count}</td>
                                <td>
                                    <>
                                        <Link href={`/companies/${item._id}`}><a className="btn viewmore">View More</a></Link> &nbsp;
                                        <button className="btn viewmore">Transaction Detals</button>
                                    </>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
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
    const res = await fetch(`${process.env.API_URL}/company/list-companies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })

    })
    const posts = await res.json()
    // console.log(posts)
    if (!posts) {
        return {
            notFound: true,
        }
    }
    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: posts,
            page: 1,
            totalPage: 1
        }
    }

}

export default Companies