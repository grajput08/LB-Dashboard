<template>
  <div>
    <button @click="showModal = true" class="btn btn-outline-primary">
      Filters
    </button>
    <RdsModal v-bind="modalProps" :visible="showModal" @hidden="hideModal">
      <div class="p-space-xs">
        <div class="mb-space-xs">
          <label class="form-label fw-semibold">Date Range</label>
          <div class="d-flex gap-2 align-items-center">
            <input
              type="date"
              class="form-control"
              v-model="dateRange.start"
              :max="dateRange.end"
            />
            <span class="mx-space-xxs">to</span>
            <input
              type="date"
              class="form-control"
              v-model="dateRange.end"
              :min="dateRange.start"
            />
          </div>
        </div>
        <div class="mb-space-xs">
          <label class="form-label fw-semibold">Show Columns</label>
          <div class="d-flex flex-wrap gap-2">
            <div
              v-for="col in columns"
              :key="col.key"
              class="form-check mx-space-xxs"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="'col-' + col.key"
                v-model="selectedColumns"
                :value="col.key"
              />
              <label class="form-check-label" :for="'col-' + col.key">
                {{ col.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="d-flex justify-content-end gap-2 pt-space-xs">
          <button class="btn btn-secondary m-space-xxs" @click="clearFilters">
            Clear
          </button>
          <button class="btn btn-primary m-space-xxs" @click="applyFilters">
            Apply
          </button>
        </div>
      </template>
    </RdsModal>
  </div>
</template>

<script>
import { RdsModal } from "@rds-vue-ui/rds-modal";

export default {
  name: "FilterButton",
  components: {
    RdsModal,
  },
  data() {
    return {
      showModal: false,
      dateRange: {
        start: "",
        end: "",
      },
      columns: [
        { key: "title", label: "Assignment Title" },
        { key: "studentName", label: "Student Name" },
        { key: "duration", label: "Duration" },
        { key: "artist", label: "Artist" },
        { key: "submittedAt", label: "Submitted At" },
      ],
      selectedColumns: [
        "title",
        "studentName",
        "duration",
        "artist",
        "submittedAt",
      ],
      modalProps: {
        title: "Filters",
        titleVariant: "dark-3",
        headerText: "",
        size: "md",
        centered: true,
        bgVariant: "white",
        overlayColor: "var(--rds-dark-3, #909090)",
        overlayOpacity: 0.7,
        exteriorCloseBtn: false,
        useCustomClose: false,
        borderRadius: 1,
        teleport: true,
        teleportLocation: "body",
        expandHeight: false,
        removePadding: false,
      },
    };
  },
  methods: {
    hideModal() {
      this.showModal = false;
    },
    clearFilters() {
      this.dateRange = {
        start: "",
        end: "",
      };
      this.selectedColumns = this.columns.map((col) => col.key);
      this.$emit("filter-change", null);
      this.showModal = false;
    },
    applyFilters() {
      this.$emit("filter-change", {
        dateRange: this.dateRange,
        selectedColumns: this.selectedColumns,
      });
      this.showModal = false;
    },
  },
};
</script>
