export default function state(obj) {
    return Object.assign({
        status: 'success',
        message: '',
        title: 'Home'
    }, obj);
}