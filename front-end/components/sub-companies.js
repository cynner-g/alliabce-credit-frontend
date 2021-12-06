import Address from "./address";
import Link from 'next/link'

const SubCompanies = function ({ id, subCompanies }) {
    return (
        <>
            <Link href={`/companies/add-sub-company/?id=${id}`}><a className="btn btnedit add_company">Add Sub Company</a></Link>
            {subCompanies?.map((item) => (
                <>
                    <div className="company_wrap">
                        <Link href={`/companies/edit-sub-company/${item._id}`}><a className="btn btnedit edit_company">Edit Sub Company</a></Link>
                        <div className="imagewrap">

                        </div>
                        <div className="rightdata">
                            <h4>{item.company_name}</h4>
                            <div className="cwebsite data_block"><a href={item?.website} target="_blank">{item?.website}</a></div>
                        </div>
                        <div className="clearB"></div>
                        <div className="cemail data_block"><a href={`mailto:${item?.email_id}`} target="_blank">{item?.email_id}</a></div>
                        <div className="cphone data_block">{item?.phone_number?.country_code} - {item?.phone_number?.phone_number}</div>
                        <div className="caddress data_block">
                            <Address address={item?.address} />
                        </div>
                        <div className="colbox2">
                            <span>Langauge</span> <strong>English</strong>
                        </div>


                        {/* <div>{item.is_active}</div>
                    <div>{item.company_name}</div>
                    <div>industry_data: {item?.industry_data?._id}</div>
                    <div>industry_data: {item?.industry_data?.name}</div>
                    <div>{item.date_added}</div>
                    <div>{item._id}</div>
                    <div>{item._id}</div> */}
                    </div>
                </>
            ))}

        </>
    )
}
export default SubCompanies;