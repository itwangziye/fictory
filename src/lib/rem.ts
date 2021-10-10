import utils from "@/utils/utils"
// 设置 rem 函数
function setRem() {
  // 设置页面根节点字体大小
  document.documentElement.setAttribute('style', 'font-size: '+ utils.setPx()+'px');
  // document.documentElement.style.maxWidth=maxWidth+"px"
}
// 初始化
setRem()
// 改变窗口大小时刷新
window.onresize = function() {
  // todo 有bug 弹出键盘会reload page
  // location.reload()
}