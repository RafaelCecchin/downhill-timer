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

    static isValidCpf(informedCpf) {	
        let cpf = informedCpf.replace(/[^\d]+/g,'');	
        if(cpf == '') return false;	
        
        if (cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
                return false;		
                
        let add = 0;	
        
        for (let i=0; i < 9; i ++)		
            add += parseInt(cpf.charAt(i)) * (10 - i);	
            let rev = 11 - (add % 11);	
            if (rev == 10 || rev == 11)		
                rev = 0;	
            if (rev != parseInt(cpf.charAt(9)))		
                return false;		
                
        add = 0;	
        for (let i = 0; i < 10; i ++)		
            add += parseInt(cpf.charAt(i)) * (11 - i);	
        rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)	
            rev = 0;	
        if (rev != parseInt(cpf.charAt(10)))
            return false;		
        return true;   
    }

}

module.exports = Helper;