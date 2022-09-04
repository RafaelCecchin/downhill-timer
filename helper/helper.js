class Helper {

    static getCurrentDateTime() {
        var date = new Date();

        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = String(date.getFullYear()).padStart(4, '0');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
    }

}

module.exports = Helper;