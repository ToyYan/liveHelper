<script lang="ts" setup>
  import { useLocalStorage } from "@vueuse/core";
  import { ref, onMounted } from "vue";

  const jiangjieConfig = useLocalStorage("jiangjieConfig", {enable: false, item: ""});


  const itemList = ref<{ id: string; img: string | null | undefined; name: string | undefined; }[]>([]);
  onMounted(() => {
    itemList.value = Array.from(document.querySelectorAll(".sort-goods-container--h3xS0.goods-item--xkjBr"))
    .filter((node)=>!(/recording/.test(node.id)))
    .map((node) => {
      const match = node.id.match(/\d{14,}/);
      const id = match ? match[0] : "";
      const img = node.querySelector(".ant-image-img")?.getAttribute("src");
      const name = node.querySelector(".cardTitle--TINWn .text--FYgWO")?.innerHTML;
      return {id, img, name};
    });
  })
</script>
<template>
  <el-switch
    v-model="jiangjieConfig.enable"
    active-text="开启自动讲解"
    inactive-text="关闭自动讲解"
  />
  <div class="itemList">
    <el-row :gutter="10"> 
      <el-col
        v-for="({id, img, name}, index) in itemList"
        :key="index"
        :span="8"
      >
        <el-card :body-style="{ padding: '10px', cursor: 'pointer', backgroundColor: jiangjieConfig.item === id ? '#ccc' : '' }" @click="jiangjieConfig.item = id">
          <img
            :src="(img as string)"
            class="image"
          />
          <div class="name" style="padding: 5px">
            <span>{{ name }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
.itemList {
  width: 100%;
  margin: 20px 0;
}
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image {
  width: 100%;
  height: auto;
  display: block;
}
</style>