<script lang="ts" setup>
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { config } from "./comment";
import { useNow } from "@vueuse/core";

const messagesStr = ref("");
onMounted(() => {
  messagesStr.value = config.messages.join("\n");
})
function changeMessage() {
  config.messages = messagesStr.value.split("\n").map((msg)=>msg.trim()).filter((msg)=>msg);
}

const messageRows = computed(() => {
  return messagesStr.value.split("\n").length
})

const {now, pause, resume} = useNow({controls: true});
const leftSendTime = computed(() => {
  const nextSend = config.sendGap * 6e4 - (now.value.getTime() - config.lastSendTime);
  return `${Math.floor(nextSend/6e4)}分${Math.floor((nextSend/1e3)%60)}秒`
})

const disabled = computed(() => {
  const r = !config.enable;
  r ? pause() : resume();
  return r;
})

</script>
<template>
  <div class="comment">
    <el-form label-width="40%" label-position="left">
      <el-form-item label="启动自动发布评论">
        <el-switch
        v-model="config.enable"
      />
      </el-form-item>
      <el-form-item label="间隔时间(分钟)">
        <el-input-number v-model="config.sendGap" :min="1" :max="999" size="small" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="下一次发送消息行数">
        <el-input-number v-model="config.currentIndex" :min="1" :max="messageRows" size="small" :disabled="disabled" />
      </el-form-item>
      <el-form-item :label="`距离下次发送还有${leftSendTime}`"><el-button type="primary"  :disabled="disabled" @click="()=> config.lastSendTime = 0">立即发送</el-button>
      </el-form-item>
    </el-form>
    <el-form label-position="top">
      <el-form-item label="消息列表(每行一个)">
        <el-input v-model="messagesStr" @blur="changeMessage" :rows="messageRows + 5" type="textarea" />
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss">
.comment {
  // .el-input-number .el-input__inner {
  //   padding-left: 0;
  //   padding-right: 0;
  // }
  .editor {
    width: 98%;
    margin: 0 10px;
    padding: 10px;
    font-size: 14px;
    line-height: 18px;
    border: 1px solid #ccc;
    border-radius: 10px;
    outline: 0 solid transparent;
    &:focus {
      box-shadow: 0 0 3px #000;
    }
  }
}
</style>