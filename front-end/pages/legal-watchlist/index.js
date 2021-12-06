import Header from "../../components/header";
import { useState, Component } from 'react';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import Select from 'react-select';
import DynamicTable from '../../components/DynamicTable';
import styles from "./index.module.css";

const LISTS = 0;
const COMPANIES = 1;
const EMAILS = 2;
const BULK = 3;

const LegalWatchlist = () => {
    const qstr = router.query;
    const [watchedCompanies, setWatchedCompanies] = useState([]);
    const [watchLists, setWatchLists] = useState([]);
    const [tmpWatched, setTmpWatched] = useState([]);
    const [emails, setEmails] = useState([]);
    const [currentPage, setCurrentPage] = useState(COMPANIES);
    const [currentWatchlist, setCurrentWatchlist] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [data, setData] = useState([]);
    const [newCompany, setNewCompany] = useState({
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

    useEffect(() => { //componentDidMount
        //get watchList from API
        let wl = [
            {
                _id: "abcd",
                reference_id: "LW123",
                company_name: "Krabby Patty Pvt. Ltd.",
                date_added: "2021-09-23T11:35:00",
                provinces: ["AB", "MB", "BC", "NB", "NL", "ON", "QC"],
                flagged: 7,
                watchlist: 0
            },
            {
                _id: "def",
                reference_id: "LW122",
                company_name: "Green Tiles Incorporation",
                date_added: "2021-09-23T11:35:00",
                provinces: ["All"],
                flagged: 5,
                watchlist: 0
            },
            {
                _id: "ghi",
                reference_id: "LW121",
                company_name: "Green Tiles Incorporation",
                date_added: "2021-09-07T11:35",
                provinces: ["QC", "NL", "ON"],
                flagged: 6,
                watchlist: 0
            },
            {
                _id: "ghi",
                reference_id: "Test",
                company_name: "New Company",
                date_added: "2021-09-07T11:35",
                provinces: ["QC", "NL", "ON"],
                flagged: 2,
                watchlist: 1
            }
        ]

        wl.forEach(row => {
            row.view = 'View More';
            row.remove = 'Remove'
        })

        setTmpWatched(wl);
    }, [])



    const getColData = () => {
        const colData = [
            {
                colName: "_id",
                visible: false,
                type: "id"
            },
            {
                colName: 'reference_id',
                displayName: "Ref. Id",
                editable: false,
                visible: true,
                subText: false
            },
            {
                colName: 'company_name',
                displayName: "Company Name",
                editable: false,
                visible: true,
                subText: false

            },
            {
                colName: 'date_added',
                displayName: "Date Added",
                type: "date",
                timeSize: '9',
                timeLocation: 'below',
                editable: false,
                visible: true
            },
            {
                colName: 'provinces',
                displayName: "Provinces",
                editable: false,
                visible: true
            },
            {
                colName: 'flagged',
                displayName: "Flagged",
                editable: false,
                visible: true,
                subText: false
            },
            {
                colName: 'view',
                displayName: "Actions",
                onClick: viewMore,
                editable: true,
                visible: true,
                type: "link"
            },
            {
                colName: 'remove',
                displayName: "",
                onClick: remove,
                editable: true,
                visible: true,
                type: "link"
            }

        ]

    }

    const getWatchlistData = () => {
        let data = state.tmpWatched;
        let currentData = data.filter(row => row.watchlist == state.currentWatchlist)
        // (setDisplayedList(currentData);
        return data ? data : []; //make sure at least an array is returned
    }

    const watchlistAdded = () => {
        let wl = state.watchLists;
        wl.push(state.wlName)
        (setWlName(null);
        if (wl.length === 0) (setCurrentWatchlist(0);
    }

    const companyAdded = () => {
        (setAddCompany(false);
        let company = state.newCompany;
        console.log("New Company: ", company)
        company.watchList = state.currentWatchlist;
        let data = state.data;
        let provinces = [];

        for (let province in company.provinces) {
            if (company.provinces.ALL) { provinces = ["ALL"] }
            else if (company.provinces.hasOwnProperty(province)) {
                if (company.provinces[province] == true) {
                    provinces.push(province)
                }
            }
        }
        company.dateAdded = new Date();
        company.provinceArray = provinces.join();
        data.push(company);
        (setData(data);
    }

    const headData = () => {
        let options = [];

        if (state.watchLists) {
            state.watchLists.forEach((row, index) => {
                options.push({ value: index, label: row });
            })
        }
        return (
            <>
                <Col sm={3}>
                    <div style={{ width: '200px' }}>
                        <Select options={options} value={
                            options.filter(option => option.value === 0)
                        } onChange={(e) => (setCurrentWatchlist(e)>
                    </div>
                </Col>
                <Col sm={3}><button disabled>Create New Watchlist</button></Col>
                <Col sm={6} style={{ textAlign: 'right' }} className="mr0">Companies Added: 31/100</Col>
            </>
        )
    }

    const createWatchList = () => {
        return (
            <>
                <Row>
                    <Col sm={{ span: 6, offset: 3 }} className={styles.centered}>
                        <button className='btn btn-primary' onClick={() => (setShowCreate(true)>
                        <br /><br />
                        There are no watchlists to show.  Click <span className={styles.bolder}>"Create New Watchlist" <br /></span>
                        button to add a new watchlist
                    </Col>
                </Row>
            </>
        )
    }

    const showCompany = () => {
        (setAddCompany(true);
    }

    const buildCompanyButtons = () => {
        if (!state.emailList) {
            return (<>
                <button className='btn btn-primary' id='btnCompanies' onClick={() => (setAddCompany(true)>
                <button className='btn btn-primary' id='btnEmails' onClick={() => (setEmailList(true)>
                <br /><br />
            </>)
        }
        else {
            return (
                <button className='btn btn-primary' onClick={() => (setEmailList(false)>
            )
        }
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

    const showCompanies = (list) => {
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
                            {list.map(row => {
                                return (
                                    <tr>
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
        (setTmpEmail(e))
    }

    const saveNewEmail = () => {
        let emails = state.emails;
        let tmpEmail = state.tmpEmail
        if (emails?.findIndex(email =>
            email?.email == tmpEmail &&
            email?.watchlist == state.currentWatchlist) == -1) {

            emails.push({ email: tmpEmail, watchlist: state.currentWatchlist, dateAdded: new Date() });
            (setEmails(emails);
        }
    }
    const removeEmail = (email) => {
        let emails = state.emails
        for (let i = emails.length - 1; i >= 0; i--) {
            let eml = emails[i];
            if (eml.email == email && eml.watchList == state.currentWatchlist) {
                emails.splice(i, 1);
                (setEmails(emails);
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
                            {state.emails.filter(item => item.watchlist == state.currentWatchlist).map(row => {
                                return (
                                    <tr>
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

    const mainPage = () => {
        let flag = -1;
        let data = state.watchLists;
        let list = [];
        console.log("DATA: ", data)
        if (state.emailList == true) {

            flag = 3;
        }
        else if (!data || data.length === 0) {
            //check to see if we have any watchlists
            let lists = state.watchLists;
            if (!lists || lists.length === 0) {
                //show create watchlist
                flag = 0;
            }
        }
        else {
            list = state.data.filter(row =>
                row.watchlist == state.currentWatchList
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
            case 2: ret = showCompanies(list); break;
            case 3: ret = showEmailList(); break;
            default: console.log("ERROR");
        }
        // console.log(ret)
        console.log(flag)
        return ret;
    }

    const showDetails = () => { }
    const loadBulk = () => { }

    const updateWLName = (target => {
        (setWlName(target))
    })

    const addCompanyData = (target, type, data) => {
        let currentCompany = state.newCompany || {}
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
        (setNewCompany(currentCompany);
    }




    const getProvinces = () => {
        let prov = [
            { name: "All", abbr: "ALL" },
            { name: "Ontario", abbr: "ON" },
            { name: "Quebec", abbr: "QC" },
            { name: "Nova Scotia", abbr: "NS" },
            { name: "New Brunswick", abbr: "NB" },
            { name: "Manitoba", abbr: "MB" },
            { name: "British Columbia", abbr: "BC" },
            { name: "Prince Edward Island", abbr: "PE" },
            { name: "Saskatchewan", abbr: "SK" },
            { name: "Alberta", abbr: "AB" },
            { name: "Newfoundland and Labrador", abbr: "NL" },
        ]
        return prov;
    }


    return (
        <>
            <Modal
                show={addCompany}
                onHide={() => (setAddCompany(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Company to watchlist {state.watchLists[state.currentWatchList]}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Watchlist Name<br />
                    <input type='text' onChange={(e) => addCompanyData(e.target, 0)} />
                    <table style={{ width: '80%' }}>
                        <tbody>
                            {getProvinces().map((prov, index) => {
                                return (
                                    <tr><td><label for={'prov_' + index}> {prov.name} - {prov.abbr}</label></td><td><input id={'prov_' + index} type='checkbox' onChange={(e) => addCompanyData(e.target, 1, prov.abbr)} />
                                    </td></tr>)
                            })}
                        </tbody>
                    </table>
                    Ref. No<br />
                    <input type='text' onChange={(e) => addCompanyData(e.target, 2)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => (setAddCompany(false)>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={companyAdded}>
                        Add Company
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={state.showCreate}
                onHide={() => (setShowCreate(false)}
                backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Create New Watchlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Watchlist Name<br />
                    <input type='text' onChange={(e) => updateWLName(e.target)} />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-primary" onClick={() => (setShowCreate(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={watchlistAdded}>
                        Add Watchlist
                    </button>
                </Modal.Footer>
            </Modal>
            <Header />
            {mainPage()}
        </>)
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
    // const start = +page === 1 ? 0 : (+page + 1)

    // const { locale, locales, defaultLocale, asPath } = useRouter();
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
    const res = await fetch(`${process.env.API_URL}/user/list-user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "language": 'en',
            "api_token": token,
            "company_id": query.userid
        })

    })
    const users = await res.json()
    // console.log(users)
    if (!users) {
        return {
            notFound: true,
        }
    }

    let body = {
        "language": 'en',
        "api_token": token,
    }

    let qstr = router.query;
    let cid = qstr.cid;

    if (cid) body.company_id = cid;

    const resCompanies = await fetch(`${process.env.API_URL}/company/list-watchlist`, {
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
    return {
        props: {
            data: resCompaniesData?.data
        }
    }
}



export default LegalWatchlist;



