// 公用数据metadata类
import store from '@/store';

class Metadata {
    constructor() {
        
    }
    init() {
        store.dispatch('metadata/menuGetLis');
        store.dispatch('metadata/langGetList');
        // store.dispatch('metadata/getExchangeRate');
    }
}

export default new Metadata();