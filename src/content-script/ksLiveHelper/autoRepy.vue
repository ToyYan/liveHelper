<script lang="ts" setup>
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { repyRules, getRepyMessage, ignoreUsers, lastCommentUserList, MatchType } from './autoRepy';
import { reactive, ref } from 'vue';
const ruleTypeMap = {
  start: "开头为",
  end: "结尾为",
  include: "包含",
  equal: "等于"
}

function deleteRule(ruleIndex: number) {
  repyRules.splice(ruleIndex, 1)
}
function deleteChildRule(ruleIndex: number, childIndex: number) {
  repyRules[ruleIndex].rules.splice(childIndex, 1);
}
function changeAllMatch(ruleIndex: number, match: boolean) {
  repyRules[ruleIndex].allMatch = match;
}
function changeReServer(ruleIndex: number, match: boolean) {
  repyRules[ruleIndex].reServer = match;
}

function addRule() {
  repyRules.unshift({
    message: "",
    allMatch: false,
    reServer: false,
    rules: []
  })
}

const showAddChildRule = ref(false);
const addChileRuleIndex = ref(0)
const addChildRuleForm = reactive<{content: string, type: MatchType}>({
  content: "",
  type: "include"
})

function addChileRule() {
  repyRules[addChileRuleIndex.value].rules.unshift({
    type: addChildRuleForm.type,
    content: addChildRuleForm.content,
  })
  showAddChildRule.value = false;
}

const tab = ref("规则配置");
</script>
<template>
  <el-radio-group v-model="tab" size="small">
    <el-radio-button label="规则配置" />
    <el-radio-button label="用户配置" />
  </el-radio-group>
  <div class="autoRepy" v-show="tab === '规则配置'">
    <div class="repyRules">
      <div>
        <el-button type="primary" @click="addRule">添加规则</el-button>
      </div>
      <div class="rule" v-for="({allMatch, reServer, rules}, index) in repyRules" :key="index">
        <el-descriptions :column="2" :border="true">
          <el-descriptions-item label="规则列表" :span="2">
            <div>
              <el-tag class="tag" :round="true" :closable="true" size="small" v-for="({type, content}, i) in rules" :key="i" @close="deleteChildRule(index, i)">{{ ruleTypeMap[type] }}：{{ content }}</el-tag>
            </div>
            <div :style="{paddingTop: '10px'}">
              <el-button type="default" size="small" :icon="Plus" circle @click="() => {showAddChildRule = true; addChileRuleIndex = index}"  />
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="内容" :span="2">
            <el-input type="textarea" v-model="repyRules[index].message" :rows="1" />  
          </el-descriptions-item>
          <el-descriptions-item label="完全匹配">
            <el-switch :value="allMatch" @click="changeAllMatch(index, !allMatch)" />
          </el-descriptions-item>
          <el-descriptions-item label="转客服">
            <el-switch :value="reServer" @click="changeReServer(index, !reServer)" />
          </el-descriptions-item>
          <el-descriptions-item label="操作">
            <el-popconfirm title="确定要删除这条规则吗?" confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger" @confirm="deleteRule(index)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle  />  
              </template>
            </el-popconfirm>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-dialog v-model="showAddChildRule" title="添加适配规则" :width="100">
        <el-form :model="addChildRuleForm">
          <el-form-item label="内容" >
            <el-input
              v-model="addChildRuleForm.content"
              placeholder="规则内容"
              size="small"
              :style="{width: '300px'}"
            >
              <template #prepend>
                <el-select v-model="addChildRuleForm.type" placeholder="匹配方式" style="width: 115px">
                  <el-option label="开头为" value="start" />
                  <el-option label="结尾为" value="end" />
                  <el-option label="包含" value="include" />
                  <el-option label="等于" value="equal" />
                </el-select>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddChildRule = false">取消</el-button>
            <el-button type="primary" @click="addChileRule">
              添加
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="ignoreUsers"  v-show="tab === '用户配置'">
      <div v-for="{ id, name, avatar } in ignoreUsers" :key="id">{{ name }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.autoRepy {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  > div {
    height: 50%;
  }
  .repyRules {
    .rule {
      margin-bottom: 10px;
      .tag {
        margin-right: 10px;
      }
    }
  }
}
</style>
<style lang="scss">
.autoRepy {
  .el-button.is-circle {
    border-radius: 50%;
    padding: 8px;
  }
  .el-button--small {
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
  }
  .el-button--small.is-circle {
    padding: 5px;
  }
  .el-input--small .el-input__wrapper {
    padding: 0 0 ;
  }
}
</style>