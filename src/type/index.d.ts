import Vue from 'vue'
import './vue'
declare global {
    interface Window {
      $vapp:Vue
      throttle: any;
      debounce:Function;
      defaultConfig: any;
      gtag: any;
      axiosCancel: any;
      _hmt: any,
      fbq: any,
      gdt: any,
      ttq: any,
      external: any,
      sidebar: any
    }
}