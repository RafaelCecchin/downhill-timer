class Helper {
    static get(obj, data) {
        if (!obj || !data) {
            return '';
        }

        return obj.get(data);
    }

    static getDataValue(obj, data) {
        if (!obj || !data) {
            return '';
        }

        return obj.getDataValue(data);
    }

    static getDate(fullDate) {
        const date = new Date(fullDate);

        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = String(date.getFullYear()).padStart(4, '0');

        return yyyy + '-' + mm + '-' + dd;
    }
    
    static getTime(fullDate) {
        if (!fullDate) {
            return '00:00:00';
        }

        const date = new Date(fullDate);

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
    }

    static getDateTime(fullDate) {
        const date = new Date(fullDate);

        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = String(date.getFullYear()).padStart(4, '0');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');

        return yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m;
    }

    static getFormatedDateTime(fullDate) {
        const date = new Date(fullDate);

        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = String(date.getFullYear()).padStart(4, '0');

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');

        return dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + m;
    }

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

    static getDateDiff(date1, date2) {
        const dateDiff = date1 - date2;
        const date = new Date( dateDiff );
        
        return date;
    }

    static getUTCTime(date) {
        if (!date) {
            return '00:00:00';
        }

        let h = String(date.getUTCHours()).padStart(2, '0');
        let m = String(date.getUTCMinutes()).padStart(2, '0');
        let s = String(date.getUTCSeconds()).padStart(2, '0');

        return h + ':' + m + ':' + s;
    }

    static getTime(date) {
        if (!date) {
            return '00:00:00';
        }

        let h = String(date.getHours()).padStart(2, '0');
        let m = String(date.getMinutes()).padStart(2, '0');
        let s = String(date.getSeconds()).padStart(2, '0');
        
        return h + ':' + m + ':' + s;
    }

}

module.exports = Helper;