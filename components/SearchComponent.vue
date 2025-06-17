<template>
  <div class="search-container">
    <div class="input-group shadow-sm">
      <span class="input-group-text bg-white">
        <icon-magnifying-glass class="w-4 h-4" />
      </span>
      <input
        type="text"
        class="form-control"
        v-model="searchQuery"
        :placeholder="placeholder"
        @input="handleSearch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import IconMagnifyingGlass from "~icons/heroicons/magnifying-glass";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search", value: string): void;
}>();

const searchQuery = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue;
  }
);

const handleSearch = () => {
  emit("update:modelValue", searchQuery.value);
  emit("search", searchQuery.value);
};

defineExpose({
  searchQuery,
});
</script>

<style scoped>
.search-container {
  width: 100%;
}

.input-group {
  overflow: hidden;
}

.input-group-text {
  padding: 0.5rem 1rem;
}

.form-control {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-color: #dee2e6;
}

.form-control:focus {
  box-shadow: none;
  border-color: #dee2e6;
}

.form-control::placeholder {
  color: #adb5bd;
  font-size: 0.875rem;
}
</style>
