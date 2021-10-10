// 公用数据metadata类
import store from '@/store';

class Metadata {
    constructor() {
        
    }
    initBaiDuStatistics() {
        console.log('百度统计')
        window._hmt = window._hmt || [];
        let hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?4d3d87cbab617a885a40d25b8a119a5c";
        let s: any = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
    }
    redirectPage() {
        const goPAGE = () => {
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                return "mobile";
            }
            else {
                return "pc"
            }
        }
        if (goPAGE() === 'pc') {
            const {host, search, protocol} = location;
            const urlMap:any = {
                'm.tdrsteam.com': 'aitk.tdrsteam.com',
                'm.ai-tk.soukakeji.com': 'ai-tk.soukakeji.com',
                'm.ai-tk.com': 'www.ai-tk.com',
                'm.ai-tangka.com': 'www.ai-tangka.com',
                'm.aitangka.cn': 'www.aitangka.cn',
                'localhost:8088': 'localhost:8099'
            }
            const url = `${protocol}//${urlMap[host] || 'www.ai-tk.com'}/#/${search}`
            window.location.href = url;
        }
    }
    init() {
        this.redirectPage();
        console.log('初始化配置数据！')
        this.initBaiDuStatistics();
        store.dispatch('metadata/getHomePgeConfig');
        store.dispatch('metadata/getCurrencyConfig');
        store.dispatch('metadata/getFingerConfig');
    }
}

export default new Metadata();