const validatePhone = (value) => {
    let checkedValue = value.match(/\d/g)
    if (checkedValue) {
        if (checkedValue.length===10) {
            return true
        }
    } else {
        return false
    }
}

const validateEmail = (value) => {
    const checkedValue = value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (checkedValue) {
        return true
    } else {
        return false
    }
}
module.exports = {validatePhone, validateEmail};
