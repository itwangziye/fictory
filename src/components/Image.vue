<template>
  <div class="tk-image">
    <slot v-if="loading" name="placeholder">
      <div class="tk-image__placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="tk-image__error"></div>
    </slot>
    <img
      v-else
      class="tk-image__inner"
      v-bind="$attrs"
      v-on="$listeners"
      :src="src"
    />
  </div>
</template>

<script>
export default {
  name: "TkImage",
  inheritAttrs: false,
  props: {
    src: String,
    fit: String,
    lazy: Boolean,
    scrollContainer: {},
    zIndex: {
      type: Number,
      default: 2000,
    },
  },

  data() {
    return {
      loading: true,
      error: false,
      show: !this.lazy,
      imageWidth: 0,
      imageHeight: 0,
      showViewer: false,
    };
  },



  watch: {
    src(val) {
      this.show && this.loadImage();
    },
    show(val) {
      val && this.loadImage();
    },
  },

  mounted() {
    this.loadImage();
  },
  methods: {
    loadImage() {
      if (this.$isServer) return;

      // reset status
      this.loading = true;
      this.error = false;

      const img = new Image();
      img.onload = (e) => this.handleLoad(e, img);
      img.onerror = this.handleError.bind(this);

      // bind html attrs
      // so it can behave consistently
      Object.keys(this.$attrs).forEach((key) => {
        const value = this.$attrs[key];
        img.setAttribute(key, value);
      });
      img.src = this.src;
    },
    handleLoad(e, img) {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      this.loading = false;
      this.error = false;
    },
    handleError(e) {
      this.loading = false;
      this.error = true;
      this.$emit("error", e);
    }
  }
};
</script>

<style lang="less" scoped>
    .tk-image__inner{
        width: 100%;
        height: 100%;
        vertical-align: top;
    }
</style>
