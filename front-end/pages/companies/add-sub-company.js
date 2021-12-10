import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
import { useState } from 'react'
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import Link from 'next/link'
import { Modal, Button } from "react-bootstrap";
import { add_sub_company } from '../api/companies';

const addCompany = ({ industry, group, pricing, msg }) => {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [company_logo_en, setCompany_logo_en] = useState("");
    const [company_logo_fr, setcompany_logo_fr] = useState("");

    const [company_name_en, setCompany_name_en] = useState("");
    const [company_name_fr, setcompany_name_fr] = useState("");
    const [website, setwebsite] = useState("");
    const [email_id, setemail_id] = useState("");
    const [country_code1, setcountry_code1] = useState("");
    const [phone_number, setphone_number] = useState("");
    const [address_line, setaddress_line] = useState("");
    const [state, setstate] = useState("");
    const [city, setcity] = useState("");
    const [postal_code, setpostal_code] = useState("");
    const [portal_language, setportal_language] = useState("");
    const [industry_id, setindustry_id] = useState("");
    const [message, setMessage] = useState(msg);


    const [formStatus, setFormStatus] = useState(false);
    const [query, setQuery] = useState({
        company_name_en: "",
        company_name_fr: "",
        website: "",
        email_id: "",
        country_code: "",
        phone_number: "",
        address_line: "",
        state: "",
        city: "",
        postal_code: "",
        portal_language: "",
        industry_id: "",
    });


    const handleFileChangeen = () => (e) => {
        console.warn(e.target.files[0])
        // setQuery((prevState) => ({
        //     ...prevState,
        //     company_logo_en: e.target.files[0]
        // }));
        setCompany_logo_en(e.target.files[0]);
    };

    const handleFileChangefr = () => (e) => {
        // setQuery((prevState) => ({
        //     ...prevState,
        //     company_logo_fr: e.target.files[0]
        // }));
        setcompany_logo_fr(e.target.files[0])
    };

    // const handleChange = () => (e) => {
    //     const name = e.target.name;
    //     const value = e.target.value;
    //     setQuery((prevState) => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    const addNewCompany = async (e) => {

        e.preventDefault();
        const token = Cookies.get('token');
        const companyID = Cookies.get('viewed_company_id');
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
            "api_token": token,
            "parent_company_id": companyID,
            "company_logo_en": company_logo_en,
            "company_logo_fr": company_logo_fr,
            "company_name": "missing layout not matching with API",
            "company_name_en": company_name_en,
            "company_name_fr": company_name_fr,
            "website": website,
            "email_id": email_id,
            "country_code1": "+1",
            "phone_number": phone_number,
            "address_line": address_line,
            "state": state,
            "city": city,
            "postal_code": postal_code,
            "portal_language": portal_language,
            "industry_id": industry_id,
        }

        console.log(body);

        add_sub_company(body)
            .then(addCompanyDB => {
                if (addCompanyDB.status === 200) {
                    router.push(`/companies/${companyID}`)
                }
                else {
                    setMessage(addCompanyDB.statusText);
                }
            })
    }




    return (
        <>
            <Header statusMessage={message} />
            <div className="breadcrumb">
                <ul className=" me-auto mb-2 mb-lg-0">
                    <li className="back"><Link href="/companies"><a className="nav-link">Back</a></Link></li>
                    <li><Link href="/companies"><a className="nav-link">Companies</a></Link></li>
                    <li>Add Sub Company</li>
                </ul>
            </div>
            <div className="col-lg-7 companyform">
                <form method="POST" encType="multipart/form-data">
                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_logo_en" className="form-label">English Logo</label>
                            <input className="form-control" name="company_logo_en" type="file" id="company_logo_en" onChange={handleFileChangeen()} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_logo_fr" className="form-label">French Logo</label>
                            <input className="form-control" name="company_logo_fr" type="file" id="company_logo_fr" onChange={handleFileChangefr()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_name_en" className="form-label">Company Name (English)</label>
                            <input type="text" className="form-control" id="company_name_en" placeholder="" value={company_name_en} onChange={(e) => setCompany_name_en(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_name_fr" className="form-label">Company Name (French)</label>
                            <input type="text" className="form-control" id="company_name_fr" placeholder="" value={company_name_fr} onChange={(e) => setcompany_name_fr(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" className="form-control" id="website" placeholder="" value={website} onChange={(e) => setwebsite(e.target.value)} />
                        </div>
                        <div className="col">

                        </div>
                    </div>





                    <div className="row">
                        <div className="col">
                            <label htmlFor="email_id" className="form-label">Email</label>
                            <input type="text" className="form-control" id="email_id" placeholder="" value={email_id} onChange={(e) => setemail_id(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="phone_number" className="form-label">Phone Number</label>
                            <input type="text" className="form-control" id="phone_number" placeholder="" value={phone_number} onChange={(e) => setphone_number(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="address_line" className="form-label">Address</label>
                            <input type="text" className="form-control" id="address_line" placeholder="" value={address_line} onChange={(e) => setaddress_line(e.target.value)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="state" className="form-label">Province</label>
                            <input type="text" className="form-control" id="state" placeholder="" value={state} onChange={(e) => setstate(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" placeholder="" value={city} onChange={(e) => setcity(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="postal_code" className="form-label">Postal Code</label>
                            <input type="text" className="form-control" id="postal_code" placeholder="" value={postal_code} onChange={(e) => setpostal_code(e.target.value)} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="portal_language" className="form-label">Portal Language</label>
                            <select className="form-select" id="portal_language"
                                aria-label="" onChange={(e) => setportal_language(e.target.value)}
                                defaultValue='select'>
                                <option value='select' disabled>Select Language</option>
                                <option value="en">English</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="industry_id" className="form-label">Industry</label>
                            <select className="form-select" name="industry_id" id="industry_id"
                                aria-label="" onChange={(e) => setindustry_id(e.target.value)}
                                defaultValue='industrySelect'>
                                <option value='industrySelect' disabled>Please choose industry</option>
                                {industry?.data.map((item, idx) => (
                                    <option key={idx} value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>&nbsp;</p>
                            <button type="button" className="btn btn-primary" onClick={handleShow}>Save</button>
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
                            <button type="button" className="btn btn-primary" onClick={(e) => addNewCompany(e)}>Confirm</button>
                        </Modal.Footer>
                    </Modal>
                </form>
            </div>
        </>
    )
}


// export async function getStaticProps(context) {
export async function getServerSideProps(ctx) {

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
            message: ''
        }
    }

}

export default addCompany
