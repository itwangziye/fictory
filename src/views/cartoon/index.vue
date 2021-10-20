<template>
	<pagecontain
	:loading="pageLoading"
	:error="pageError"
	@on-retry="initPage"
	>
		<div class="recommend">
			<div class="recommend__falls margin__top">
				<van-list
				v-model="loading"
				:error.sync="error"
				:finished="finished"
				finished-text="没有更多了"
				error-text="请求失败，点击重新加载"
				@load="onLoad"
				>
					<div class="recommend__falls-list">
						<goods-temp
						source_from="recommend"
						v-for="(item, index) in list" 
						:key="index"
						:opt="item"
						>
						</goods-temp>
					</div>
				</van-list>
			</div>

			
		</div>
	</pagecontain>
</template>

<script lang="ts">
import { Component, Mixins} from "vue-property-decorator";
import pagecontain from '@/components/pagecontain.vue';
import PageMixins from '@/mixins/page-mixins';
import GoodsTemp from '@/components/goods-temp.vue';
import api from '@/api/book';


@Component({
	name: 'Recommend',
	components: {
        pagecontain,
		GoodsTemp
	}
})
export default class Cartoon extends Mixins(PageMixins) {

	loading: boolean = true;
    finished: boolean = false;
    error: boolean = false;
    pagination: any = {
        pageIndex: 1,
        pageSize: 10
    }
	list: any[] = [];
    bookTypeId: string = '2';

	onLoad() :void{
        let {pageIndex} = this.pagination;
        pageIndex = ++pageIndex;
        this.bookGetListRequest({...this.pagination, pageIndex, bookTypeId: this.bookTypeId})
    }


	async bookGetListRequest(parmas: any) {
        try {
            this.loading = true;
            const {resultList, pageIndex, pageSize, totalCount, totalPage} = await api.bookGetList.exec(parmas)
            this.list = this.list.concat(resultList);
            this.loading = false;
            this.pagination = {
                pageIndex,
                pageSize,
                totalCount,
                totalPage
            }
            if (pageIndex >= totalPage) {
                this.finished = true;
            }
        } catch (error) {
            console.log(error)
            if (error && error.code === 'interrupt') {
				return;
			}
            this.loading = false;
            this.error = true;
        }
    }

    async initPage() {
        this.pageLoading = true;
		await this.bookGetListRequest({...this.pagination, bookTypeId: this.bookTypeId})
		this.pageLoading = false;
    }

	created() {
		this.initPage()
	}

}
</script>

<style scoped lang="less">
.recommend {
	&__swipe {
		padding: 0 24px;
		&-item {
			height: 260px;
			width: 100%;
			.img {
				width: 100%;
				height: 100%;
				border-radius: 24px;
			}
		}
	}

	&__falls {
        padding: 0 24px;
        margin-top: 20px;
		&-list {
			column-count: 2;
			// display: flex;
            // justify-content: space-between;
            // flex-direction: column;
			// flex-wrap: wrap;
		}
    }
}
</style>
