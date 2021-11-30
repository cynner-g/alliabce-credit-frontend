import Header from "../../components/header"
import { useRouter } from "next/router"
import Link from 'next/link'
import Pagination from "../../components/datatable/pagination"
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import { useState } from "react"



const Companies = ({ data, page, totalPage }) => {

    const [dataList, setData] = useState(data);
    const [search, setSearch] = useState('');
    const [sort_by, setSortby] = useState('company_name');
    const [is_desc, setDesc] = useState(false);

    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)
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

        const req = await fetch('${process.env.API_URL}/company/list-companies', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "language": 'en',
                "api_token": token,
                "search": search,
                "sort_by": sort_by,
                "is_desc": is_desc
            })

        });
        const newData = await req.json();

        return setData(newData);
    };

    return (
        <>
            <Header />

            <div className="seaarch">
                <div className="row">
                    <div className="col">
                        <input type="text" className="form-control" id="companysearch" onChange={(e) => {
                            setSearch(e.target.value);
                            fetchData();
                        }
                        } placeholder="Search" />
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
                            <th><div onClick={(e) => {
                                const srchval1 = 'id'
                                if (sort_by != srchval1) {
                                    setDesc(true);
                                    setSortby('id');
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Ref. Id</div></th>
                            <th><div onClick={(e) => {
                                // reference_id
                                const srchval2 = 'company_name'
                                if (sort_by != srchval2) {
                                    setDesc(true);
                                    setSortby(srchval2);
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Company Name</div></th>
                            <th><div onClick={(e) => {
                                // reference_id
                                const srchval3 = 'date_added'
                                if (sort_by != srchval3) {
                                    setDesc(true);
                                    setSortby(srchval3);
                                } else {
                                    if (is_desc == true) {
                                        setDesc(false);
                                    } else {
                                        setDesc(true);
                                    }
                                }
                                fetchData();
                            }
                            }>Date added</div></th>
                            <th><div>Group</div></th>
                            <th><div>No. of Sub-company</div></th>
                            <th><div>Actions</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataList?.data?.map((item) => (


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