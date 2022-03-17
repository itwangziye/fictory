<template>
    <div class="book click-list" @click="handlerBookDetail">
        <div class="book-lt">
            <van-image lazy-load fit="cover" v-if="opt.bookImageUrl" :src="opt.bookImageUrl" class="img">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
        </div>
        <div class="book-rt">
            <div class="title">
                {{opt.bookName}}
            </div>
            
            <p class="dec">
                {{opt.introduction}}
            </p>

            <div class="book-session">
                <div class="tag">
                    <van-tag class="tag__item" plain type="warning">{{opt.bookTypeName}}</van-tag>
                    <van-tag class="tag__item" plain type="primary">{{opt.bookStateText}}</van-tag>
                    <!-- <van-tag color="#7232dd" plain>标签</van-tag> -->
                </div>
                <div class="author">
                    <van-icon name="user-o" />
                    <span class="author__text">{{opt.authorName}}</span>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class BookTemp extends Vue {

    @Prop() opt?: any;


    handlerBookDetail() :void{
        const {bookId} = this.opt;
        console.log(bookId)
        this.$router.push({name: 'Book', query: {bookId}})
    }
}
</script>

<style scoped lang="less">
    .book{
        display: flex;
        padding: 12px;
        background-color: @white;
        width: 100%;
        &-lt {
            .img {
                width: 210px;
                height: 260px;
                border-radius: 8px;
                overflow: hidden;
                &::after{
                    position: absolute;
                    left: 0;
                    top: 0;
                    content: ' ';
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.02);
                }
            }
        }
        &-rt {
            flex: 1;
            padding-left: 20px;
            .book-session {
                padding-top: 20px;
                .author {
                    color: @text-color3;
                    font-size: @text-size5;
                    display: flex;
                    align-items: center;
                    padding-top: 20px;
                    &__text {
                        display: inline-block;
                        padding-left: 8px;
                    }
                }
                .tag__item {
                    margin-right: 20px;
                }
            }
            .title {
                color: @text-color1;
                font-size: @text-size5;
                padding-bottom: 20px;
            }
            .dec {
                color: @text-color4;
                height: 80px;
                line-height: 40px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                width: 100%;
            }
        }
    }
</style>
