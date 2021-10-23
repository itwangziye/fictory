
import { mapGetters } from 'vuex';
import { Component, Vue} from "vue-property-decorator";

@Component({
    computed: {
        ...mapGetters({
            'homePageOptions': 'metadata/homePageOptions',
            'token': 'home/token'
        })
    }
})
export default class PageMixins extends  Vue{ 
    serviceLoading: boolean = false;
    pageLoading: boolean = false;
    pageError: boolean = false;
    pageEmpty: boolean = false;
    pageNotfound: boolean = false;
    
    get isLogin() :boolean{
        const token = (this as any).token;
        if (token) return true;
        return false;
    }

    onClickLeft() :void{
		this.$router.back();
	}

    goPage(path: string, query?: any) :void {
		this.$router.push({path, query});
	}
    setPageStatus(type?: string) :void {
        switch (type) {
            case 'loading':
                this.pageLoading = true;
                this.pageError = false;
                this.pageEmpty = false;
                this.pageNotfound = false;
                break;
            case 'error':
                this.pageLoading = false;
                this.pageError = true;
                this.pageEmpty = false;
                this.pageNotfound = false;
                break;
            case '404':
                this.pageLoading = false;
                this.pageError = false;
                this.pageEmpty = false;
                this.pageNotfound = true;
                break;
            case 'empty':
                this.pageLoading = false;
                this.pageError = false;
                this.pageEmpty = true;
                this.pageNotfound = false;
                break;
            default:
                this.pageLoading = false;
                this.pageError = false;
                this.pageEmpty = false;
                this.pageNotfound = false;
                break;
        }
    }
}


