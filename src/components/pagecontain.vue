<template>
    <div class="page-container">
        <div class="page-container__header" v-if="showHeader">
            <slot name="header">
                
            </slot>
        </div>
        <div class="page-container__main" @scroll="onScroll" ref="containerMain">
            <div v-if="empty" class="page-container__empty">
                <slot name="empty">
                    <div class="page-container__default-empty">
                        <div class="container-empty__icon iconfont icon-wushuju1"></div>
                        <p class="container-empty__title">暂无数据</p>
                    </div>
                </slot>
            </div>
            <div v-else-if="error" class="page-container__error">
                <slot name="error">
                    <div class="page-container__default-error">
                        <p class="container-error__title">数据请求失败，请重试</p>
                        <span class="container-error__button" @click="onRetry">重试</span>
                    </div>
                </slot>
            </div>
            <div v-else-if="loading" class="page-container__loading">
                <slot name="loading">
                    <div class="page-container_default-loading">
                        <van-loading class="container-loading__icon" type="spinner" />
                        <p class="container-loading__title">加载中...</p>
                    </div>
                </slot>
            </div>
            <van-pull-refresh 
            :disabled="disabledPullRefresh"
            v-model="isLoading" 
            @refresh="onPullRefresh"
            class="page-container__refresh"
            v-if="disabledPullRefresh"
            >
                <slot></slot>
            </van-pull-refresh>
            <template v-else>
                <slot></slot>
            </template>
        </div>
        <div class="page-container__footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageContainer',
        props: {
            empty: {
                type: Boolean,
                default: false,
            },
            error: {
                type: Boolean,
                default: false,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            disabledScroll: {
                type: Boolean,
                default: false,
            },
            showHeader: {
                type: Boolean,
                default: true,
            },
            navTitle: String,
            disabledPullRefresh: {
                type: Boolean,
                default: false
            },
            onRefresh: Function
        },
        data() {
            return {
                isLoading: false
            }
        },
        methods: {
            onRetry() {
                this.$emit('on-retry');
            },
            async onPullRefresh() {
                try {
                    if (this.onRefresh) await this.onRefresh();
                    this.isLoading = false 
                } catch (error) {
                    this.isLoading = false;
                }
                
            },
            onScroll(e) {
                const scorllTop = e.target.scrollTop;
                this.$emit('scroll', scorllTop)
            },
            scorllTop(top) {
                const containerMain = this.$refs.containerMain;
                containerMain.scrollTop = top;
            }
        }
    }
</script> 

<style lang="less">
    .page-container {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        display: flex;
        flex-flow: column;
        background-color: @bg-color;
    }
    .page-container__header {
        flex: 0 0 auto;
        position: relative;
    }
    .page-container__footer {
        flex: 0 0 auto;
    }
    .page-container__main {
        position: relative;
        flex: 1 1 100%;
        overflow-y: auto;
    }
    .page-container__refresh {
        height: 100%;
        overflow-y: auto;
    }
    .page-container__empty,
    .page-container__error,
    .page-container__loading {
        position: absolute;
        z-index: 2;
        left: 0;
        right: 0;
        background: #F0F0F0;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page-container__default-empty {
        .container-empty__icon {
            font-size: 60px;
            color: #afafaf;
            text-align: center;
        }
        .container-empty__title {
            text-align: center;
            margin-top: 10px;
            color: #afafaf;
            font-size: 12px;
        }
    }
    .page-container_default-loading {
        .container-loading__title {
            margin-top: 30px;
            line-height: 20px;
            font-size: 15px;
            text-align: center;
            color: #AAA;
        }
        .container-loading__icon {
            margin: 0 auto;
            display: block;
            width: 50px;
            height: 50px;

        }
    }
    .page-container__default-error {
        .container-error__title {
            line-height: 20px;
            font-size: 15px;
            text-align: center;
            color: #AAA;
        }
        .container-error__button {
            background: #2dbd84;
            color: #fff;
            width: 100px;
            line-height: 35px;
            font-size: 14px;
            display: block;
            margin: 20px auto 0;
            text-align: center;
        }
    }
</style>