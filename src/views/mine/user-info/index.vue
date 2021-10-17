<template>
    <pagecontain>
        <template slot="header">
            <van-nav-bar
            title="个人资料"
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
                    <div class="custom">
                        <div v-if="item.key === 'name'">
                            {{item.value}}
                        </div>
                    </div>
                </template>
            </van-cell>
        </div>

        <template slot="footer">
            <div class="user__foot">
                    <van-button class="button" type="warning"  loading-text="正在退出中···" :loading="loading" round block  @click="handlerLoginOut">退出</van-button>
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
            {label: '头像', key: 'avater', value: userInfo.headImageUrl},
            {label: '昵称', key: 'name', value: userInfo.userName},
            {label: 'ID', key: 'id', value: userInfo.userId},
        ]
    }

    // 退出登录
    handlerLoginOut() :void {
        this.$dialog.confirm({
            title: '确定退出登录？',
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
        .custom {
            text-align: right;
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
