import { useRouter } from "next/router"
import { parseCookies } from "nookies";
import Address from "../../components/address";
import Link from 'next/link'
import SubCompanies from "../../components/sub-companies";

const CompanyDetails = ({ data }) => {
    console.warn(data);
    const router = useRouter()
    const { id } = router.query

    return (

        <>
            <div>
                <div>
                    Breadcrumb: <Link href="/companies"><a className="nav-link">Companies</a></Link>  &gt; {data?._id}
                </div>

                <ul>
                    <li><Link href="#"><a className="nav-link">General</a></Link></li>
                    <li><Link href="/companies/users"><a className="nav-link">user</a></Link></li>
                    <li><Link href="/companies/legal-watchlist"><a className="nav-link">Legal Watchlist</a></Link></li>
                    <li><Link href="/companies/aging"><a className="nav-link">Aging</a></Link></li>
                </ul>
                <Link href="#"><a className="nav-link">Edit Company</a></Link>
                _id: {data?._id}<br />
                website: {data?.website}<br />
                domain: {data?.domain}<br />
                email_id: {data?.email_id}<br />
                phone_number: {data?.phone_number?.country_code} - {data?.phone_number?.phone_number}<br />
                <Address address={data?.address} />
                is_active: {data?.is_active}<br />
                
                
                <SubCompanies subCompanies={data?.sub_companies} />

                configuration<br />
                id: {data?.configuration?.pricing_chart_id}<br />
                bank_report_count: {data?.configuration?.bank_report_count}<br />
                suppliers_report_count: {data?.configuration?.suppliers_report_count}<br />
                watchlist_count: {data?.configuration?.watchlist_count}<br />
                company_in_watchlist_count: {data?.configuration?.company_in_watchlist_count}<br />
                quick_report_price: {data?.configuration?.quick_report_price}<br />
                aging_discount: {data?.configuration?.aging_discount}<br />


                date_added: {data?.date_added}<br />
                industry_data: {data?.industry_data?._id}<br />
                industry_data: {data?.industry_data?.name}<br />
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
    const res = await fetch(`${process.env.API_URL}/company/company-detail`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
            "company_id": companyID
        })

    })
    const data = await res.json()

    /**
     * limit, start, search item
     */
    return {
        props: {
            data: data?.data
        }
    }

}
export default CompanyDetails