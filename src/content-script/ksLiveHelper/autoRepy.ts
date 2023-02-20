import { useLocalStorage } from "@vueuse/core";
import { reactive, ref, toRaw, watch } from "vue";
// import injectjs from "./inject.js?url"
import axios from "axios";


const liveCurrent = useLocalStorage<Record<string, any>>("liveCurrent", {}, {mergeDefaults: true});

// 类型
// equal  等于
// start  开始
// end    结尾
// include  包含
export type MatchType = 
  | "equal"
  | "start"
  | "end"
  | "include";

export type RuleType = {
  message: string;
  allMatch: boolean;
  reServer?: boolean,
  rules: {
    type: MatchType;
    content: string;
  }[];
};

export type userType = {
  id: number;
  name?: string;
  avatar?: string;
}

const config = useLocalStorage<{
  lastParseTime: number;
  ignoreUsers: userType[];
  rules: RuleType[];
}>("autoRepyConfig", {
    lastParseTime: new Date().getTime(),
    ignoreUsers: [{id: 3055251322}],
    rules: [
      {
        message: "感谢支持，为您标注加急发货",
        allMatch: false,
        rules:[
          { type: "end", content: "加急"},
          { type: "end", content: "加急发货"},
          { type: "start", content: "已拍"},
        ],
      },
      {
        message: "上午拍，当天发货，最迟48小时内发货",
        allMatch: false,
        rules:[
          { type: "include", content: "什么时候发"}
        ],
      },
      {
        message: "1只39.8元，3只59.8元，现在拍送全套工具",
        allMatch: false,
        rules:[
          { type: "end", content: "怎么卖"},
          { type: "include", content: "有几只？"},
        ],
      },
    ],
  }, {mergeDefaults: true});

// 一支有多少米
// 

const repyRules = reactive(config.value.rules);
watch(repyRules, () => {
  config.value = {...config.value, rules: repyRules};
});

const ignoreUsers = reactive(config.value.ignoreUsers);
watch(ignoreUsers, () => {
  config.value = {...config.value, ignoreUsers};
})

function parseRule(msg: string, rules: RuleType["rules"], allMatch: boolean) {
  if (!msg) {
    return false;
  }
  for( const rule of rules) {
    switch(rule.type) {
      case "equal":
        if (msg === rule.content) {
          if (!allMatch) {
            return true;
          }
        } else if (allMatch) {
          return false;
        }
        break;
      case "start":
        if (msg.startsWith(rule.content)) {
          if (!allMatch) {
            return true;
          }
        } else if (allMatch) {
          return false;
        }
        break;
      case "end":
        if (msg.endsWith(rule.content)) {
          if (!allMatch) {
            return true;
          }
        } else if (allMatch) {
          return false;
        }
        break;
      case "include":
        if (msg.indexOf(rule.content) >= 0) {
          if (!allMatch) {
            return true;
          }
        } else if (allMatch) {
          return false;
        }
        break;
    }
  }
  return false;
}

// const noRepyUsers = [3055251322];
const sellUserId = (() => {
  const r = /userId=(\d+)/.exec(document.cookie);
  if (r) {
    return new Number(r[1]);
  }
  return 100  // 不会出现100的用户id
})();

function getRepyMessage(msg: string, sender: number | null = null): {message: string, reServer?: boolean} | null {
  if (sender !== null) {
    if (ignoreUsers.findIndex(({id}) => id == sender) >= 0 || sellUserId == sender) {
      return null;
    }
  }

  for(const rule of repyRules) {
    const { message, allMatch, rules, reServer } = rule;
    if (parseRule(msg, rules, allMatch) && message) {
      return {message, reServer};
    }
  }

  return null;
}

export type repyMessageType = {
  liveStreamId: number;
  replyContent: string;
  commentId: number;
  fromUserId: number;
}


async function repyMessage(msgBody: repyMessageType) {
  const result = await axios.post(
    "https://zs.kwaixiaodian.com/rest/pc/live/assistant/comment/reply", 
    msgBody
  );
  return result;
}
// test
// console.log(getRepyMessage("已拍加急"));
// console.log(getRepyMessage("拍了加急发货"));
// console.log(getRepyMessage("已拍，啊啊啊"));
// console.log(getRepyMessage("什么时候发货啊"));
// console.log(getRepyMessage("什么时候发货"));
// console.log(getRepyMessage("怎么卖"));
// console.log(getRepyMessage("有几只？"));

// console.log(injectjs);

const script = document.createElement("script");
script.src = chrome.runtime.getURL("scripts/inject.js");
document.body.append(script);


const audio = new Audio(chrome.runtime.getURL("assets/sounds/message1.mp3"));

// 处理客服消息
function parseComment(comment: any) {
  const {commentContent, commentTime, commentId, fromUserId, fromUserName} = comment;
  const { liveStreamId } = liveCurrent.value;
  if (commentTime > config.value.lastParseTime) {
    const RepyData = getRepyMessage(commentContent, Math.round(fromUserId));
    if (RepyData) {
      const { message , reServer } = RepyData;
      if (message) {
        repyMessage({liveStreamId: Math.round(liveStreamId), replyContent: `@${fromUserName} ${message}`, commentId: Math.round(commentId), fromUserId: Math.round(fromUserId)})
      } else {
        audio.play();
      }
      if (reServer) {
        console.log("转客服Todo")
      }
    }
    config.value.lastParseTime = commentTime;
  }
}

// 评论列表中的用户
const lastCommentUserList = ref([]);

// document.body.appendChild(audio);



window.addEventListener<"message">("message", function (e: MessageEvent) {
  const {type, data} = e.data;
  if (type === "commentList") {
    
    lastCommentUserList.value = data
    .reduce((pre: any[], cur: any) => {
      if (pre.findIndex(({fromUserId} : any) => fromUserId == cur.fromUserId) === -1) {
        pre.push(cur);
      }
      return pre;
    }, [])
    .map(({fromUserAvatar, fromUserId, fromUserName, commentContent}: any) => ({id: fromUserId, name: fromUserName, avatar: fromUserAvatar, lastComment: commentContent}));
    console.log(data);
    console.log("lastCommentUserList", lastCommentUserList.value);
    data.forEach((comment: any) => {
      parseComment(comment);
    })
  }
}, false )

export { repyRules, getRepyMessage, ignoreUsers, lastCommentUserList}
