import Address from "../../components/address"
import Header from "../../components/header"
import Link from 'next/link'
import TabButtonUser from "../../components/tabbuttonuser"
import { parseCookies } from "nookies"
import UserSidebar from "../../components/user_sidebar"

const Account = function ({ data }) {
    console.log(data)
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

                            <div className="company_wrap">
                                {/* <Link href={{
                                pathname: `/companies/edit/[title]`,
                                query: {
                                    title: data?._id, // should be `title` not `id`
                                },
                            }}
                                as={`/companies/edit/${data?._id}`}
                            ><a className="btn btnedit edit_company">Edit Company</a></Link> */}

                                {data?.child_companies?.reverse().map((item => {
                                    return (
                                        <div className="company_blocks">
                                            <div className="imagewrap"></div>
                                            <div className="rightdata">
                                                <h4>{item?.company_name}</h4>
                                                <div className="cwebsite data_block"><a href={item?.website} target="_blank">{item?.website}</a></div>
                                            </div>
                                            <div className="clearB"></div>



                                            <div className="cemail data_block"><a href={`mailto:${item?.website}`} target="_blank">{item?.website}</a></div>
                                            <div className="cphone data_block">{item?.phone_number?.country_code} - {item?.phone_number?.phone_number}</div>
                                            <div className="caddress data_block">
                                                <Address address={item?.address} />
                                            </div>
                                            <div>
                                                <span>Langauge</span> <strong>{item?.portal_language}</strong>
                                            </div>
                                            <div className="isactive">Active: {item?.is_active ? 'Active' : 'Not Active'}</div>

                                        </div>
                                    )
                                }

                                ))}



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {

    const { token, userid } = parseCookies(ctx)
    const companyID = ctx.query.title

    if (!token && !userid) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }


    const res = await fetch(`${process.env.API_URL}/user/user-details`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
            "user_id": userid
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


export default Account