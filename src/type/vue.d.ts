

import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        $toast: any,
        $cancel: Function,
        $dayjs: Function
    }
}