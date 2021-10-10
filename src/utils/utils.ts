import qs from 'qs'

// 基准大小
const baseSize = 75
// 依托rem.js
function px2rem(val: string, remUnit = baseSize, remPrecision = 6) { // px值-基准-有效小数
  let remVal = parseFloat(val);
  remVal = remVal/remUnit;
  remVal = parseFloat(remVal.toFixed(remPrecision))
  return remVal==0?'0':remVal+'rem'
}


//把页面的px转成设计图px
function setPx(base = baseSize) {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const maxWidth=750;
  const nowWidth=document.documentElement.clientWidth>maxWidth?maxWidth:document.documentElement.clientWidth;
  const scale = nowWidth / 750
  // const scale = document.documentElement.clientWidth / 1024
  // 设置页面根节点字体大小
  return base * Math.min(scale, 2)
}

//把设计图px转成页面px
function getRealPx(base = baseSize) {
  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const maxWidth=750;
  const nowWidth=document.documentElement.clientWidth>maxWidth?maxWidth:document.documentElement.clientWidth;
  const scale = nowWidth / 750
  // const scale = document.documentElement.clientWidth / 1024
  // 设置页面根节点字体大小
  return base / Math.min(scale, 2)
}

// 是不是pc端
function isPc() {
  var uaInfo = navigator.userAgent;
  var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
  var flag = true;
  for (var i = 0; i < agents.length; i++) {
    if (uaInfo.indexOf(agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}


function isWeiXinClient(){
  let ua: any = window.navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i) == 'micromessenger'){
      return true;
  }else{
      return false;
  }
}

const getWebUrl = (url: string) :string =>{
  let jumpUrl = url;
  if (~url.indexOf('aiTKweb://')) {
    const urlCot = jumpUrl.replace('aiTKweb://', '');
    jumpUrl = `${location.origin}/${urlCot}`
  }
  return jumpUrl;
}


const getUuid = (len: number, radix: number) :string =>{
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
      let r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
      }
  }

  return uuid.join('');
}

export default {
  px2rem,
  setPx,
  getRealPx,
  isPc,
  isWeiXinClient,
  getWebUrl,
  getUuid
}