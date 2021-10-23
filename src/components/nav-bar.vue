<template>
    <div class="navbar" v-if="navbarVisible">
        <div class="navbar__lt" :style="sliderStyles">
            <slot name="left">
                <div class="navbar__back click-able" @click="handlerBack">
                    <van-icon class="back" name="arrow-left" />
                </div>
            </slot>
        </div>

        <div class="navbar__md">
            <slot name="title">
                <div class="navbar__title">{{title}}</div>
            </slot>
        </div>

        <div class="navbar__rt" :style="sliderStyles">
            <slot name="right"></slot>
        </div>

    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop} from 'vue-property-decorator';

@Component
export default class NavBar extends Vue {
    navbarVisible: boolean = true;

    @Prop() title?: string;
    @Prop() pageBack?: Function;
    @Prop({default: 50}) sliderWidth?: number;

    get sliderStyles() :any{
        const sliderWidth = this.sliderWidth;
        return {
            width: `${sliderWidth}px`
        }
    }

    handlerBack() :void{
        if (this.pageBack) {
            this.pageBack();
            return;
        }
        this.$router.back();
    }
}
</script>

<style scoped lang="less">
    .navbar {
        height: 100px;
        display: flex;
        align-items: center;
        &__md {
            flex: 1;
        }

        &__back {
            width: 100px;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            .back {
                height: 48px;
                width: 48px;
                display: inline-block;
                font-size: 48px;
            }
        }

        &__title {
            width: 100%;
            text-align: center;
            font-size: 36px;
            color: @text-color1;
            font-weight: 500;
        }
    }
</style>
