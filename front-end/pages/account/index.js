import Address from "../../components/address"
import Header from "../../components/header"
import Link from 'next/link'
import TabButtonUser from "../../components/tabbuttonuser"
import { parseCookies } from "nookies"
import UserSidebar from "../../components/user_sidebar"
import { get_user_details, list_sub_admin } from '../api/users'
const Account = function ({ data }) {
    console.log(data)
    try {
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
                                <TabButtonUser id={data._id} />

                                <div className="company_wrap">
                                    {/* <Link href={{
                                pathname: `/companies/edit/[title]`,
                                query: {
                                    title: data._id, // should be `title` not `id`
                                },
                            }}
                                as={`/companies/edit/${data._id}`}
                            ><a className="btn btnedit edit_company">Edit Company</a></Link> */}
                                    <div className='my_companies_title'>My Company</div>
                                    <div className="company_blocks">
                                        <div className="imagewrap"></div>
                                        <div className="rightdata">
                                            <h4>{data?.parent_companies?.company_name}</h4>
                                            <div className="cwebsite data_block"><a href={data?.parent_companies?.website} target="_blank">{data?.parent_companies?.website}</a></div>
                                        </div>
                                        <div className="clearB"></div>



                                        <div className="cemail data_block"><a href={`mailto:${data?.parent_companies?.website}`} target="_blank">{data?.parent_companies?.website}</a></div>
                                        <div className="cphone data_block">{data?.parent_companies?.phone_number?.country_code} - {data?.parent_companies?.phone_number?.phone_number}</div>
                                        <div className="caddress data_block">
                                            <Address address={data?.parent_companies?.address} />
                                        </div>
                                        <div>
                                            <span>Langauge</span> <strong>{data?.parent_companies?.portal_language}</strong>
                                        </div>
                                        <div className="isactive">Active: {data?.parent_companies?.is_active ? 'Active' : 'Not Active'}</div>

                                    </div>

                                    <div className='my_companies_title'>Sub-Company</div>
                                    {data.child_companies?.reverse().map((item => {
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
    catch (ex) {
        console.log(ex.message)
    }
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

    const body = {
        "language": 'en',
        "api_token": token,
        "user_id": userid
    }

    const data = await get_user_details(body)

    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: data || [],
        }
    }
}


export default Account