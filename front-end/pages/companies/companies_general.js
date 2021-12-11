import Link from 'next/link'
import SubCompanies from "../../components/sub-companies";
import { useState } from "react";
import Address from "../../components/address";

const CompaniesGeneral = (props) => {

    return (
        <>
            <div className="company_wrap">
                {/* <Link href={{
                    pathname: `/companies/edit/[title]`,
                    query: {
                        title: data?._id, // should be `title` not `id`
                    },
                }}
                    as={`/companies/edit/${data?._id}`}
                ><a href={`/companies/edit/${data?._id}`} className="btn btnedit edit_company">Edit Company</a></Link>
                */}
                <a onClick={() => { props.setData(data._id); props.setActive('editParent'); }}
                    className="btn btnedit edit_company">Edit Company</a>
                <div className="imagewrap">

                </div>
                <div className="rightdata">
                    <h4>{data?.company_name}</h4>
                    <div className="cwebsite data_block"><a href={data?.website} target="_blank">{data?.website}</a></div>
                </div>
                <div className="clearB"></div>
                <div className="cemail data_block"><a href={`mailto:${data?.email_id}`} target="_blank">{data?.email_id}</a></div>
                <div className="cphone data_block">{data?.phone_number?.country_code} - {data?.phone_number?.phone_number}</div>
                <div className="caddress data_block">
                    <Address address={data?.address} />
                </div>
                <div className="colbox2">
                    <span>Langauge</span> <strong>English</strong>
                </div>
                <div className="colbox2">
                    <span>Sub company</span> <strong>Sub Company</strong>
                </div>
                <div className="colbox2">
                    <span>Industry</span> <strong>{data?.industry_data?.name}</strong>
                </div>
                <div className="colbox2">
                    <span>Group</span> <strong>{data?.group_data[0]?.name}</strong>
                </div>
                {/* <div>
                        <span>Group</span> <strong>{data?.group_data[0]?.name}</strong>
                    </div> */}
                {/* is_active: {data?.is_active==true?'Active':'Not Active'}<br /> */}
            </div>
            <h2 className="sub-company">SubCompanies</h2>
            <div className="subcompany_wrap">
                <SubCompanies id={data?._id}
                    subCompanies={data?.sub_companies}
                    setActive={props.setActive}
                    setData={props.setData} />
            </div>
            {/* configuration<br />
                id: {data?.configuration?.pricing_chart_id}<br />
                bank_report_count: {data?.configuration?.bank_report_count}<br />
                suppliers_report_count: {data?.configuration?.suppliers_report_count}<br />
                watchlist_count: {data?.configuration?.watchlist_count}<br />
                company_in_watchlist_count: {data?.configuration?.company_in_watchlist_count}<br />
                quick_report_price: {data?.configuration?.quick_report_price}<br />
                aging_discount: {data?.configuration?.aging_discount}<br />


                date_added: {data?.date_added}<br />
                industry_data: {data?.industry_data?._id}<br />
                industry_data: {data?.industry_data?.name}<br /> */}
        </>
    )
}

export default CompaniesGeneral;