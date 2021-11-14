import Address from "./address";
import Link from 'next/link'

const SubCompanies = function ({ subCompanies }) {
    return (
        <>
            <Link href="/companies/add-sub-company"><a className="nav-link">Add Sub Company</a></Link>
            {subCompanies?.map((item) => (
                <>
                    <Link href={`/companies/edit-sub-company/${item._id}`}><a className="nav-link">Edit Sub Company</a></Link>
                    <div>{item._id}</div>
                    <div>{item.email_id}</div>
                    <div>phone_number: {item?.phone_number?.country_code} - {item?.phone_number?.phone_number}<br /></div>
                    <Address address={item?.address} />
                    <div>{item.is_active}</div>
                    <div>{item.company_name}</div>
                    <div>industry_data: {item?.industry_data?._id}</div>
                    <div>industry_data: {item?.industry_data?.name}</div>
                    <div>{item.date_added}</div>
                    <div>{item._id}</div>
                    <div>{item._id}</div>
                </>
            ))}

        </>
    )
}
export default SubCompanies;