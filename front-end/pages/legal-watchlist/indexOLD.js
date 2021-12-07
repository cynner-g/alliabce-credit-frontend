import Header from "../../components/header";
import { useState, useEffect } from 'react';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import TabButton from "../../components/tabbutton"
import Select from 'react-select';
import styles from "./index.module.css";
import { parseCookies } from "nookies"
import Cookies from "js-cookie"
import { useRouter } from 'next/router'

const LISTS = 0;
const COMPANIES = 1;
const EMAILS = 2;
const BULK = 3;

const LegalWatchlist = (props) => {
    let router = useRouter();
    const qstr = router.query;
    const [watchedCompanies, setWatchedCompanies] = useState([]);
    const [totalCompaniesAllowed, setTotalCompaniesAllowed] = useState(props.data.total_companies_allowed)
    const [totalCompaniesCreated, setTotalCompaniesCreated] = useState(props.data.total_companies_created)
    const [totalWatchlistsAllowed, setTotalWatchlistsAllowed] = useState(props.data.total_watchlist_allowed)
    const [totalWatchlistsCreated, setTotalWatchlistsCreated] = useState(props.data.total_watchlist_created)

    const [watchLists, setWatchLists] = useState(props.data.watchlist);
    const [tmpWatched, setTmpWatched] = useState([]);
    const [emails, setEmails] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState();
    const [sort, setSort] = useState();
    const [is_desc, setIs_desc] = useState(false);
    const [currentWatchlist, setCurrentWatchlist] = useState();
    const [showCreate, setShowCreate] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [data, setData] = useState([]);
    const [provinces, setProvinceList] = useState([]);
    const [wlName, setWlName] = useState();
    const [newCompany, setNewCompany] = useState({
        name: "",
        refNum: "",
        provinces: {

        }
    })

    let companyList = [];

    const fetch_data = async () => {
        const token = Cookies.get('token');
        const query = ctx.query;

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }

        let body = {
            "api_token": token
        }

        let cid = query.cid;

        if (cid) body.company_id = cid;

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/list-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        const resCompaniesData = await resCompanies.json()
        if (resCompaniesData?.data) {
            setWatchlists(data)
        }
    }

    const resetNewCompany = () => {
        setNewCompany({
            name: "",
            refNum: "",
            provinces: {
                ON: false,
                QC: false,
                NS: false,
                NB: false,
                MB: false,
                BC: false,
                PE: false,
                SK: false,
                AB: false,
                NL: false,
                NT: false,
                YT: false,
                NU: false
            }
        })
    }

    const setWatchlist = async (watchlist) => {

        setCurrentWatchlist(watchlist);

        //get companies for this watchlist
        const token = Cookies.get('token');

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
        let pageSize = 15;

        let body = {
            "api_token": token,
            watchlist_id: watchlist,
            skip: currentPage * pageSize,
            limit: currentPage * pageSize + pageSize,
            is_desc: is_desc,
            sort_by: sort
        }

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/companies-in-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        let list = await resCompanies.json();
        setWatchedCompanies(list.data);
    }

    const getProvinceList = async () => {
        const token = Cookies.get('token')

        const provincesList = await fetch(`${process.env.API_URL}/province/list-province`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                api_token: token,
                language: 'en'
            })
        })

        console.log(provincesList)
        const provinceData = await provincesList.json();
        setProvinceList(provinceData.data);

        //add the province by id to the provinces JSON in new company
        let co = newCompany;

        for (let prov of provinceData.data) {
            co.provinces[prov._id] = false;
        }

        setNewCompany(co);

    }
    useEffect(() => { //componentDidMount
        getProvinceList();


        if (watchLists.length > 0) setWatchlist(watchLists[0]._id);
    }, [])


    const watchlistAdded = async () => {
        let wl = watchLists;
        // wl.push(wlName)
        const { token } = parseCookies(ctx)
        const cid = router.query?.cid;
        let body = {
            api_token: token,
            name: wlName,
            company_id: cid
        }

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/create-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        await fetch_data();
        setWlName(null);
        setShowCreate(false);
        setWatchlist(wl[wl.length - 1]._id);
    }

    const companyAdded = async () => {
        setShowAdd(false);
        let company = newCompany;
        console.log("New Company: ", company)

        let provinces = [];

        for (let province in company.provinces) {
            if (company.provinces.ALL) { provinces = ["ALL"] }
            else if (company.provinces.hasOwnProperty(province)) {
                if (company.provinces[province] == true) {
                    provinces.push(province)
                }
            }
        }

        const token = Cookies.get('token');
        const cid = router.query?.cid;
        let body = {
            api_token: token,
            watchlist_id: currentWatchlist,
            provience_ids: provinces,
            reference_number: company.refNum,
            company_name: company.name,
            company_id: cid
        }

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/add-company-to-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        fetch_data();
    }

    const headData = () => {
        let options = [];

        if (watchLists) {
            watchLists.forEach((row, index) => {
                options.push({ value: row._id, label: row.name });
            })
        }
        let value = options[0].value;
        if (currentWatchlist) value = currentWatchlist
        return (
            <>
                {parseCookies().role == "admin" ? <TabButton id={qstr.cid || 0} url={''} /> : ''}
                <Row>
                    <Col sm={3}>
                        <div style={{ width: '200px' }}>
                            <Select options={options} value={
                                options.filter(option => option.value === value)
                            } onChange={(e) => setWatchlist(e.value)} />
                        </div>
                    </Col>
                    <Col sm={3}><button disabled>Create New Watchlist</button></Col>
                    <Col sm={6} style={{ textAlign: 'right' }} className="mr0">Companies Added: {totalCompaniesCreated}/{totalCompaniesAllowed}</Col>
                </Row>
            </>
        )
    }

    const createWatchList = () => {
        return (
            <>
                <Row>
                    <Col sm={{ span: 6, offset: 3 }} className={styles.centered}>
                        <button className='btn btn-primary' onClick={() => setShowCreate(true)}>Create New Watchlist</button>
                        <br /><br />
                        There are no watchlists to show.  Click <span className={styles.bolder}>"Create New Watchlist" <br /></span>
                        button to add a new watchlist
                    </Col>
                </Row>
            </>
        )
    }

    const showCompany = () => {
        showAdd(true);
    }

    const buildCompanyButtons = () => {
        // if (!emailList) {
        return <>
            <button className='btn btn-primary' id='btnCompanies' onClick={() => setShowAdd(true)}>Add company</button>&nbsp;
            <button className='btn btn-primary' id='btnEmails' onClick={() => setEmailList(true)} >Add email</button>
            <br /><br />
        </>
        // }
        // else {
        //     return (
        //         <button className='btn btn-primary' onClick={() => setEmailList(false)}>Company List</button>
        //     )
        // }
    }


    const addCompanies = () => {
        let ret = (
            <>
                <Container>
                    <Row>
                        {headData()}
                        <br />
                    </Row>
                    <Row>
                        <Col>
                            {buildCompanyButtons()}
                        </Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col sm={{ span: 6, offset: 3 }} className={styles.centered}>
                            There are no companies in this watchlist.  Click <span className={styles.bolder}>"Add Company" <br /></span>
                            button to add companies to this watchlist
                        </Col>
                    </Row>
                </Container>
            </>
        );
        return ret;
    }

    const showCompanies = () => {
        let list = watchedCompanies;
        // if (!list || list.length == 0) list = companyList;
        return (<>
            <Container>
                <Row>
                    {headData()}
                </Row>
                <Row>
                    <Col>
                        {buildCompanyButtons()}
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
                <Row>

                    <table>
                        <thead>
                            <tr><th>Company Name</th>
                                <th>Ref Number</th>
                                <th>Date Added</th>
                                <th>Provinces</th>
                                <th>Flagged</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((row, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>{row.name}</td>
                                        <td>{row.refNum}</td>
                                        <td>
                                            {new Date(row.dateAdded).toLocaleDateString()}<br />
                                            <div style={{ marginTop: '-5px', fontSize: '9px' }}>
                                                {new Date(row.dateAdded).toLocaleTimeString()}</div></td>
                                        <td>{row.provinceArray}</td>
                                        <td></td>
                                        <td>
                                            {/* <button className={styles.tblButton + ' btn btn-primary'}>View More</button> */}
                                            <button className={styles.tblButton + ' btn btn-warning'}>Remove</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Row>
            </Container>
        </>)
    }

    const updateNewEmail = (e) => {
        setTmpEmail(e);
    }

    const saveNewEmail = () => {
        let emails = emails;
        let tmpEmail = tmpEmail
        if (emails?.findIndex(email =>
            email?.email == tmpEmail &&
            email?.watchlist == currentWatchlist) == -1) {

            emails.push({ email: tmpEmail, watchlist: currentWatchlist, dateAdded: new Date() });
            setEmails(emails);
        }
    }
    const removeEmail = (email) => {
        let emails = emails
        for (let i = emails.length - 1; i >= 0; i--) {
            let eml = emails[i];
            if (eml.email == email && eml.watchList == currentWatchlist) {
                emails.splice(i, 1);
                setEmails(emails);
                return; //only 1 to remove
            }
        }
    }

    const showEmailList = (list) => {
        return (
            <Container>
                <Row>
                    {headData()}
                </Row>
                <Row>
                    <Col>
                        {buildCompanyButtons()}
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <input type='text' placeholder='Enter Business Email' onChange={(e) => updateNewEmail(e)} />
                        <button className='btn btn-primary' id='btnCompanies' onClick={() => saveNewEmail()}>Add Email</button>
                        <br /><br />
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
                <Row>

                    <table>
                        <thead>
                            <tr><th>Email</th>
                                <th>Date Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {emails.filter(item => item.watchlist == currentWatchlist).map((row, idx) => {
                                return (
                                    <tr key={idx}>
                                        <td>{row.email}</td>
                                        <td>
                                            {new Date(row.dateAdded).toLocaleDateString()}<br />
                                            <div style={{ marginTop: '-5px', fontSize: '9px' }}>
                                                {new Date(row.dateAdded).toLocaleTimeString()}</div></td>

                                        <td>
                                            {/* <button className={styles.tblButton + ' btn btn-primary'}>View More</button> */}
                                            <button className={styles.tblButton + ' btn btn-warning'} onClick={() => removeEmail(row.email)}>Remove</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Row>
            </Container>
        )
    }

    const mainPage = async () => {
        // if (watchlists.length === 0) {
        //     fetch_data();
        // }
        // if (watchedCompanies.length === 0 && currentWatchlist) {
        //     setWatchlist(currentWatchlist);
        // }
        let flag = -1;
        let data = watchLists;
        let list = [];
        console.log("DATA: ", watchLists)
        if (emailList == true) {
            flag = 3;
        }
        else if (!watchLists || watchLists.length === 0) {

            //check to see if we have any watchlists
            let lists = watchLists;
            if (!lists || lists.length === 0) {
                //show create watchlist
                flag = 0;
            }
        }
        else { //find companies in this list
            list = watchLists.filter(row =>
                row.watchlist == currentWatchlist
            )
            if (list.length == 0) {
                //show no companies in list
                flag = 1;
            }
            else {
                //return all companies for this watchlist
                flag = 2
            }
        }

        let ret;

        switch (flag) {
            case 0: ret = createWatchList(); break;
            case 1: ret = addCompanies(); break;
            case 2: ret = showCompanies(); break;
            case 3: ret = showEmailList(); break;
            default: console.log("ERROR");
        }
        // console.log(ret)
        console.log(ret)
        return ret;
    }

    const showDetails = () => { }
    const loadBulk = () => { }


    const addCompanyData = (target, type, data) => {
        let currentCompany = newCompany || {}
        switch (type) {
            case 0: //company name
                currentCompany.name = target.value; break;
            case 1:
                let provinces = currentCompany.provinces || {};
                currentCompany.provinces[data] = !currentCompany.provinces.data;
                break;
            case 2:
                currentCompany.refNum = target.value; break;
            default: break;
        }
        console.log(currentCompany)
        setNewCompany(currentCompany);
    }




    // const getProvinces = () => {

    //     let prov = [
    //         { name: "All", abbr: "ALL" },
    //         { name: "Ontario", abbr: "ON" },
    //         { name: "Quebec", abbr: "QC" },
    //         { name: "Nova Scotia", abbr: "NS" },
    //         { name: "New Brunswick", abbr: "NB" },
    //         { name: "Manitoba", abbr: "MB" },
    //         { name: "British Columbia", abbr: "BC" },
    //         { name: "Prince Edward Island", abbr: "PE" },
    //         { name: "Saskatchewan", abbr: "SK" },
    //         { name: "Alberta", abbr: "AB" },
    //         { name: "Newfoundland and Labrador", abbr: "NL" },
    //     ]
    //     return prov;
    // }


    return (
        <>
            <Modal
                show={showAdd}
                onHide={() => setShowAdd(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Company to Watchlist {watchLists.find(el => {
                        return (
                            el._id == currentWatchlist
                        )
                    }
                    )?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Company Name<br />
                    <input type='text' onChange={(e) => addCompanyData(e.target, 0)} />
                    <table style={{ width: '80%' }}>
                        <tbody>
                            {provinces.map((prov, index) => {
                                console.log(prov)
                                return (
                                    <tr key={index}><td>
                                        <label for={'prov_' + index}> {prov.name} - {prov.code}</label></td>
                                        <td><input id={'prov_' + index} type='checkbox' onChange={(e) => addCompanyData(e.target, 1, prov._id)} />
                                        </td></tr>)
                            })}
                        </tbody>
                    </table>
                    Ref. No<br />
                    <input type='text' onChange={(e) => addCompanyData(e.target, 2)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => setShowAdd(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={companyAdded}>
                        Add Company
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={showCreate}
                onHide={() => setShowCreate(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Watchlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Watchlist Name<br />
                    <input type='text' onChange={(e) => setWlName(e.target)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => setShowCreate(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={watchlistAdded}>
                        Add Watchlist
                    </button>
                </Modal.Footer>
            </Modal>
            <Header />
            {mainPage()}
        </>
    );
}

/**
 *
 *
 * @export
 * @param {*} { query: { page = 1, data = null, totalPage = 10 } }
 * @return {*} 
 */
// export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
export async function getServerSideProps(ctx) {
    const { token } = parseCookies(ctx)
    const query = ctx.query;

    if (!token) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    let body = {
        "api_token": token
    }


    let cid = query.cid;

    if (cid) body.company_id = cid;

    const resCompanies = await fetch(`${process.env.API_URL}/watchlist/list-watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    const resCompaniesData = await resCompanies.json()
    /** 
     * limit, start, search item
     */
    if (resCompaniesData?.data) {
        return {
            props: {
                data: resCompaniesData?.data
            }
        }
    }
    return {
        props: {}
    };

}



export default LegalWatchlist;



