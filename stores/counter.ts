import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    name: "Table",
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    getStoreName: (state) => state.name,
  },

  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    reset() {
      this.count = 0;
    },
  },
});
