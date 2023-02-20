import { useLocalStorage } from "@vueuse/core";

const jiangjieConfig = useLocalStorage("jiangjieConfig", {enable: false, item: ""});

// 产品上车
function shangChe () {
  const {enable, item} = jiangjieConfig.value;
  if (enable && item) {
    // 检测是否有意境上车商品，如果有，将其下车
    const itemList = Array.from(document.querySelectorAll(".sort-goods-container--h3xS0.goods-item--xkjBr"))
    .filter((node)=>/recording/.test(node.id))
    .map((node) => {
      const match = node.id.match(/\d{14,}/);
      const id = match ? match[0] : "";
      return id;
    });
    if (itemList.length === 0) {
      const btns = document.querySelectorAll(`#c1goods-${jiangjieConfig.value.item} .ant-btn`) as NodeListOf<HTMLButtonElement>;
      if (btns && btns.length === 4) {
        console.log("上车");
        btns[2].click();
      } else {
        console.log("在车上");
      }
    }
  }
}

setInterval(() => shangChe(), 1000)
export { jiangjieConfig }
