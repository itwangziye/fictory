<template>
    <pagecontain>
        <template slot="header">
            <van-nav-bar
            title="用户注册"
            left-text="返回"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>

        <div class="login">
            <div class="login__tip">
                <div class="login__text">
                    <div class="tp">注册</div>
                    <div class="dn">Welcome</div>
                </div>
            </div>

            <div class="login__content">
                <div class="login__content-logo">
                    <div class="logo">
                        <div>内容</div><div>支付</div>
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
                            type="tel"
                            name="tel"
                            placeholder="请输入账号"
                            :rules="[{ required: true, message: '请输入账号'}]"
                        />
                        <van-field
                            v-model="form.password"
                            type="password"
                            name="password"
                            placeholder="请输入密码"
                            :rules="[{ required: true, message: '请输入密码'}]"
                        />
                        <van-field
                            v-model="form.repassword"
                            type="password"
                            name="password"
                            placeholder="请再次输入密码"
                            :rules="[{ required: true, message: '请再次输入密码'}]"
                        />
                        <div class="loginForm-button">
                            <div class="loginForm-tip">
                                <div class="click-list" @click="goPage('login')">返回登录</div>
                            </div>
                            <van-button :class="['button', {disabled: buttonDisabled}] " :disabled="buttonDisabled" loading-text="正在注册中···" :loading="loading" round block type="info" native-type="submit">注册</van-button>
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
import api from '@/api/common';

@Component({
    components: {
        pagecontain
    }
})
export default class Login extends Mixins(PageMixins) {
    form: any = {
        mobile: '',
        password: '',
        repassword: ''
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
    	this.registerRequest(this.form);
    }

    async registerRequest (parmas: any) {
        try {
            this.loading = true;
            const res = await api.register.exec(parmas);
            this.loading = false;
            this.$router.replace('/home');
			this.$toast.success('注册成功！');
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
