import { createApp, reactive, watch } from "vue";
import Config from "./config.vue";
import ElementPlus, { autoResizerProps } from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from "pinia";
import axios from "axios";
import { useLocalStorage } from "@vueuse/core";

import { initComment } from "./comment";

import "./autoRepy";
import "./jiangjie";
// import { useLocalStorage } from "@vueuse/core";
// import sound from "../../asstes/sounds/message1.mp3";

// @ts-ignore
window.inExtension = true;

const app = createApp(Config);

const div = document.createElement("div");
const id = "ksLiveHelper"
div.id = id;
document.body.appendChild(div);

const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);
app.mount(`#${id}`);

const {value: liveCurrent} = useLocalStorage<Record<string, any>>("liveCurrent", {});
(async function () {
  const { data } = await axios.post("https://zs.kwaixiaodian.com/rest/pc/live/assistant/live/current");
  if (data.result === 1) {
    const {liveStreamId, centerConsoleInfo} = data.data;
    liveCurrent.liveStreamId = liveStreamId;
    liveCurrent.centerConsoleInfo = centerConsoleInfo;
    // 初始化评论模块
    initComment();
  }
})();


// const url = chrome.runtime.getURL(sound)
// console.log(url);
// const audio = new Audio(url);
// document.body.appendChild(audio);
// setTimeout(() => {
//   audio.play();
// }, 3000);



// 关闭联合拉新
function closeFudai() {
  const closeBtn = document.querySelector(".ant-popover-content .ant-popover-title .anticon") as HTMLButtonElement;
  if (closeBtn) {
    console.log("关闭联合拉新");
    closeBtn.click();
  } else {
    console.log("没有联合拉新")
  }
}
setInterval(closeFudai, 100000);


export {}