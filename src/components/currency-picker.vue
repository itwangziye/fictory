<template>
    <div>
        <van-popup v-model="isShow" round position="bottom" @click-overlay="sendVisible(false)">
            <van-picker
                :confirm-button-text="$t('common.components.confirm_text')"
                :cancel-button-text="$t('common.components.cancel_text')"
                show-toolbar
                :default-index="currencyIndex"
                :columns="currencyData"
                @cancel="onCancel"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Prop, Watch} from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import {Storage} from '@/utils/storage'


@Component({
    name: 'currencyPicker',
    computed: {
        ...mapGetters({
            'currencyOptions': 'metadata/currencyOptions',
            'userNomalConfig': 'metadata/userNomalConfig',
        })
    }
})
export default class currencyPicker extends Vue {
    @Prop({default: false}) visible?: boolean;
    isShow: boolean = false;

    get currencyData() {
        const currencyOptions = (this as any).currencyOptions;
        if (!currencyOptions || !currencyOptions.length) return [];
        return currencyOptions.map((item: any) => {
            const {targetCurrencyText, targetCurrencyTag} = item;
            return {
                text: `${targetCurrencyText}(${targetCurrencyTag})`
            }
        })
    }

    get currencyIndex() :number{
        const userNomalConfig = (this as any).userNomalConfig;
        const currencyOptions = (this as any).currencyOptions;
        if (!userNomalConfig || !currencyOptions) return 0;
        const {fc_currency} = userNomalConfig;
        const currencyIndex = currencyOptions.findIndex((item: any) => item.targetCurrency === fc_currency);
        return currencyIndex
    }

    onConfirm(value: string, index: number) :void{
        this.isShow = false;
        const currencyOptions = (this as any).currencyOptions;
        const item: any = currencyOptions[index];
        const val = item.targetCurrency;
        Storage.setLocalStorage('fc_currency', val, 0);
        location.reload();
    }

    onCancel() :void{
        this.sendVisible(false);
    }

    @Emit('update:visible')
	sendVisible(paylaod: boolean) {}
    
    @Watch('visible', {immediate: true})
    onVisibleChange(newVal: boolean) {
        this.isShow = newVal;
    }
}
</script>

<style scoped lang="less">
    
</style>
