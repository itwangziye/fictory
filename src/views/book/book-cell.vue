<template>
    <pagecontain>
        <template slot="header" v-if="bookCellDetail">
            <van-nav-bar
            :title="bookCellDetail.bookChapterName"
            left-arrow
            @click-left="onClickLeft"
            />
        </template>
        <div class="book__cell" v-if="bookCellDetail">
            <div class="book__cell-content">
                {{bookCellDetail.bookContent}}
            </div>
        </div>
    </pagecontain>
    
</template>

<script lang="ts">
import { Component, Mixins} from 'vue-property-decorator';
import api from '@/api/book';
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins'

@Component({
    components: {
        pagecontain
    }
})
export default class BookCell extends Mixins(PageMixins) {

    bookCellDetail: any = null;
    
    init() {
        const query = this.$route.query;
        if (query && query.bookChapterId) {
            this.bookChapterGetDetailReq({bookChapterId: query.bookChapterId})
        }
    }

    async bookChapterGetDetailReq(parmas: any) {
        try {
           const data = await api.bookChapterGetDetail.exec(parmas) 
           this.bookCellDetail = data;
        } catch (error) {
            console.log(error)
        }
    }

    created() {
        this.init();
    }
}
</script>

<style scoped lang="less">

</style>
