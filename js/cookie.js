class Cookie {

    static setCookie(key, value) {
        document.cookie = `${key}=${value}`;
    }

    static getCookie(key) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + key + "=");
        if(parts.length === 2) 
            return parts.pop().split(";").shift();
    }

}