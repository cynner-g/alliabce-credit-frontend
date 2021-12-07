import Header from "../../components/header";
import { useState, useEffect } from 'react';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import TabButton from "../../components/tabbutton"
import Select from 'react-select';
import styles from "./index.module.css";
import { parseCookies } from "nookies"
import Cookies from "js-cookie"
import { useRouter } from 'next/router'


const LegalWatchlist = (props) => {

    let [watchlists, setWatchlists] = useState(props.data.watchlist);
    let [companyList, setCompanyList] = useState([]);
    let [currentWatchlistID, setCurrentWatchlistID] = useState(props.data.watchlist?.length > 0 ? props.data.watchlist[0]._id : null);

    const [totalCompaniesAllowed, setTotalCompaniesAllowed] = useState(props.data.total_companies_allowed)
    const [totalCompaniesCreated, setTotalCompaniesCreated] = useState(props.data.total_companies_created)
    const [totalWatchlistsAllowed, setTotalWatchlistsAllowed] = useState(props.data.total_watchlist_allowed)
    const [totalWatchlistsCreated, setTotalWatchlistsCreated] = useState(props.data.total_watchlist_created)

    const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
    const [showAddCompany, setShowAddCompany] = useState(false);

    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [newCompanyName, setNewCompanyName] = useState('');
    const [newCompanyProvinces, setNewCompanyProvinces] = useState([]);
    const [newCompanyRefNum, setNewCompanyRefNum] = useState('');

    const [provinceList, setProvinces] = useState(props.provinces);
    const [currentPage, setCurrentpage] = useState(0);
    const [sort, setSort] = useState('');
    const [is_desc, setOrderDescending] = useState(false);
    const [companyID, setCompanyID] = useState(props.companyID);

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

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/list-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        const resCompaniesData = await resCompanies.json()
        if (resCompaniesData?.data) {
            setWatchlists(resCompaniesData.data)
        }
        if (!currentWatchlistID) setCurrentWatchlistID(resCompaniesData.data[0]._id);
        await getWatchlistCompanies(resCompaniesData.data[0]._id);
    }

    //get all companies for the current watchlist
    const getWatchlistCompanies = async () => {
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
            watchlist_id: currentWatchlistID,
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
        setCompanyList(list.data);
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

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/add-company-to-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        getWatchlistCompanies();
        setNewCompanyProvinces([]);
        setNewCompanyName('')
        setNewCompanyRefNum('')
        setShowAddCompany(false);

    }

    const removeCompany = async () => {
        //TODO:  Set api

    }


    const addNewWatchlist = async () => {
        const token = Cookies.get('token');

        let body = {
            api_token: token,
            name: newWatchlistName,
            company_id: companyID
        }

        console.log(body);

        const resCompanies = await fetch(`${process.env.API_URL}/watchlist/create-watchlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        fetch_watchlists();
        setNewWatchlistName('');
        setSetShowCreateWatchlist(false)
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
                <Container>
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
                                } onChange={(e) => setWatchlist(e.value)} />
                            </div>
                        </Col>
                        <Col sm={3}><button onClick={() => setShowCreateWatchlist(true)}>Create New Watchlist</button></Col>
                        <Col sm={6} style={{ textAlign: 'right' }} className="mr0">Companies Added: {totalCompaniesCreated}/{totalCompaniesAllowed}</Col>
                    </Row>
                    <Row>
                        <Col>
                            <button className='btn btn-primary' id='btnCompanies' onClick={() => setShowAddCompany(true)}>Add company</button>&nbsp;
                            <button className='btn btn-primary' id='btnEmails' onClick={() => setEmailList(true)} >Add email</button>
                            <br /><br />
                        </Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>

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
    return (
        <>
            {showModals()}
            <Header />
            {/*
                Display page.  Show watchlists OR addwatchlist message
                Show Companies OR add company message
            */}
            {watchlists?.length > 0 ?
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
        let ret = {};



        if (resCompaniesData?.data) {
            ret.props = {
                data: resCompaniesData?.data
            }
        }

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

        const provinceData = await provincesList.json();
        ret.props.provinces = provinceData.data;
        ret.props.companyID = cid;
        return ret;
    }
    catch (ex) {
        return {}
    }
}



export default LegalWatchlist;



