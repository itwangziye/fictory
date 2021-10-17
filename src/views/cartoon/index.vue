<template>
  <pagecontain>
      <template slot="header">
            我是漫画目录
        </template>
  </pagecontain>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import pagecontain from '@/components/pagecontain.vue'
import PageMixins from '@/mixins/page-mixins';

@Component({
    components: {
        pagecontain
    }
})
export default class Movie extends Mixins(PageMixins) {

}
</script>

<style scoped lang="less">

</style>
