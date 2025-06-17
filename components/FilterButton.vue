<template>
  <div>
    <button @click="showModal = true" class="btn btn-outline-primary">
      Filters
    </button>
    <RdsModal v-bind="modalProps" :visible="showModal" @hidden="hideModal">
      <div class="p-space-xs">
        <div class="mb-space-xs">
          <label class="form-label fw-semibold">Date Range</label>
          <div class="d-flex align-items-center">
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
        <div class="row">
          <div class="col-6 mb-space-xs">
            <label class="form-label fw-semibold">Assignments</label>
            <MultiSelectFilter
              :assignments="uniqueAssignments"
              v-model="selectedAssignmentTitles"
              placeholder="Search assignments..."
            />
          </div>
          <div class="col-6 mb-space-xs">
            <label class="form-label fw-semibold">Students</label>
            <MultiSelectFilter
              :assignments="studentList"
              v-model="selectedStudentIds"
              placeholder="Search students..."
            />
          </div>
        </div>
        <div class="mb-space-xs">
          <label class="form-label fw-semibold">Show Columns</label>
          <div class="d-flex flex-wrap">
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
        <div class="d-flex justify-content-end pt-space-xs">
          <button class="btn btn-dark-3 m-space-xxs" @click="clearFilters">
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
import MultiSelectFilter from "./MultiSelectFilter.vue";

export default {
  name: "FilterButton",
  components: {
    RdsModal,
    MultiSelectFilter,
  },
  props: {
    assignments: {
      type: Array,
      required: true,
    },
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
      selectedAssignmentTitles: [],
      selectedStudentIds: [],
      modalProps: {
        title: "Filters",
        titleVariant: "dark-3",
        headerText: "",
        size: "xl",
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
  computed: {
    uniqueAssignments() {
      // Unique by title
      const seen = new Set();
      return this.assignments
        .filter((a) => {
          if (seen.has(a.title)) return false;
          seen.add(a.title);
          return true;
        })
        .map((a) => ({
          id: a.title, // use title as id for unique selection
          title: a.title,
          studentName: a.title, // not used, but required by filter component
        }));
    },
    studentList() {
      // If no assignment selected, show all students (unique by name)
      if (!this.selectedAssignmentTitles.length) {
        const seen = new Set();
        return this.assignments
          .filter((a) => {
            if (seen.has(a.studentName)) return false;
            seen.add(a.studentName);
            return true;
          })
          .map((a) => ({
            id: a.studentName,
            title: a.studentName,
            studentName: a.studentName,
          }));
      }
      // Show all students who submitted the selected assignment(s)
      const students = this.assignments.filter((a) =>
        this.selectedAssignmentTitles.includes(a.title)
      );
      const seen = new Set();
      return students
        .filter((a) => {
          if (seen.has(a.studentName)) return false;
          seen.add(a.studentName);
          return true;
        })
        .map((a) => ({
          id: a.studentName,
          title: a.studentName,
          studentName: a.studentName,
        }));
    },
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
      this.selectedAssignmentTitles = [];
      this.selectedStudentIds = [];
      this.$emit("filter-change", null);
      this.showModal = false;
    },
    applyFilters() {
      this.$emit("filter-change", {
        dateRange: this.dateRange,
        selectedColumns: this.selectedColumns,
        selectedAssignmentTitles: this.selectedAssignmentTitles,
        selectedStudentIds: this.selectedStudentIds,
      });
      this.showModal = false;
    },
  },
};
</script>
