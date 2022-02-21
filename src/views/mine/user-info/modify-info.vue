<template>
  <pagecontain>
      <template slot="header">
            <van-nav-bar
            :title="$t('page.user_modify.title')"
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
                v-model="form.oldPassword"
                type="text"
                name="text"
                :placeholder="$t('page.user_modify.password__old')"
                :rules="[{ required: true, message: $t('page.user_modify.password__old')}]"
            />
            <van-field
                v-model="form.newPassword"
                type="password"
                name="password"
                :placeholder="$t('page.user_modify.password__new')"
                :rules="[{ required: true, message: $t('page.user_modify.password__new')}]"
            />
            <van-field
                v-model="confirmPassword"
                type="password"
                name="password"
                :placeholder="$t('page.user_modify.password__confirm')"
                :rules="[{ required: true, message: $t('page.user_modify.password__confirm'), validator: validatorPassword}]"
            />
            <div class="loginForm-button">
                <van-button :class="['button', {disabled: buttonDisabled}] " :disabled="buttonDisabled" :loading-text="$t('common.components.loading')" :loading="loading" round block type="warning" native-type="submit">{{$t('page.user_modify.confirm__text')}}</van-button>
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
        oldPassword: '',
        newPassword: ''
    }
    confirmPassword: string =  '';
    loading: boolean = false;


    get buttonDisabled() :boolean{
		const form = this.form;
		const {oldPassword, newPassword} = form;
        const confirmPassword = this.confirmPassword;
        if (!oldPassword || !newPassword || !confirmPassword) return true;
		return false;
	}

    validatorPassword() {
        if (this.form.newPassword === this.confirmPassword) {
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
			this.$toast.success(`${this.$t('page.user_modify.confirm__success')}！`);
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
