<template>
    <pagecontain>
        <template slot="header">
            <van-nav-bar
            :title="$t('page.login.title')"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>

        <div class="login">
            <div class="login__tip">
                <div class="login__text">
                    <div class="tp">{{$t('page.login.login')}}</div>
                    <div class="dn">Welcome</div>
                </div>
            </div>

            <div class="login__content">
                <div class="login__content-logo">
                    <div class="logo">
                        <!-- <div>内容</div><div>支付</div> -->
                    </div>
                </div>

                <div class="login__content-form">
                    <van-form 
                    validate-first
                    :show-error-message="false"
                    :show-error="false"
                    @submit="onSubmit"
                    @failed="onFailed"
                    >
                        <van-field
                            v-model="form.mobile"
                            type="text"
                            name="text"
                            :placeholder="$t('page.login.account')"
                            :rules="[{ required: true, message: $t('page.login.account')}]"
                        />
                        <van-field
                            v-model="form.password"
                            type="password"
                            name="password"
                            :placeholder="$t('page.login.password')"
                            :rules="[{ required: true, message: $t('page.login.password')}]"
                        />
                        <div class="loginForm-button">
                            <div class="loginForm-tip">
                                <div class="click-list" @click="goPage('register')">{{$t('page.login.login_info')}}</div>
                            </div>
                            <van-button :class="['button', {disabled: buttonDisabled}] " :disabled="buttonDisabled"  :loading="loading" round block type="warning" native-type="submit">{{$t('page.login.login')}}</van-button>
                        </div>
                    </van-form>
                </div>
            </div>
        </div>

        
    </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins} from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins';
import api from '@/api/common'
import LoginMixins from '@/mixins/login-mixins'

@Component({
    components: {
        pagecontain
    }
})
export default class Login extends Mixins(PageMixins, LoginMixins) {
    form: any = {
        mobile: '',
        password: ''
    }
    loading: boolean = false;

    get buttonDisabled() :boolean{
		const form = this.form;
		const {mobile, password} = form;
        if (!mobile || !password) return true;
		return false;
	}

    // 失败统一toast 提示
    onFailed({values, errors}: any) {
        const [first, ...rest] = errors;
        const {message} = first;
        if (message) this.$toast(message);
    }

    onSubmit() :void {
    	this.loginInRequest(this.form);
    }

    async loginInRequest (parmas: any) {
        try {
            this.loading = true;
            const res = await api.loginIn.exec(parmas);
            this.setLoginInfo(res);
            this.loading = false;
			this.$toast.success(`${this.$t('page.login.login_success_info')}！`);
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }
}
</script>

<style scoped lang="less">
    .login{
        height: 100%;
        background-color: @white;
        &__tip {
            height: 160px;
            background-image: url('../../assets/mine/mine__bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            position: relative;
        }
        &__text {
            color: @white;
            position: absolute;
            left: 24px;
            top: 50%;
            transform: translateY(-50%);
            .tp {
                padding-bottom: 20px;
                font-size: @text-size6;
            }
        }

        &__content {
            &-logo {
                height: 350px;
                display: flex;
                justify-content: center;
                align-items: center;
                .logo {
                    width: 160px;
                    height: 160px;
                    background-color: @primary-color;
                    border-radius: 24px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: center;
                    font-size: 50px;
                    color: @white;
                    background-image: url('http://img-cdn.filefactory.com/embed/xl/1e24rlcgyfz6.png');
                    background-size: 100%;
                }
            }
        }

        .loginForm-button {
            padding: 0 24px 80px;
            text-align: right;
        }
        .loginForm-tip {
            padding-top: 20px;
            padding-bottom: 20px;
            color: @blue;
        }
    }
</style>
