<script lang="ts" setup>
import { ref } from 'vue';
import Jiangjie from './jiangjie.vue';
import Comment from "./comment.vue";
import autoRepy from './autoRepy.vue';

const showConfig = ref(false);
const activeName = ref("1");
</script>
<template>
  <div class="configHandle" @click="() => showConfig = !showConfig">🤖</div>
  <el-drawer
    v-model="showConfig"
    title="配置"
    direction="rtl"
    class="config"
    size="50%"
  >
  <el-tabs v-model="activeName">
    <el-tab-pane label="自动讲解" name="1">
      <Jiangjie></Jiangjie>
    </el-tab-pane>
    <el-tab-pane label="自动弹幕" name="2">
      <Comment></Comment>
    </el-tab-pane>
    <el-tab-pane label="自动回复" name="3">
      <autoRepy></autoRepy>
    </el-tab-pane>
    <el-tab-pane label="语音提醒" name="4">语音提醒</el-tab-pane>
    <el-tab-pane label="其他配置" name="5">其他配置</el-tab-pane>
  </el-tabs>
  </el-drawer>
</template>
<style lang="scss" scoped>
.configHandle {
  font-size: 28px;
  position: absolute;
  right: 320px;
  top: 10px;
  cursor: pointer;
  z-index: 1000;
  user-select: none;
}
</style>
<style lang="scss">
.config {
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>