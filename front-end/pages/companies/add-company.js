import Header from "../../components/header"
import { useRouter } from "next/router"
import Pagination from "../../components/datatable/pagination"
import { useState } from 'react'
import Cookies from "js-cookie"
import { parseCookies } from "nookies"
import Link from 'next/link'
import { Modal, Button } from "react-bootstrap";
import {
    add_company
} from '../api/companies';

const addCompany = ({ industry, group, pricing }) => {
    const [show, setShow] = useState(false);
    const [ischecked, setIsChecked] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [company_logo_en, setCompany_logo_en] = useState("");
    const [company_logo_fr, setcompany_logo_fr] = useState("");

    const [formStatus, setFormStatus] = useState(false);
    const [query, setQuery] = useState({
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
        groups: [],
        pricing_chart_id: "",
        bank_report_count: "",
        suppliers_report_count: "",
        watchlist_count: "",
        company_in_watchlist_count: "",
        quick_report_price: "",
        aging_discount: ""
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

    const handleChange = () => (e) => {
        // alert(e.target.name);
        const name = e.target.name;
        const value = e.target.value;
        setQuery((prevState) => ({
            ...prevState,
            [name]: value
        }));
        // console.log(ischecked)
    };

    const addNewCompany = async (e) => {

        console.log(query);
        // e.preventDefault();
        const token = Cookies.get('token');
        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }


        let data = new FormData();
        // data.append('company_logo_en', company_logo_en);
        // data.append('company_logo_fr', query.company_logo_fr);
        data.append('company_name_en', query.company_name_en);
        data.append('company_name_fr', query.company_name_fr);
        data.append('website', query.website);
        data.append('domain', query.domain);
        data.append('email_id', query.email_id);
        data.append('phone_number', query.phone_number);
        data.append('address_line', query.address_line);
        data.append('state', query.state);
        data.append('city', query.city);
        data.append('zip_code', query.zip_code);
        data.append('portal_language', query.portal_language);
        data.append('industry_id', query.industry_id);
        data.append('pricing_chart_id', query.pricing_chart_id);
        data.append('bank_report_count', query.bank_report_count);
        data.append('suppliers_report_count', query.suppliers_report_count);
        data.append('watchlist_count', query.watchlist_count);
        data.append('company_in_watchlist_count', query.company_in_watchlist_count);
        data.append('quick_report_price', query.quick_report_price);
        data.append('aging_discount', query.aging_discount);
        data.append('language', 'en');
        data.append('api_token', token);
        data.append('company_logo_en', company_logo_en);
        data.append('company_logo_fr', company_logo_fr);
        data.append('country_code', query.country_code);
        // data.append('groups', ischecked);

        add_company(data)
            .then(addCompanyDB => addCompanyDB.json())
            .then(res2 => {
                if (res2.status_code == 403) {
                    setShow(false);
                    alert("Error " + res2.data);
                } else if (res2.status_code == 200) {
                    setShow(false);
                } else {
                    setShow(false);
                }
            })
    }


    const handleOnChange = (e) => {
        var isChecked1 = e.target.checked;
        var item = e.target.value;

        // console.log(item)

        if (isChecked1) {
            // setIsChecked([...ischecked, item]);
            setIsChecked(oldArray => [...oldArray, item]);
            // alert(1)
        } else {
            // alert(2)
            let arr = ischecked.filter(val => val !== item);
            setIsChecked(arr);
        }
        // console.log(ischecked)
    };


    return (
        <>
            <Header />
            <div className="breadcrumb">
                <ul className=" me-auto mb-2 mb-lg-0">
                    <li className="back"><Link href="/companies"><a className="nav-link">Back</a></Link></li>
                    <li><Link href="/companies"><a className="nav-link">Companies</a></Link></li>
                    <li>Add Company</li>
                </ul>
            </div>
            <div className="col-lg-7 companyform">
                <form method="POST" encType="multipart/form-data" onSubmit={(e) => addNewCompany(e)}>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_logo_en" className="form-label">English Logo</label>
                            <input className="form-control" name="company_logo_en" type="file" id="company_logo_en" value={query.company_logo_en} onChange={handleFileChangeen()} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_logo_fr" className="form-label">French Logo</label>
                            <input className="form-control" name="company_logo_fr" type="file" id="company_logo_fr" value={query.company_logo_fr} onChange={handleFileChangefr()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_name_en" className="form-label">Company Name (English)</label>
                            <input type="text" name="company_name_en" className="form-control" id="company_name_en" placeholder="" value={query.company_name_en} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="company_name_fr" className="form-label">Company Name (French)</label>
                            <input type="text" name="company_name_fr" className="form-control" id="company_name_fr" placeholder="" value={query.company_name_fr} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="website" className="form-label">Website</label>
                            <input type="text" name="website" className="form-control" id="website" placeholder="" value={query.website} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="domain" className="form-label">Company domain name</label>
                            <input type="text" name="domain" className="form-control" id="domain" placeholder="" value={query.domain} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="email_id" className="form-label">Email</label>
                            <input type="text" name="email_id" className="form-control" id="email_id" placeholder="" value={query.email_id} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="phone_number" className="form-label">Phone NUmber</label>
                            <input type="text" name="phone_number" className="form-control" id="phone_number" placeholder="" value={query.phone_number} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="address_line" className="form-label">Address</label>
                            <input type="text" name="address_line" className="form-control" id="address_line" placeholder="" value={query.address_line} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="state" className="form-label">State</label>
                            <input type="text" name="state" className="form-control" id="state" placeholder="" value={query.state} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="city" className="form-label">City</label>
                            <input type="text" name="city" className="form-control" id="city" placeholder="" value={query.city} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="zip_code" className="form-label">Zip</label>
                            <input type="text" name="zip_code" className="form-control" id="zip_code" placeholder="" value={query.zip_code} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="portal_language" className="form-label">Portal Language</label>
                            <select className="form-select" name="portal_language" id="portal_language" aria-label=".form-select-sm example" onChange={handleChange()}>
                                <option selected>Select Language</option>
                                <option value="en">English</option>
                                <option value="fr">French</option>
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="industry_id" className="form-label">Industry</label>
                            <select className="form-select" name="industry_id" id="industry_id" aria-label=".form-select-sm example" onChange={handleChange()}>
                                <option selected>Open this select menu</option>
                                {industry?.data.map((item) => (
                                    <option value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="groups" className="form-label">Add to group</label>
                            <div className="chkox">
                                {group?.data.map((item) => (
                                    <div className="form-check">
                                        <label className="form-check-label" htmlFor={item._id}>{item.name}</label>
                                        <input className="form-check-input" name="groups" type="checkbox" value={item._id} id={item._id} onChange={(e) => handleOnChange(e)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <h3 className="subtitle">Configurations</h3>
                    <div className="row">
                        <div className="col-5">
                            <label htmlFor="pricing_chart_id" className="form-label">Pricing Chart</label>
                            <select className="form-select"
                                name="pricing_chart_id" id="pricing_chart_id"
                                aria-label=".form-select-sm example"
                                onChange={handleChange()}
                            >
                                <option selected>Pricing Chart</option>
                                {pricing?.data.map((item) => (
                                    <option value={item._id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="bank_report_count" className="form-label">Maximum Bank Account Report Limit</label>
                            <input type="text" className="form-control" name="bank_report_count" id="bank_report_count" placeholder="" value={query.bank_report_count} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="suppliers_report_count" className="form-label">Maximum Suppliers Report Limit</label>
                            <input type="text" className="form-control" name="suppliers_report_count" id="suppliers_report_count" placeholder="" value={query.suppliers_report_count} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="company_in_watchlist_count" className="form-label">Maximum Companies in Watchlists</label>
                            <input type="text" className="form-control" name="company_in_watchlist_count" id="company_in_watchlist_count" placeholder="" value={query.company_in_watchlist_count} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="watchlist_count" className="form-label">Maximum Number of Watchlist</label>
                            <input type="text" className="form-control" name="watchlist_count" id="watchlist_count" placeholder="" value={query.watchlist_count} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label htmlFor="quick_report_price" className="form-label">Extra Price For Quick Orders</label>
                            <input type="text" className="form-control" name="quick_report_price" id="quick_report_price" placeholder="" value={query.quick_report_price} onChange={handleChange()} />
                        </div>
                        <div className="col">
                            <label htmlFor="aging_discount" className="form-label">Discount For Aging Uploads</label>
                            <input type="text" className="form-control" name="aging_discount" id="aging_discount" placeholder="" value={query.aging_discount} onChange={handleChange()} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <p>&nbsp;</p>
                            <button type="button" className="btn btn-primary" onClick={handleShow}>Add Company</button>
                        </div>
                    </div>


                    <div className="row">
                        <div className="col">
                            <p>&nbsp;</p>
                        </div>
                    </div>


                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Company</Modal.Title>
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

    const resPricing = await fetch(`${process.env.API_URL}/pricing/list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
        })
    })
    const pricing = await resPricing.json()


    /** 
     * limit, start, search item
     */
    return {
        props: {
            industry,
            group,
            pricing
        }
    }

}

export default addCompany
