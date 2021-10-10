<template>
  <div class="goods">
    我是书架
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Book extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped lang="less">

</style>
