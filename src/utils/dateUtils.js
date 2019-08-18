function size(num) {
    return num >= 10 ? num : '0' + num;
}
const formatDate = time => {
    if (!time) return '';
    let date = new Date(time);
    return (
        date.getFullYear() +
        '-' +
        size(date.getMonth() + 1) +
        '-' +
        size(date.getDate()) +
        ' ' +
        size(date.getHours()) +
        ':' +
        size(date.getMinutes()) +
        ':' +
        size(date.getSeconds())
    );
};
export const dateFomatter = (time) => {
    if (!time) return '';
    let date = new Date(time);
    return date.getFullYear() +''+ size(date.getMonth() + 1) + ''+ size(date.getDate());
    
}

export default formatDate;
