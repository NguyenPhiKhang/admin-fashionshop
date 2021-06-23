export const SET_STATE_NAV = "SET_STATE_NAV";

export const getProductList = (data) =>
// {
//     axios.get("/api/customer/get-list").then(res => {
//         dispatch(
({
    type: SET_STATE_NAV,
    payload: data
})
    // })
// }