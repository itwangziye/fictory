// const CompressionPlugin = require('compression-webpack-plugin')
const path = require('path')
const px2rem = require('postcss-pxtorem')
const postcss = px2rem({
  rootValue({ file }) {
    return file.indexOf('vant') !== -1 ? 37.5 : 75;
  },//基准大小 baseSize，需要和rem.js中相同
  propList: ["*"],
})
const autoprefixer= require('autoprefixer')({ // 配置使用 autoprefixer
  overrideBrowserslist: ['last 20 versions'] // 记得这里要把 browsers 改为 overrideBrowserslist，autoprefixer 新版本的写法有变
})
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, './src/style/var.less'),
      ],
    })
}
const vueConfig = {
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
      
    if (process.env.NODE_ENV === 'production') {
      
      // 移除 prefetch 插件
      config.plugins.delete('prefetch')
      // 移除 preload 插件
      config.plugins.delete('preload');
      if (process.env.analyzer) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end();
      }
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.warnings = false
        args[0].terserOptions.keep_fnames = true;
        if(process.env.REMOVE_CONSOLE){
          args[0].terserOptions.compress.drop_console = true
          args[0].terserOptions.compress.pure_funcs = ['console.*']
        }
        return args
      })
      config.optimization.splitChunks({
        chunks: 'all',
        minSize: 300000, // 依赖包超过300000bit将被单独打包
        maxSize: 0,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          common: {
            name: "chunk-common",
            chunks: "initial",
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          },
          vendors: {
            name: "chunk-vendors",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority:2,
            minChunks:2,
            reuseExistingChunk: true,
            enforce: true
          },
          components: {
            name: "chunk-components",
            test: /[\\/]src[\\/]components[\\/]/,
            chunks: "all",
            priority: 3,
            reuseExistingChunk: true,
            minChunks: 2,
            minSize: 0,
            enforce: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      })
    }else{
      // 修复HMR
      config.resolve.symlinks(true);
    }
  },
  publicPath: '/',
  outputDir: 'dist',
  css: {
    // 将组件内部的css提取到一个单独的css文件（只用在生产环境）
    // 也可以是传递给 extract-text-webpack-plugin 的选项对象
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        lessOptions: {
          modifyVars: {
            '@blue': '#F95E09'
          }
        }
      },
      postcss: {
        plugins: [postcss,autoprefixer],
      },
    },
    extract: false, // 允许生成 CSS source maps?
    sourceMap: false, //
    requireModuleExtension: true
  },
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0",
    port: 8088,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_DOMAIN,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
    // before: app => {}
  }, // 第三方插件配置
  lintOnSave: false,
  parallel: require('os').cpus().length > 1,
  runtimeCompiler: false,
  productionSourceMap: process.env.NODE_ENV !== 'production'
};

// vueConfig.configureWebpack.plugins.push(new CompressionPlugin({
//   test: /\.js$|\.html$|\.css/, //匹配文件名
//   threshold: 10240, //对超过10k的数据进行压缩
//   deleteOriginalAssets: false //是否删除原文件
// }))

module.exports = vueConfig