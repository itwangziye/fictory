<template>
    <div class="header">
        <div class="topbar">
            <div class="topbar__lt click-able" @click="handlerChangeLang">
                <span>{{langText}}</span>
                <span class="iconfont arrow__top"></span>
            </div>
            <div class="topbar__md">
                {{$t('page.home.title')}}
            </div>
            <div class="topbar__rt"> </div>
        </div>

         <van-popup v-model="showPicker" round position="bottom">
            <van-picker
                ref="currencyPicker"
                show-toolbar
                :default-index="langIndex"
                :columns="langOptions"
                @cancel="showPicker = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
    
</template>

<script lang="ts">
import { Component, Mixins, Emit, Prop, Watch} from 'vue-property-decorator';
import { mapGetters } from 'vuex'
import {Storage} from '@/utils/storage';
import PageMixins from '@/mixins/page-mixins';

@Component({
    name: 'HomeHeader',
    computed: {
        ...mapGetters({
            'userNomalConfig': 'metadata/userNomalConfig',
            'token': 'home/token'
        })
    },
})
export default class TopBar extends Mixins(PageMixins) {
    showPicker: boolean = false;


    get langOptions() {
        return [
            {text: '中文（简体）', en: 'zh_cn'},
            {text: '中文（繁体）', en: 'zh_hk'},
            {text: 'English', en: 'en_us'},
            {text: 'português', en: 'pt'},
            {text: 'عربي', en: 'ar'}
        ]
    }

    get langText() :string{
        const userNomalConfig = (this as any).userNomalConfig;
        const langOptions = (this as any).langOptions;
        if (!userNomalConfig || !langOptions) return '中文';
        const {lang} = userNomalConfig;
        const cuurencyItem = langOptions.find((item: any) => item.en === lang);
        if (cuurencyItem) {
            return cuurencyItem.text;
        }
        return '中文'
    }

    get langIndex() :number{
        const userNomalConfig = (this as any).userNomalConfig;
        const langOptions = (this as any).langOptions;
        if (!userNomalConfig || !langOptions) return 0;
        const {fc_lang} = userNomalConfig;
        const langIndex = langOptions.findIndex((item: any) => item.en === fc_lang);
        return langIndex
    }

  
    handlerChangeLang() {
        this.showPicker = true;
    }


    onConfirm(value: string, index: number) :void{
        this.showPicker = false;
        const langOptions = (this as any).langOptions;
        const item: any = langOptions[index];
        Storage.setLocalStorage('fc_lang',  item.en, 0);
        location.reload();
    }


    init(data: any[] = []) {
        
    }
}
</script>

<style scoped lang="less">
    .header {
        padding-bottom: 10px;
        background: #fff;
    }
    .topbar {
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
        .arrow__top {
            background-image: url('../../assets/common/arrow_down_b.png');
            background-size: 100%;
            display: inline-block; 
            width: 28px;
            height: 28px;
            margin-left: 4px;
        }
        &__lt {
            font-size: @text-size6;
            color: @text-color1;
            height: 100%;
            line-height: 100px;
        }
        &__md {
            flex: 1;
            position: relative;
            text-align: center;
            font-size: @text-size6;
        }
        &__rt {
            width: 80px;
        }

        &__hot {
            position: absolute;
            top: 100px;
            left: 0;
            right: 0;
            background-color: @white;
            height: 300px;
            z-index: 2;
            padding: 24px;
            &.navbar {
                top: 168px;
            }
            .hot__title {
                font-size: @text-size6;
                color: @text-color1;
                padding: 16px 0 28px;
            }
            .hot__tag-item {
                padding: 14px 20px;
                color: @text-color3;
                display: inline-block;
                border-radius: 30px;
                background-color: @bg-color;
                margin-right: 20px;
                margin-bottom: 20px;
            }
        }

    }

    // .search {
    //     padding: 0 24px;
    //     &-input{
    //         padding: 0;
    //         /deep/.van-search__content {
    //             background-color: #F5F5F5;
    //             height: 72px;
    //             padding: 0 35%;
    //             align-items: center;
    //         }
    //         /deep/.van-cell{
    //             padding: 0;
    //             height: 100%;
    //         }
    //         /deep/.van-field__body, /deep/.van-field__control{
    //             height: 100%;
    //             line-height: 100%;
    //         }
    //         /deep/.van-field__left-icon{
    //             display: flex;
    //             align-items: center;
    //         }
    //         /deep/.van-field__control::placeholder{
    //             color: @text-color4;
    //         }
    //     }
    // }
</style>
