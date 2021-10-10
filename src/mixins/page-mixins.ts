
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
}


