<template>
  <div class="assignment-multiselect-filter card p-space-sm">
    <div class="mb-space-xs">
      <SearchComponent
        v-model="search"
        :placeholder="`Search assignments...`"
      />
    </div>
    <div class="mb-space-xs d-flex">
      <button class="btn btn-sm btn-primary" @click="selectAll">
        Select All
      </button>
      <button class="btn btn-sm btn-dark-3 ms-space-xxs" @click="clearAll">
        Clear
      </button>
    </div>
    <div class="checkbox-list">
      <div
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        class="form-check mb-space-xxxs"
      >
        <input
          class="form-check-input"
          type="checkbox"
          :id="'assignment-' + assignment.id"
          :value="assignment.id"
          :checked="modelValue.includes(assignment.id)"
          @change="toggleAssignment(assignment.id)"
        />
        <label class="form-check-label" :for="'assignment-' + assignment.id">
          {{ assignment.title }}
        </label>
      </div>
      <div
        v-if="filteredAssignments.length === 0"
        class="text-muted small py-space-xxs text-center"
      >
        No assignments found.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import SearchComponent from "./SearchComponent.vue";

const props = defineProps({
  assignments: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Search assignments...",
  },
});

const emit = defineEmits(["update:modelValue"]);

const search = ref("");

const filteredAssignments = computed(() => {
  if (!search.value) return props.assignments;
  const s = search.value.toLowerCase();
  return props.assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(s) ||
      a.studentName.toLowerCase().includes(s)
  );
});

function toggleAssignment(id) {
  const selected = [...props.modelValue];
  const idx = selected.indexOf(id);
  if (idx === -1) {
    selected.push(id);
  } else {
    selected.splice(idx, 1);
  }
  emit("update:modelValue", selected);
}

function selectAll() {
  const allIds = filteredAssignments.value.map((a) => a.id);
  const unique = Array.from(new Set([...props.modelValue, ...allIds]));
  emit("update:modelValue", unique);
}

function clearAll() {
  const filteredIds = filteredAssignments.value.map((a) => a.id);
  const remaining = props.modelValue.filter((id) => !filteredIds.includes(id));
  emit("update:modelValue", remaining);
}
</script>

<style scoped>
.assignment-multiselect-filter {
  min-width: 250px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.checkbox-list {
  border: 1px solid #e9ecef;
  border-radius: 4px;
  background: #fafbfc;
  padding: 0.5rem;
  max-height: 220px;
  overflow-y: auto;
}
.ms-2 {
  margin-left: 0.5rem;
}
</style>
