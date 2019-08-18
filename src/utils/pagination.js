const showTotal = (total) => {
    return `共${total}条`;
}
const showCurrentPage = (total, defaultPageSize) => {
    return Math.ceil(total/defaultPageSize);
}
export default {
    showTotal,
    showCurrentPage
}