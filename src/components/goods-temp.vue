<template>
    <div v-if="opt" class="goods click-list" @click="handerGoodsDetail">
        <van-image lazy-load  v-if="opt.bookImageUrl" :src="opt.bookImageUrl" class="img">
            <template v-slot:loading>
                <van-loading type="spinner" size="20" />
            </template>
        </van-image>
        <div class="goods__main">
            <div class="goods__title">
                {{opt.authorName}}
            </div>
            <div class="goods__tag"> 
                <van-tag class="tag__item" plain type="warning">{{opt.bookTypeName}}</van-tag>
                <van-tag class="tag__item" plain type="primary">{{opt.bookStateText}}</van-tag>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class GoodsTemp extends Vue {

    @Prop() opt?: any;

    // handlerGoodsItem() {
    //     const {id} = this.opt;
    //     this.$router.push({path: 'goods/goods-detail', query: {id, source_from: this.source_from}})
    // }

    handerGoodsDetail() :void{
        const {bookId} = this.opt;
        this.$router.push({name: 'Book', query: {bookId}})
    }
}
</script>

<style scoped lang="less">
    .goods {
        background-color: @white;
        border-radius: 16px;
        // padding: 32px 20px 0;
        width: 340px;
        height: auto;
        box-sizing: border-box;
        margin-bottom: 20px;
        -webkit-column-break-inside: avoid;
        page-break-inside:avoid;
        display: inline-block;
        .img {
            width: 340px;
            height: 340px;
            /deep/.van-image__img{
                border-radius: 16px 16px 0px 0px;
            }
        }

        &__main{
            padding: 0 20px 5px 20px;
        }

        &__title {
            color: @text-color1;
            font-size: @text-size5;
            font-weight: 500;
            max-height: 80px;
            // min-height: 80px;
            margin: 10px 0 12px;
            line-height: 40px;
            overflow: hidden;
            display: -webkit-box;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;  /*要显示的行数*/
            -webkit-box-orient: vertical;
        }

        &__tag {
            .tag__item {
                margin-right: 20px;
            }
        }



        

    }
</style>
