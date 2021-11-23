
import { Component, Vue} from "vue-property-decorator";

@Component
export default class LoginMixins extends  Vue{ 
    setLoginInfo(data: any) {
        const {token} = data;
        this.$store.commit('home/LOGIN', {token}); 
        const redirect: any = this.$route.query.redirect;
        if (redirect) {
            this.$router.replace({path: redirect})
        } else {
            window.location.replace(`${location.origin}/mine`);
        }
    }
}


