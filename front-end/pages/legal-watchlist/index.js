import Header from "../../components/header";
import { useState, useEffect } from 'react';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import TabButton from "../../components/tabbutton"
import Select from 'react-select';
import styles from "./index.module.css";
import { parseCookies } from "nookies"
import Cookies from "js-cookie"
import { useRouter } from 'next/router'
import {
    remove_email,
    get_watchlist_companies,
    get_watchlist_emails,
    get_watchList,
    add_company_to_watchlist,
    add_email_to_watchlist,
    create_watchlist
} from '../api/watchlist'
import { get_provinces } from '../api/provinces'


const LegalWatchlist = ({ data, provinces, companyID }) => {

    let [watchlists, setWatchlists] = useState(data.watchlist);
    let [companyList, setCompanyList] = useState([]);
    let [currentWatchlistID, setCurrentWatchlistID] = useState(data.watchlist?.length > 0 ? data.watchlist[0]._id : null);
    let [emailsList, setEmailsList] = useState([]);

    const [totalCompaniesAllowed, setTotalCompaniesAllowed] = useState(data.total_companies_allowed)
    const [totalCompaniesCreated, setTotalCompaniesCreated] = useState(data.total_companies_created)
    const [totalWatchlistsAllowed, setTotalWatchlistsAllowed] = useState(data.total_watchlist_allowed)
    const [totalWatchlistsCreated, setTotalWatchlistsCreated] = useState(data.total_watchlist_created)

    const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const [showEmailList, setShowEmailList] = useState(false);

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyProvinces, setNewCompanyProvinces] = useState([]);
    const [newCompanyRefNum, setNewCompanyRefNum] = useState('');

    const [newEmail, setNewEmail] = useState('');

    const [provinceList, setProvinces] = useState(provinces);
    const [currentWatchlistPage, setCurrentWatchlistpage] = useState(0);
    const [sortWatchlist, setSortWatchlist] = useState('');
    const [is_watchlistSort_desc, setOrderDescending] = useState(false);
    const [companyID, setCompanyID] = useState(companyID);

    const router = useRouter();

    useEffect(() => {
        getWatchlistCompanies();
    }, [])

    //refresh watchlist list
    const fetch_watchlists = async () => {
        const token = Cookies.get('token');
        const query = router.query;

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

        get_watchList(body)
            .then(res => {
                if (!currentWatchlistID) setCurrentWatchlistID(res[0]._id)
                getWatchlistCompanies(resCompaniesData.data[0]._id);
        })

    }


    const changeCurrentWatchlist = (id) => {
        setCurrentWatchlistID(id);
        getWatchlistCompanies(id)
    }

    //get all companies for the current watchlist
    const getWatchlistCompanies = (currentId) => {
        //get companies for this watchlist
        const token = Cookies.get('token');
        if (!currentId) currentId = currentWatchlistID;
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
            watchlist_id: currentId,
            skip: currentWatchlistPage * pageSize,
            limit: currentWatchlistPage * pageSize + pageSize,
            is_desc: is_watchlistSort_desc,
            sort_by: sortWatchlist
        }

        Promise.all([
            get_watchlist_companies(body),
            get_watchlist_emails(body)
        ])
            .then(results => {
                setCompanyList(results[0])
                setEmailsList(results[1])
            });
    }

    const addNewCompany = async () => {
        let provinces = newCompanyProvinces;
        let name = newCompanyName;
        let refNum = newCompanyRefNum;
        let token = Cookies.get('token');

        let body = {
            "api_token": token,
            watchlist_id: currentWatchlistID,
            company_name: name,
            provience_ids: provinces,
            reference_number: refNum,
            company_id: companyID
        }

        console.log(body);
        add_company_to_watchlist(body)
            .then(res => {


        getWatchlistCompanies();
        setNewCompanyProvinces([]);
        setNewCompanyName('')
        setNewCompanyRefNum('')
        setShowAddCompany(false);
            })
    }

    const removeCompany = async (id) => {
        let token = Cookies.get('token')

        let body = {
            "api_token": token,
            watchlist_id: currentWatchlistID,
            company_id: companyID
        }

        console.log(body);
        remove_company_from_watchlist(body)
            .then(res => getWatchlistCompanies())
    }

    const addNewEmail = async () => {
        let token = Cookies.get('token');
        let body = {
            "api_token": token,
            watchlist_id: currentWatchlistID,
            email_id: newEmail
        }

        add_email_to_watchlist(body)
            .then(res => getWatchlistCompanies())// =>loads company data and emails data
    }

    const removeEmail = async (id) => {

        let token = Cookies.get('token')
        let body = {
            "api_token": token,
            watchlist_id: currentWatchlistID,
            email_record_id: id
        }

        console.log(body);

        remove_email(body)
            .then(res => {

        getWatchlistCompanies();
            })
    }

    const addNewWatchlist = async () => {
        const token = Cookies.get('token');

        let body = {
            api_token: token,
            name: newWatchlistName,
            company_id: companyID
        }

        console.log(body);

        create_watchlist(body).then(res => {
        fetch_watchlists();
        setNewWatchlistName('');
        setShowCreateWatchlist(false)
        })
    }


    const updateNewCompanyProvinceList = (e, province) => {
        let provinces = [...newCompanyProvinces];
        let pos = provinces.indexOf(province);
        if (pos > -1) {
            provinces.splice(pos, 1)
        }
        else {
            provinces.push(province);
        }

        setNewCompanyProvinces(provinces)
    }

    const showHeadButtons = () => {
        //display watchlist dropdown, add new watchlist button, add company button, email list button
        //if no companies for this watchlist show add companies message, else show companies.
        //as soon as watchlist changes update company list
        let options = [];

        if (watchlists) {
            watchlists.forEach((row, index) => {
                options.push({ value: row._id, label: row.name });
            })
        }
        let value = options[0].value;
        if (currentWatchlistID) value = currentWatchlistID
        return (
            <>
                <Row>
                    <Col sm={12}>
                        {parseCookies().role == "admin" ? <TabButton id={companyID || 0} url={''} /> : ''}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3}>
                        <div style={{ width: '200px' }}>
                            <Select options={options} value={
                                options.filter(option => option.value === value)
                            } onChange={(e) => changeCurrentWatchlist(e.value)} />
                        </div>
                    </Col>
                    <Col sm={3}><button onClick={() => setShowCreateWatchlist(true)}>Create New Watchlist</button></Col>
                    <Col sm={6} style={{ textAlign: 'right' }} className="mr0">Companies Added: {totalCompaniesCreated}/{totalCompaniesAllowed}</Col>
                </Row>
                <Row>
                    <Col>
                        <button className='btn btn-primary' id='btnCompanies' onClick={() => { setShowAddCompany(true); setShowEmailList(false) }}>Add company</button>&nbsp;
                        <button className='btn btn-primary' id='btnEmails' onClick={() => setShowEmailList(true)} >Add email</button>
                        <br /><br />
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </>
        )
    }

    const showModals = () => {
        return (
            <>
                <Modal
                    show={showAddCompany}
                    onHide={() => setShowAddCompany(false)}
                    backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Company to Watchlist {watchlists?.find(el => {
                            return (
                                el._id == currentWatchlistID
                            )
                        }
                        )?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Company Name<br />
                        <input type='text' onChange={(e) => setNewCompanyName(e.target.value)} value={newCompanyName} />
                        <table style={{ width: '80%' }}>
                            <tbody>
                                {provinceList.map((prov, index) => {
                                    return (
                                        <tr key={index}><td>
                                            <label for={'prov_' + index}> {prov.name} - {prov.code}</label></td>
                                            <td><input id={'prov_' + index} type='checkbox'
                                                checked={newCompanyProvinces.includes(prov._id)}
                                                onChange={(e) => updateNewCompanyProvinceList(e, prov._id)} />
                                            </td></tr>)
                                })}
                            </tbody>
                        </table>
                        Ref. No<br />
                        <input type='text' onChange={(e) => setNewCompanyRefNum(e.target.value)} value={newCompanyRefNum} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-outline-primary" onClick={() => setShowAddCompany(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={addNewCompany}>
                            Add Company
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    show={showCreateWatchlist}
                    onHide={() => setShowCreateWatchlist(false)}
                    backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Watchlist</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Watchlist Name<br />
                        <input type='text' onChange={(e) => setNewWatchlistName(e.target.value)} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-outline-primary" onClick={() => setShowCreateWatchlist(false)}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" onClick={addNewWatchlist}>
                            Add Watchlist
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )

    }

    const showCompaniesList = () => {
        return (<>
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
                        {companyList.map((row, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{row.name}</td>
                                    <td>{row.ref_number}</td>
                                    <td>
                                        {new Date(row.create_date).toLocaleDateString()}<br />
                                        <div style={{ marginTop: '-5px', fontSize: '9px' }}>
                                            {new Date(row.create_date).toLocaleTimeString()}</div></td>
                                    <td>{row.proviences.join(', ')}</td>
                                    <td></td>
                                    <td>
                                        {/* <button className={styles.tblButton + ' btn btn-primary'}>View More</button> */}
                                        <button className={styles.tblButton + ' btn btn-warning'} onClick={() => removeCompany(row._id)}>Remove</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Row>
        </>)
    }

    const showWatchLists = () => {
        return (
            <>
                <Container>
                    {showHeadButtons()}

                    {
                        companyList?.length > 0 ?
                            showCompaniesList()
                            :
                            showAddCompanies()
                    }
                </Container>
            </>
        )
    }

    const showAddCompanies = () => {
        let ret = (
            <>

                <Row>
                    <Col sm={{ span: 6, offset: 3 }} className={styles.centered}>
                        There are no companies in this watchlist.  Click <span className={styles.bolder}>"Add Company" <br /></span>
                        button to add companies to this watchlist
                    </Col>
                </Row>

            </>
        );
        return ret;
    }

    const showAddWatchlist = () => {
        return (
            <Row>
                <Col sm={{ span: 6, offset: 3 }} className={styles.centered}>
                    <button className='btn btn-primary' onClick={() => setShowCreate(true)}>Create New Watchlist</button>
                    <br /><br />
                    There are no watchlists to show.  Click <span className={styles.bolder}>"Create New Watchlist" <br /></span>
                    button to add a new watchlist
                </Col>
            </Row>
        )
    }


    const showEmailListPage = () => {
        return (
            <>
                <Container>
                {showHeadButtons()}
                <Row>
                        <Col>
                            <input type='text' placeholder='Enter Business Email' onChange={(e) => setNewEmail(e.target.value)} />
                            <button className='btn btn-primary' id='btnCompanies' onClick={() => addNewEmail()}>Add Email</button>
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
                                {emailsList?.map(row => {
                                return (
                                    <tr>
                                        <td>{row.email}</td>
                                        <td>
                                            {new Date(row.create_date).toLocaleDateString()}<br />
                                            <div style={{ marginTop: '-5px', fontSize: '9px' }}>
                                                {new Date(row.create_date).toLocaleTimeString()}</div></td>

                                        <td>
                                            {/* <button className={styles.tblButton + ' btn btn-primary'}>View More</button> */}
                                            <button className={styles.tblButton + ' btn btn-warning'} onClick={() => removeEmail(row._id)}>Remove</button>
                                        </td>
                                    </tr>
                                )
                                })}
                        </tbody>
                    </table>
                </Row>
                </Container>
            </>
        )
    }

    return (
        <>
            {showModals()}
            <Header />
            {/*
                Display page.  Show watchlists OR addwatchlist message
                Show Companies OR add company message
            */}

            {showEmailList ? showEmailListPage()
                :
                watchlists?.length > 0 ?
                showWatchLists()
                :
                showAddWatchlist()
            }
        </>
    )

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
    let ret = { props: {} }
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
    try {


        const resCompaniesData =
        /**
     * limit, start, search item
     */



            ret.props = {
                data: await get_watchList(body),
                provinces: await get_provinces({ api_token: token, language: 'en' }),
                companyID = cid
            }

        return ret;
    }
    catch (ex) {
        return {}
    }
}



export default LegalWatchlist;



