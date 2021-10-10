function setLocalStorage(key: string, value: any, exp=60 * 60 * 24) {
    var curtime = new Date().getTime()+exp*1000; // 获取当前时间 ，转换成JSON字符串序列 
    var valueDate = JSON.stringify({
        val: value,
        timer: exp==0?0:curtime
    });
    try {
        localStorage.setItem(key, valueDate);
    } catch(e) {
        // 兼容性写法
        if(isQuotaExceeded(e)) {
            console.log("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }
    }
}

function isQuotaExceeded(e: any) {
    var quotaExceeded = false;
    if(e) {
        if(e.code) {
            switch(e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014: // Firefox 
                    if(e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if(e.number === -2147024882) { // IE8 
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}

function getLocalStorage(key: string) {
    if(localStorage.getItem(key)) {
        var vals: any = localStorage.getItem(key); // 获取本地存储的值 
        var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间 
        var isTimed = new Date().getTime()> dataObj.timer;
        if(isTimed&&dataObj.timer!=0) {
            localStorage.removeItem(key);
            return null;
        } else {
            var newValue = dataObj.val;
        }
        return newValue;
    } else {
        return null;
    }
}
function removeStorage(key: string){
    localStorage.removeItem(key);
}

function getSessionStorage(key: string) {
    if(sessionStorage.getItem(key)) {
        var vals: any = sessionStorage.getItem(key); // 获取本地存储的值 
        var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间 
        var isTimed = new Date().getTime()> dataObj.timer;
        if(isTimed&&dataObj.timer!=0) {
            sessionStorage.removeItem(key);
            return null;
        } else {
            var newValue = dataObj.val;
        }
        return newValue;
    } else {
        return null;
    }
}
function setSessionStorage(key: string, value: any, exp=60 * 60 * 24) {
    var curtime = new Date().getTime()+exp*1000; // 获取当前时间 ，转换成JSON字符串序列 
    var valueDate = JSON.stringify({
        val: value,
        timer: exp==0?0:curtime
    });
    try {
        sessionStorage.setItem(key, valueDate);
    } catch(e) {
        // 兼容性写法
        if(isQuotaExceeded(e)) {
            console.log("Error: 本地存储超过限制");
            sessionStorage.clear();
        } else {
            console.log("Error: 保存到本地存储失败");
        }
    }
}

function removeSessionStorage(key: string){
    sessionStorage.removeItem(key);
}

const Storage={
    setLocalStorage,
    getLocalStorage,
    removeStorage,
    getSessionStorage,
    setSessionStorage,
    removeSessionStorage
}
export {Storage}