import { useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { reactive, toRaw, watch } from "vue";

// const triggerInputChange = (node: HTMLInputElement, inputValue: string) => {
//   const descriptor = Object.getOwnPropertyDescriptor(node, 'value');

//   node.value = `${inputValue}#`;
//   if (descriptor && descriptor.configurable) {
//     // @ts-ignore
//     delete node.value;
//   }
//   node.value = inputValue;

//   const e = document.createEvent('HTMLEvents');
//   e.initEvent('change', true, false);
//   node.dispatchEvent(e);

//   if (descriptor) {
//     Object.defineProperty(node, 'value', descriptor);
//   }
// };

// function sendText(text: string) {
//   const input: HTMLInputElement | null = document.querySelector(".reply-all--i7FFC input[type=text]");
//   triggerInputChange(input as HTMLInputElement, text);
//   const button: HTMLButtonElement = document.querySelector(".reply-all--i7FFC button.ant-btn") as HTMLButtonElement;
//   button.click();
// }

const liveCurrent = useLocalStorage<Record<string, any>>("liveCurrent", {}, {mergeDefaults: true});


const configRef = useLocalStorage<Record<string, any>>("commentConfig", {
  messages: [
    "家里灶台缝隙、洗手池、瓷砖、马桶边、窗户缝隙、淋浴房、浴房，都可以用",
    "送运费险不好用包退", 
    "家用美缝剂瓷砖地砖厨房卫生间水池马桶都可以用，防水防霉",
    "现在下单就送全套工具，还送价值29.9米多功能铲刀",
    "一支是半斤装，可以用5-10米",
    "家里灶台缝隙、洗手池、瓷砖、马桶边、窗户缝隙、淋浴房、浴房，都可以用，防水防霉",
  ],
  currentIndex: 0,
  lastSendTime: 0,
  sendGap: 27,
  enable: false
}, { mergeDefaults: true });

const config = reactive(configRef.value);
watch(config, () => {
  configRef.value = toRaw(config);
})

function setMessages (messages: string[]) {
  config.messages = messages;
}

async function sendMessage(message: string) {
  const result = await axios.post(
    "https://zs.kwaixiaodian.com/rest/pc/live/assistant/comment/publish", 
    {"liveStreamId":liveCurrent.value.liveStreamId,"commentContent": message}
  );
  return result;
}

let inited = false;

function initComment () {
  !inited && setInterval(() => {
    const {enable, messages, currentIndex, lastSendTime, sendGap} = config;
    if (enable && new Date().getTime() - lastSendTime >= 6e4 * sendGap) {
      const message = messages[currentIndex];
      if (message) {
        sendMessage(message);
        console.log("发送消息", message);
      }
      config.currentIndex = currentIndex + 1;
      if (currentIndex >= messages.length) {
        config.currentIndex = 0;
      }
      config.lastSendTime = new Date().getTime();
    }
  }, 1000);
  inited = true;
}

export { sendMessage, initComment, setMessages, config }
