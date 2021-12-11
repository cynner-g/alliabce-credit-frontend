import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import Address from "../../components/address";
import Link from 'next/link'
import SubCompanies from "../../components/sub-companies";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";
import { useState } from "react";
import Header from "../../components/header";
import TabButton from "../../components/tabbutton";
import Cookies from "js-cookie";
import { get_company_details } from '../api/companies'

import CompaniesGeneral from './companies_general'

const CompanyDetails = ({ data }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    console.log(data);
    const router = useRouter()
    const { id } = router.query
    Cookies.set('viewed_company_id', data?._id)
    return (

        <>
            <Header />
            <div>

                <div className="breadcrumb">
                    <ul className=" me-auto mb-2 mb-lg-0">
                        <li><Link href="/companies"><a className="nav-link">Companies</a></Link></li>
                        <li>{data?.company_name}</li>
                    </ul>
                </div>


                {/* <TabButton id={data?._id} url={'#'} /> */}
                <Tabs defaultActiveKey="general" className="activities_tabContainer">
                    <Tab eventKey='general' title="General">
                        <CompaniesGeneral data={data} />
                    </Tab>
                    <Tab eventKey='users' title="Users"></Tab>
                    <Tab eventKey='watchlist' title="Legal Watchlist"></Tab>
                    <Tab eventKey='aging' title="Aging"></Tab>
                </Tabs>


            </div>

        </>
    )
}

export async function getServerSideProps(ctx) {
    // const start = +page === 1 ? 0 : (+page + 1)

    // const { locale, locales, defaultLocale, asPath } = useRouter();
    const { token } = parseCookies(ctx)
    const companyID = ctx.params.id
    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const data = await get_company_details({
            "language": 'en',
            "api_token": token,
            "company_id": companyID
        })

    /**
     * limit, start, search item
     */
    if (data) {
        return {
            props: {
                data: data?.data
            }
        }
    }
    else return { props: { data: null } };
}
export default CompanyDetails

