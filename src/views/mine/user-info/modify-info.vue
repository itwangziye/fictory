<template>
  <pagecontain>
      <template slot="header">
            <van-nav-bar
            title="修改密码"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>

        <van-form 
        validate-first
        :show-error-message="false"
        :show-error="false"
        @submit="onSubmit"
        @failed="onFailed"
        class="modify"
        >
            <van-field
                v-model="form.mobile"
                type="text"
                name="text"
                placeholder="请输入旧密码"
                :rules="[{ required: true, message: '请输旧密码'}]"
            />
            <van-field
                v-model="form.password"
                type="password"
                name="password"
                placeholder="请输入新密码"
                :rules="[{ required: true, message: '请输入新密码'}]"
            />
            <van-field
                v-model="confirmPassword"
                type="password"
                name="password"
                placeholder="请确认新密码"
                :rules="[{ required: true, message: '请确认新密码', validator: validatorPassword}]"
            />
            <div class="loginForm-button">
                <van-button :class="['button', {disabled: buttonDisabled}] " :disabled="buttonDisabled" loading-text="正在更改密码···" :loading="loading" round block type="warning" native-type="submit">确定修改</van-button>
            </div>
        </van-form>
  </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue'
import PageMixins from '@/mixins/page-mixins';
import api from '@/api/user';

@Component({
    components: {
        pagecontain
    }
})
export default class ModifyInfo extends Mixins(PageMixins) {

    form: any = {
        mobile: '',
        password: ''
    }
    confirmPassword: string =  '';
    loading: boolean = false;


    get buttonDisabled() :boolean{
		const form = this.form;
		const {mobile, password} = form;
        const confirmPassword = this.confirmPassword;
        if (!mobile || !password || !confirmPassword) return true;
		return false;
	}

    validatorPassword() {
        if (this.form.password === this.confirmPassword) {
            return true
        }
        return false;
    }

    // 失败统一toast 提示
    onFailed({values, errors}: any) {
        const [first, ...rest] = errors;
        const {message} = first;
        if (message) this.$toast(message);
    }

    onSubmit() :void {
    	this.updateUserPasswordReq(this.form);
    }

    async updateUserPasswordReq (parmas: any) {
        try {
            this.loading = true;
            await api.updateUserPassword.exec(parmas);
            this.loading = false;
			this.$toast.success('修改成功！');
            this.$router.back();
        } catch (error) {
            console.log(error);
            this.loading = false;
        }
    }


}
</script>

<style scoped lang="less">
    .modify {
        .loginForm-button {
            padding: 40px 24px;
            text-align: right;
        }
        .loginForm-tip {
            padding-top: 20px;
            padding-bottom: 20px;
            color: @blue;
        }
    }
</style>
