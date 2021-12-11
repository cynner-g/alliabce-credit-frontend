import {
    CompaniesGeneral, addCompany, editSubCompany,
    editSubCompany, editCompanies
} from "/companies/"
import { } from './editCompany'
import { useState } from 'react'

const CompaniesGeneralParent = (props) => {
    const [generalActive, setGeneralActive] = useState('general')
    const [generalData, setGeneralData] = useState(props.data)

    switch (generalActive) {
        case "general":
            return <CompaniesGeneral data={generalData}
                setActive={setGeneralActive} setData={setGeneralData} />
            break;
        case "addSub":
            return <addSubCompany data={generalData}
                setActive={setGeneralActive} setData={setGeneralData} />
            break;
        case "editGeneral":
            return <editCompanies data={generalData}
                setActive={setGeneralActive} setData={setGeneralData} />
            break

    }
}

export default CompaniesGeneralParent