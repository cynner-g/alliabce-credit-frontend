const Address = function ({ address }) {
    return (
        <>
            <div>
                <p>{address?.address_line}</p>
                <p>{address?.city_name}</p>
                <p>{address?.state_name}</p>
                <p>{address?.zip_code}</p>
            </div>
        </>
    )
}
export default Address;