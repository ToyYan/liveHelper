console.log("live help loaded!!!");

function shangChe () {
  const btns = document.querySelectorAll("#c1goods-15180668802322 .ant-btn");
  if (btns && btns.length === 4) {
    console.log("上车");
    btns[3].click();
  } else {
    console.log("在车上");
  }
}

setInterval(shangChe, 1000);