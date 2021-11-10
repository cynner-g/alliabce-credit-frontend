import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
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
            Credit Reports

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
                    {data.map((item) => (


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
export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
    const start = +page === 1 ? 0 : (+page + 1)

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
    console.log(posts)
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
            page: page,
            totalPage
        }
    }

}

export default Companies