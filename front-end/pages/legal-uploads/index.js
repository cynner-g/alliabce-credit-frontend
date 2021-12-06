import React, { userState, useEffect, useState } from 'react'
import Header from "../../components/header"
import { useRouter } from "next/router"
// import Pagination from "../../components/datatable/pagination"
import { Modal } from 'react-bootstrap';
import DynamicTable from '../../components/DynamicTable';

const UPLOADING = 1;
const UPLOADED = 2;
const ERROR = 3;

const LegalUploads = ({ page, totalPage }) => {
    const router = useRouter()
    const limit = 3
    const lastPage = Math.ceil(totalPage / limit)

    let [pageData, setPageData] = useState();

    const deleteClick = (event, row) => {

    }

    const getBadgeCss = (type) => {
        switch (type) {
            case 'Uploaded': return 'success'; break;
            case 'Uploading': return 'info'; break;
            case 'Error': return 'error'; break;
        }
    }

    const columns = [{
        colName: "refId",
        displayName: "File Ref. Id",
        editable: false,
        visible: true,
        addable: false,
    },
    {
        colName: "fileType",
        displayName: "File Type",
        editable: false,
        required: false,
        visible: true,
        addable: false,
    },
    {
        colName: "language",
        displayName: "Language",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "status",
        displayName: "Status",
        type: "badge",
        styleFn: getBadgeCss,
        styleParam: "status",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "uploadTime",
        displayName: "Upload Time",
        type: 'date',
        timeSize: 9,
        timeLocation: 'below',
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "comparedToWatchlist",
        displayName: "Compared to Watchlist",
        editable: false,
        required: false,
        type: 'date',
        timeSize: 9,
        timeLocation: 'below',
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "sisCount",
        displayName: "SIS Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "clrCount",
        displayName: "CLR Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "bankruptcyCount",
        displayName: "Bankruptcy Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    }, {
        colName: "hypotechCount",
        displayName: "Hypotech Count",
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },
    {
        colName: "actions",
        displayName: "Actions",
        onClick: deleteClick,
        buttonText: 'Remove',
        type: 'button',
        editable: false,
        required: false,
        visible: true,
        addable: false,
        defaultVal: null
    },

    ]




    useEffect(() => {
        let data = [
            {
                refId: 'L123',
                fileType: 'Commercial Law Record',
                language: 'French',
                status: 'Uploaded',
                uploadTime: '09/23/2021 11:35 AM',
                comparedToWatchlist: '09/23/2021 11:35 AM',
                sisCount: "0",
                clrCount: 56,
                bankruptcyCount: "0",
                hypotechCount: "0"
            },
            {
                refId: 'L122',
                fileType: 'Bankruptcy',
                language: 'English',
                status: 'Uploaded',
                uploadTime: '07/09/2021 11:35 AM',
                comparedToWatchlist: '08/09/2021 11:35 AM',
                sisCount: "0",
                clrCount: "0",
                bankruptcyCount: 21,
                hypotechCount: "0"
            },
            {
                refId: 'L121',
                fileType: 'Hyptotech',
                language: 'English',
                status: 'Uploaded',
                uploadTime: '07/09/2021 11:35 AM',
                comparedToWatchlist: '07/09/2021 11:35 AM',
                sisCount: "0",
                clrCount: "0",
                bankruptcyCount: "0",
                hypotechCount: 10
            },
            {
                refId: 'L121',
                fileType: 'Special Information Sheet',
                language: 'Both',
                status: 'Uploaded',
                uploadTime: '07/09/2021 11:35 AM',
                comparedToWatchlist: '08/09/2021 11:35 AM',
                sisCount: 10,
                clrCount: "0",
                bankruptcyCount: "0",
                hypotechCount: "0"
            },
        ]
        setPageData(data);
    }, [])

    return (
        <>
            <Header />
            <button className="legal_upload">Legal Uploads</button>

            {/* <table id="example" className="table table-striped">
                <thead>
                    <tr>
                        <th>File Ref. Id</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>61</td>
                        <td>2011/04/25</td>
                        <td>$320,800</td>
                    </tr>
                </tbody>
            </table>
            <Pagination page={page} totalPage={totalPage} lastPage={lastPage} /> */}
            <div className="listing">
                <DynamicTable data={pageData} columns={columns} />
            </div>
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
export async function getServerSideProps({ query: { page = 1, data = null, totalPage = 10 } }) {
    const start = +page === 1 ? 0 : (+page + 1)
    /** 
     * limit, start, search item
     */
    return {
        props: {
            data: data,
            page: page,
            totalPage
        }
    }

}

export default LegalUploads