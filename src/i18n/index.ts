import Vue from 'vue'
import VueI18n from 'vue-i18n';
import {Storage} from '@/utils/storage'




Vue.use(VueI18n)

const fc_lang = Storage.getLocalStorage("fc_lang");

export default new VueI18n({
    locale: fc_lang || 'zh_cn', // 将要切换的语言，可以通过url拼的参数获取，用户行为select选择获取，本地manifest配置获取等，根据场景动态获取
    messages: {
      'ar': require('@/i18n/languages/ar.json'),  // 本地资源文件，我这里配2个语言，中文&英文，src下根据个人情况放置
      'en_us': require('@/i18n/languages/en_us.json'),
      'pt': require('@/i18n/languages/pt.json'),
      'zh_cn': require('@/i18n/languages/zh_cn.json'),
      'zh_hk': require('@/i18n/languages/zh_hk.json')
    }
});


