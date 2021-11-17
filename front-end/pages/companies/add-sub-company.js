import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
import { useState } from 'react'
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import Link from 'next/link'

const addCompany = ({ industry, group, pricing }) => {
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
    const [zip_code, setzip_code] = useState("");
    const [portal_language, setportal_language] = useState("");
    const [industry_id, setindustry_id] = useState("");



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
        zip_code: "",
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

    const addNewSubCompany = async (e) => {

        e.preventDefault();
        const token = Cookies.get('token');
        const companyID = Cookies.get('company_id');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        const addCompanyDB = await fetch(`http://dev.alliancecredit.ca/company/add-sub-company`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
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
                "zip_code": zip_code,
                "portal_language": portal_language,
                "industry_id": industry_id,
            })
        })
    }




    return (
        <>
            <Header />
            <div className="breadcrumb">
                <ul className=" me-auto mb-2 mb-lg-0">
                    <li><Link href="/companies"><a className="nav-link">Companies</a></Link></li>
                    <li>Add Company</li>
                </ul>
            </div>
            <div className="col-lg-7">
                <form method="POST" encType="multipart/form-data" onSubmit={(e) => addNewSubCompany(e)}>
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
                            <label htmlFor="company_name_fr" className="form-label">Company Name (English)</label>
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
                            <label htmlFor="phone_number" className="form-label">Phone NUmber</label>
                            <input type="text" className="form-control" id="phone_number" placeholder="" value={phone_number} onChange={(e) => setphone_number(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address_line" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address_line" placeholder="" value={address_line} onChange={(e) => setaddress_line(e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="state" className="form-label">State</label>
                            <input type="text" className="form-control" id="state" placeholder="" value={state} onChange={(e) => setstate(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" className="form-control" id="city" placeholder="" value={city} onChange={(e) => setcity(e.target.value)} />
                        </div>
                        <div className="col">
                            <label htmlFor="zip_code" className="form-label">Zip</label>
                            <input type="text" className="form-control" id="zip_code" placeholder="" value={zip_code} onChange={(e) => setzip_code(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="portal_language" className="form-label">Portal Language</label>
                        <select className="form-select form-select-sm" id="portal_language" aria-label=".form-select-sm example" onChange={(e) => setportal_language(e.target.value)}>
                            <option selected>Select Language</option>
                            <option value="en">English</option>
                            <option value="fr">French</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="industry_id" className="form-label">Industry</label>
                        <select className="form-select form-select-sm" name="industry_id" id="industry_id" aria-label=".form-select-sm example" setindustry_id={(e) => setwebsite(e.target.value)}>
                            <option selected>Open this select menu</option>
                            {industry?.data.map((item) => (
                                <option value={item._id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
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
            pricing: []
        }
    }

}

export default addCompany
