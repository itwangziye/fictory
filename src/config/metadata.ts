// 公用数据metadata类
import store from '@/store';

class Metadata {
    constructor() {
        
    }
    init() {
        store.dispatch('metadata/menuGetLis');
    }
}

export default new Metadata();