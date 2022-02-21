<template>
    <pagecontain>
        <template slot="header">
            <van-nav-bar
            :title="$t('page.user.title')"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>
        <div class="user">
            <van-cell 
            v-for="(item, index) in cellOptions" 
            :key="index" 
            is-link 
            :title="item.label"
            >
                <template>
                    <div class="custom" >
                        <div v-if="item.key === 'id'" v-clipboard:copy="item.value"  v-clipboard:success="onCopy">
                            {{item.value}}
                        </div>
                        <div v-else-if="item.key === 'name'">
                            {{item.value}}
                        </div>
                        <div v-else>
                            <!-- <div v-show="!userInfo">
                                <van-uploader 
                                    v-model="fileList" 
                                    :max-count="1"
                                    :max-size="2024 * 1024" 
                                    :after-read="afterRead"
                                    @oversize="onOversize"
                                    ref="uploadImg"
                                />
                                <img
                                    class="user__photo"
                                    :src="item.avatar"
                                    @click="handleUpload"
                                >
                            </div> -->

                        </div>
                    </div>
                </template>
                <template #right-icon v-if="item.key === 'id' ">
                    <span v-clipboard:copy="item.value"  v-clipboard:success="onCopy"  class="copy iconfont">{{$t('page.user.copy__text')}}</span>
                </template>
            </van-cell>
        </div>

        <template slot="footer">
            <div class="user__foot">
                <van-button class="button" type="warning"  loading-text="loading···" :loading="loading" round block  @click="handlerLoginOut">{{$t('page.user.login__out__text')}}</van-button>
            </div>
        </template>
    </pagecontain>
  
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import PageMixins from '@/mixins/page-mixins';
import pagecontain from '@/components/pagecontain.vue';
import {mapGetters} from 'vuex';

@Component({
  components: {
    pagecontain,
  },
  computed: {
    ...mapGetters({
      userInfo: "home/userInfo",
    }),
  },
})
export default class UserInfo extends Mixins(PageMixins) {

    loading: boolean = false;
    get cellOptions() :any[]{
        const userInfo = (this as any).userInfo;
        return [
            {label: this.$t('page.user.avater'), key: 'avater', value: userInfo.headImageUrl},
            {label: this.$t('page.user.name'), key: 'name', value: userInfo.userName},
            {label: 'ID', key: 'id', value: userInfo.userId},
        ]
    }

    // 退出登录
    handlerLoginOut() :void {
        this.$dialog.confirm({
            title: `${this.$t('page.user.copy__info')}？`,
            confirmButtonText: `${this.$t('common.components.confirm_text')}`,
            cancelButtonText: `${this.$t('common.components.cancel_text')}`
        })
        .then(async () => {
            this.loading = true;
            this.$store.dispatch('home/loginout');
            this.loading = false;
        })
        .catch(() => {
            console.log('取消')
        });
        console.log('退出登录')
    }

    onCopy() :void{
        this.$toast({message: `${this.$t('page.user.copy__info')}`})
    }

    // 点击图像
    // handleUpload (){
    //     this.$nextTick(() => {
    //         const uploadImg: any = (this as any).$refs.uploadImg;
    //         uploadImg.chooseFile();
    //     });
    // }

    // // 上传逻辑
    // async afterRead (file: any) {
    //     this.unloadImg('photo', file); 
    // }

    async init() {
        await this.$store.dispatch("home/getUserInfo");
    }
    created() {
        this.init();
    }
}
</script>

<style scoped lang="less">
    .user {
        @{deep} .van-cell__title {
            flex: 0.5;
        }
        .custom {
            text-align: right;
        }
        .iconfont.copy {
            margin-left: 24px;
            color: @blue;
        }
    }

    .user__foot {
        padding: 40px 24px;
        .button{
            height: 96px;
            line-height: 96px;
            font-size: @text-size6;
            font-weight: 600;
        }
    }
</style>
