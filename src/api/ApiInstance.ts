
import Axios from './axios'
import { Toast } from 'vant';
import store from '@/store'
import {Storage} from '@/utils/storage';
import qs from 'qs';

class MApi{	

	private serviceUrl: string;
	private options: any;
	private responseDecorator: Function;
	private isSuccess: Function;
	private serviceUpdateTimeKey: string;
	private lastUpdateTimePrefix: string;
	private lastUpdateTimeDataKey: string;

	constructor({serviceUrl, method = 'post', config = {}, isSuccess, responseDecorator, serviceUpdateTimeKey, lastUpdateTimePrefix = 'api_'}: any) {
		this.serviceUrl = serviceUrl;
		this.options = Object.assign({}, config, {url: serviceUrl, method});
		this.responseDecorator = responseDecorator || function (resData: any) {
			const { data } = resData;
			return data;
		};
		this.isSuccess = isSuccess || function (resData: any) {
			const { code } = resData;
			return code === 200;
		};
		this.serviceUpdateTimeKey = serviceUpdateTimeKey;
		this.lastUpdateTimePrefix = lastUpdateTimePrefix;
		this.lastUpdateTimeDataKey = `${this.lastUpdateTimePrefix}${this.serviceUpdateTimeKey}`;
	}

	exec(data = {}, options: any = {}) :any{
		const { method} = this.options;
		let targetData: any = {...data};
		if (method === 'get') {
			options.params = targetData;
		} else {
			options.data = qs.stringify(targetData);
		}
		return this.request(options);
	}

	request(options: any) {
		const requestOptions = Object.assign({}, this.options, options);
		return new Promise((resolve, reject) => {
			Axios(requestOptions).then(res => {
				const resData = res.data;
				const serviceUpdateTimeValue = this.serviceUpdateTimeKey ? resData[this.serviceUpdateTimeKey] : null;
				if (this.isSuccess(resData)) {
					const data = this.responseDecorator(resData);
					if (serviceUpdateTimeValue) {
						data[this.lastUpdateTimeDataKey] = serviceUpdateTimeValue;
					}
					resolve(data)
				} else {
					const {code} = resData;
					if (code === 201 || code === 202) {
						store.commit('home/LOGINOUT');
					}
					Toast.fail(resData.msg || '网络开小差，请稍后再试！');
					reject(res)
				}
			}).catch(error => {
				reject(error);
			})
		})
	}
}

export default MApi;