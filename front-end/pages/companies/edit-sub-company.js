import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
import { useState } from 'react'
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import Link from 'next/link'
import { Modal, Button } from "react-bootstrap";
import {
    get_company_details,
    update_company,
    remove_sub_company
} from '../api/companies';

const addCompany = ({ industry, group, pricing, company, }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => { setShow(true); setMessage(''); };

    const [company_logo_en, setCompany_logo_en] = useState("");
    const [company_logo_fr, setcompany_logo_fr] = useState("");

    const [formStatus, setFormStatus] = useState(false);
    // const [query, setQuery] = useState({ ...company.data });

    const [language, setLanguage] = useState(company.portal_language);
    const [company_name_en, setCompany_name_en] = useState(company.company_name_en || company.company_name);
    const [company_name_fr, setCompany_name_fr] = useState(company.company_name_fr || company.company_name);
    const [website, setWebsite] = useState(company.website);
    const [domain, setDomain] = useState(company.domain || '');
    const [email_id, setEmail_id] = useState(company.email_id);
    const [country_code, setCountry_code] = useState(company.phone_number.country_code);
    const [phone_number, setPhone_number] = useState(company.phone_number.phone_number);
    const [address_line, setAddress_line] = useState(company.address.address_line);
    const [province, setProvince] = useState(company.address.state_name);
    const [city, setCity] = useState(company.address.city_name);
    const [postal_code, setPostal_code] = useState(company.address.zip_code);
    const [portal_language, setPortal_language] = useState(company.portal_language);
    const [industry_id, setIndustry_id] = useState(company.industry_data._id);

    const [message, setMessage] = useState('');

    /*
    {
            // company_logo_en: "",
            // company_logo_fr: "",
            company_name_en: "",
            company_name_fr: "",
            website: "",
            domain: "",
            email_id: "",
            country_code: "",
            phone_number: "",
            address_line: "",
            state: "",
            city: "",
            zip_code: "",
            portal_language: "",
            industry_id: "",
            // groups: "",
            pricing_chart_id: "",
            bank_report_coun: "",
            suppliers_report_count: "",
            watchlist_count: "",
            company_in_watchlist_count: "",
            quick_report_price: "",
            aging_discount: ""
        }
    */
    const handleFileChangeen = (e) => {
        if (e?.target?.files) {
            console.warn(e.target.files[0])
            setCompany_logo_en(e.target.files[0]);
        }
    };

    const handleFileChangefr = (e) => {
        if (e?.target?.files) {
            console.warn(e.target.files[0])
            setCompany_logo_fr(e.target.files[0]);
        }
    };

    // const handleChange = (e) => {
    //     const name = e.target.id;
    //     const value = e.target.value;
    //     let qry = query;
    //     switch (name) {
    //         case "company_name_en": qry.company_name_en = value; break;
    //         case "company_name_fr": qry.company_name_fr = value; break;
    //         case "website": qry.webSite = value; break;
    //         case "domain": qry.domain = value; break;
    //         case "email_id": qry = email_id = value; break;
    //         case "phone_number": qry.phone_number.phone_number = value; break;
    //         case "address_line": qry.address.address_line = value; break;
    //         case "state": qry.address.state = value; break;
    //         case "city_name": qry.address.city_name = value; break;
    //         case "zip_code": qry.address.zip_code = value; break;
    //         case "portal_language": qry.portal_language = value; break;
    //         case "industry_id": qry.industry_data._id = value; break;
    //     }
    //     setQuery(qry);
    //     // setQuery((prevState) => ({
    //     //     ...prevState,
    //     //     [name]: value
    //     // }));
    // };

    const addNewCompany = async (e) => {

        e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        let body = {
            "language": 'en',
            "company_id": company._id,
            "api_token": token,
            "company_logo_en": company_logo_en,
            "company_logo_fr": company_logo_fr,
            "company_name_en": company_name_en,
            "company_name_fr": company_name_fr,
            "website": website,
            "domain": domain,
            "email_id": email_id,
            "country_code": country_code,
            "phone_number": phone_number,
            "address_line": address_line,
            "state": province,
            "city": city,
            "zip_code": postal_code,
            "portal_language": portal_language,
            "industry_id": industry_id,
        }

        console.log(body)


        const addCompanyDB = update_company(body)
            .then(addCompanyDB => {
                if (addCompanyDB.status == 200) router.push(`/companies/${company.parent_company._id}`)
                else {
                    let data = await addCompanyDB.json();
                    setMessage(data.data);
                }
            })

        setShow(false)
    }

    const removeCompany = async () => {
        // remove_sub_company({
        //         api_token: token,
        //         company_id: query._id
        //     })

        router.push(`/companies/${company.parent_company._id}`)
    }

    return (
        <>
            <Header message={message} />
            <div className="breadcrumb">

                <ul className=" me-auto mb-2 mb-lg-0">
                    <li><Link href={`/companies/${company.parent_company._id}`}>
                        <a className="nav-link">&lt;&lt; {company.parent_company.company_name}</a></Link></li>
                    {/* <li><Link href="/companies"><a className="nav-link">Companies</a></Link></li> */}
                    <li>Edit Company</li>
                </ul>
            </div>
            <div className="col-lg-7 companyform">
                <form method="POST" encType="multipart/form-data" >
                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_logo_en" className="form-label">English Logo</label>
                            <input className="form-control" name="company_logo_en" type="file" id="company_logo_en" value={company_logo_en} onChange={(e) => handleFileChangeen(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_logo_fr" className="form-label">French Logo</label>
                            <input className="form-control" name="company_logo_fr" type="file" id="company_logo_fr" value={company_logo_fr} onChange={(e) => handleFileChangefr(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_name_en" className="form-label">Company Name (English)</label>
                            <input type="text" className="form-control" id="company_name_en" placeholder="" value={company_name_en || company_name} onChange={(e) => setCompany_name_en(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_name_fr" className="form-label">Company Name (French)</label>
                            <input type="text" className="form-control" id="company_name_fr" placeholder="" value={company_name_fr || company_name} onChange={(e) => setCompany_name_fr(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" className="form-control" id="website" placeholder="" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="domain" className="form-label">Company domain name</label>
                            <input type="text" className="form-control" id="domain" placeholder="" value={domain} onChange={(e) => setDomain(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="email_id" className="form-label">Email</label>
                            <input type="text" className="form-control" id="email_id" placeholder="" value={email_id} onChange={(e) => setEmail_id(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="phone_number" className="form-label">Phone NUmber</label>
                            <input type="text" className="form-control" id="phone_number" placeholder="" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="address_line" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address_line" placeholder="" value={address_line} onChange={(e) => setAddress_line(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="province" className="form-label">Province</label>
                            <input type="text" className="form-control" id="province" placeholder="" value={province} onChange={(e) => setProvince(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" placeholder="" value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="zip_code" className="form-label">Postal Code</label>
                            <input type="text" className="form-control" id="postal_code" placeholder="" value={postal_code} onChange={(e) => setPostal_code(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="portal_language" className="form-label">Portal Language</label>
                            <select className="form-select form-select-sm" value={portal_language} id="portal_language" aria-label=".form-select-sm example" onChange={(e) => setPortal_language(e.target.value)}>
                                <option disabled>Select Language</option>
                                <option value="en">English</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="industry_id" className="form-label">Industry</label>
                            <select className="form-select form-select-sm" value={industry_id} name="industry_id" id="industry_id" aria-label=".form-select-sm example" onChange={(e) => setIndustry_id(e.target.value)}>
                                <option disabled>Open this select menu</option>
                                {industry?.data.map((item) => (
                                    <option value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>



                    <div className="row">
                        <div className="col">
                            <p>&nbsp;</p>
                            <button type="button" className="btn btn-primary" onClick={handleShow}>Save</button> &nbsp;
                            <button type="button" className="btn btn-primary" onClick={removeCompany}>Remove Company</button>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <p>&nbsp;</p>
                        </div>
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Sub Company</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Please click on <strong>"confirm"</strong> to add this company</Modal.Body>
                        <Modal.Footer>
                            <button type="button" className="btn btnedit" onClick={handleClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary" onClick={addNewCompany}>Confirm</button>
                        </Modal.Footer>
                    </Modal>
                </form>
            </div>
        </>
    )
}


// export async function getStaticProps(context) {
export async function getServerSideProps(ctx) {

    const subID = ctx.query.sid
    const { token } = parseCookies(ctx)
    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    const resIndustry = await fetch(`${process.env.API_URL}/industry/list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })
    })
    const industry = await resIndustry.json()

    const resGroup = await fetch(`${process.env.API_URL}/group/list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })
    })
    const group = await resGroup.json()


    const subData = get_company_details({
        "language": 'en',
        "api_token": token,
        "company_id": subID
    })

    // const resPricing = await fetch(`${process.env.API_URL}/group/list`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //         "language": 'en',
    //         "api_token": token,
    //     })
    // })
    // const pricing = await resPricing.json()


    /** 
     * limit, start, search item
     */
    return {
        props: {
            industry,
            group,
            pricing: [],
            company: subData.data

        }
    }

}

export default addCompany
