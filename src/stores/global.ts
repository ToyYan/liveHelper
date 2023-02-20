import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", {
  state: () => {
    return {
      liveStreamId: 0,
      centerConsoleInfo: null,
    }
  },
  actions: {
    setLiveStreamId (id: number) {
      this.liveStreamId = id;
    },
    setCenterConsoleInfo (info: any) {
      this.liveStreamId = info;
    }
  }
})
