const USERKEY = 'userkey';
//保存用户信息到浏览器存储，仅当removeItem或手动删除时用户信息丢失
export default {
    saveStaff(staff){
        localStorage.setItem(USERKEY, JSON.stringify(staff));
    },
    getStaff( ){
        return JSON.parse(localStorage.getItem(USERKEY)) || {};
    },
    removeStaff(){
        localStorage.removeItem(USERKEY);
    }
}
