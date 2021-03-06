import Vue from 'vue';
import '@/lib/rem';

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import dayjs from 'dayjs';

import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import { 
    Button, 
    Toast, 
    Search, 
    Image as VanImage, 
    Loading, 
    Swipe, 
    SwipeItem, 
    Lazyload,
    Tab, 
    Tabs,
    List,
    Picker,
    Popup,
    Overlay,
    Form,
    Field,
    Popover,
    Dialog,
    NavBar,
    Stepper,
    Cell,
    CellGroup,
    NoticeBar,
    PullRefresh,
    RadioGroup,
    Radio, 
    Collapse,
    CollapseItem,
    Divider,
    Tabbar, 
    TabbarItem,
    Icon,
    Tag,
    ActionSheet,
    Grid, 
    GridItem,
    Uploader,
    Checkbox, 
    CheckboxGroup,
    Empty
} from 'vant';

Vue.component(Button.name, Button);

Vue.use(Toast);
Vue.use(Search);
Vue.use(VanImage);
Vue.use(Loading);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(List);
Vue.use(Picker);
Vue.use(Popup);
Vue.use(Overlay);
Vue.use(Form);
Vue.use(Field);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(NavBar);
Vue.use(Stepper);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(NoticeBar);
Vue.use(PullRefresh);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Divider);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.use(Tag);
Vue.use(ActionSheet);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(Uploader);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Empty);


Vue.prototype.$dayjs = dayjs;
