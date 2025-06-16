<template>
  <div class="container-fluid space-xxxs rounded-lg shadow-md font-sans">
    <!-- Dashboard Header -->
    <div
      class="d-flex justify-content-between align-items-center pt-space-sm pb-space-sm"
    >
      <h1 class="h4 m-0 text-dark">Student Dashboard</h1>
    </div>

    <!-- Search and Filter Row -->
    <div class="row mb-space-xxs align-items-center">
      <div class="col-6 col-md-4">
        <SearchComponent v-model="searchQuery" @search="handleSearch" />
      </div>
      <div class="col-6 col-md-2 ms-auto text-end">
        <FilterButton @filter-change="handleFilterChange" />
      </div>
    </div>

    <!-- Assignments Table -->
    <div class="table-responsive">
      <table class="table table-hover align-middle bg-white rounded-lg">
        <thead class="table-light">
          <tr>
            <th scope="col" style="width: 50px"></th>
            <th
              v-if="selectedColumns.includes('title')"
              scope="col"
              @click="sortBy('title')"
              style="cursor: pointer"
            >
              Assignment Title
              <span>
                <icon-bars-arrow-up
                  v-if="sortColumn === 'title' && sortDirection === 'asc'"
                  class="w-4 h-4"
                />
                <icon-bars-arrow-down
                  v-else-if="sortColumn === 'title' && sortDirection === 'desc'"
                  class="w-4 h-4"
                />
                <icon-arrows-up-down v-else class="w-4 h-4" />
              </span>
            </th>
            <th
              v-if="selectedColumns.includes('studentName')"
              scope="col"
              @click="sortBy('studentName')"
              style="cursor: pointer"
            >
              Student Name
              <span>
                <icon-bars-arrow-up
                  v-if="sortColumn === 'studentName' && sortDirection === 'asc'"
                  class="w-4 h-4"
                />
                <icon-bars-arrow-down
                  v-else-if="
                    sortColumn === 'studentName' && sortDirection === 'desc'
                  "
                  class="w-4 h-4"
                />
                <icon-arrows-up-down v-else class="w-4 h-4" />
              </span>
            </th>
            <th
              v-if="selectedColumns.includes('duration')"
              scope="col"
              @click="sortBy('duration')"
              style="cursor: pointer"
            >
              Duration
              <span>
                <icon-bars-arrow-up
                  v-if="sortColumn === 'duration' && sortDirection === 'asc'"
                  class="w-4 h-4"
                />
                <icon-bars-arrow-down
                  v-else-if="
                    sortColumn === 'duration' && sortDirection === 'desc'
                  "
                  class="w-4 h-4"
                />
                <icon-arrows-up-down v-else class="w-4 h-4" />
              </span>
            </th>
            <th
              v-if="selectedColumns.includes('artist')"
              scope="col"
              @click="sortBy('artist')"
              style="cursor: pointer"
            >
              Artist
              <span>
                <icon-bars-arrow-up
                  v-if="sortColumn === 'artist' && sortDirection === 'asc'"
                  class="w-4 h-4"
                />
                <icon-bars-arrow-down
                  v-else-if="
                    sortColumn === 'artist' && sortDirection === 'desc'
                  "
                  class="w-4 h-4"
                />
                <icon-arrows-up-down v-else class="w-4 h-4" />
              </span>
            </th>
            <th
              v-if="selectedColumns.includes('submittedAt')"
              scope="col"
              @click="sortBy('submittedAt')"
              style="cursor: pointer"
            >
              Submitted At
              <span>
                <icon-bars-arrow-up
                  v-if="sortColumn === 'submittedAt' && sortDirection === 'asc'"
                  class="w-4 h-4"
                />
                <icon-bars-arrow-down
                  v-else-if="
                    sortColumn === 'submittedAt' && sortDirection === 'desc'
                  "
                  class="w-4 h-4"
                />
                <icon-arrows-up-down v-else class="w-4 h-4" />
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template
            v-for="(assignment, index) in paginatedAssignments"
            :key="assignment.id"
          >
            <tr
              class="clickable-row"
              @click="toggleAccordion(index + (currentPage - 1) * pageSize)"
            >
              <td>
                <button class="btn btn-sm btn-light bg-transparent border-0">
                  <Icon
                    name="heroicons:chevron-right"
                    class="w-4 h-4"
                    :class="{
                      rotated:
                        openAccordion === index + (currentPage - 1) * pageSize,
                    }"
                  />
                </button>
              </td>
              <td v-if="selectedColumns.includes('title')">
                {{ assignment.title }}
              </td>
              <td
                v-if="selectedColumns.includes('studentName')"
                class="text-muted"
              >
                {{ assignment.studentName }}
              </td>
              <td v-if="selectedColumns.includes('duration')">
                {{ assignment.duration }}
              </td>
              <td v-if="selectedColumns.includes('artist')">
                {{ assignment.artist }}
              </td>
              <td v-if="selectedColumns.includes('submittedAt')">
                {{ assignment.submittedAt }}
              </td>
            </tr>
            <tr
              v-if="openAccordion === index + (currentPage - 1) * pageSize"
              class="accordion-details"
            >
              <td colspan="6">
                <div class="p-3">
                  <div class="row g-4">
                    <!-- Left Column -->
                    <div class="col-lg-6">
                      <!-- Information Card -->
                      <div class="card mb-space-xxs">
                        <div class="card-body">
                          <h5 class="card-title">Information</h5>
                          <p class="mb-space-xxs">
                            <strong class="px-space-xxxs">Name:</strong>
                            <span>{{ assignment.studentName }}</span>
                          </p>
                          <p class="mb-space-xxs">
                            <strong class="px-space-xxxs">Assign Title:</strong>
                            <span>{{ assignment.title }}</span>
                          </p>
                          <p class="mb-space-xxs">
                            <strong class="px-space-xxxs"
                              >Full Duration:</strong
                            >
                            <span>{{ assignment.duration }}</span>
                          </p>
                        </div>
                      </div>

                      <!-- Audio Submission Card -->
                      <div class="card mb-space-xxs">
                        <div class="card-body">
                          <h5 class="card-title">Audio Submission</h5>
                          <audio
                            controls
                            class="w-100"
                            :src="assignment.audioUrl"
                          >
                            Your browser does not support the audio element.
                          </audio>
                          <a
                            :href="assignment.audioUrl"
                            download
                            class="btn btn-link mt-space-xxs"
                          >
                            Download Audio
                          </a>
                        </div>
                      </div>

                      <!-- Instructor Feedback Card -->
                      <div class="card mb-space-xxs">
                        <div class="card-body">
                          <h5 class="card-title">Instructor Feedback</h5>
                          <p class="fst-italic">
                            {{ assignment.instructorFeedback }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- Right Column -->
                    <div class="col-lg-6">
                      <!-- Full Transcript Card -->
                      <div class="card mb-space-xxs">
                        <div class="card-body">
                          <h5 class="card-title">Full Transcript</h5>
                          <div style="max-height: 200px; overflow-y: auto">
                            <div
                              v-for="(text, time) in assignment.transcript"
                              :key="time"
                              class="d-flex"
                            >
                              <span class="px-space-xxxs">{{ time }}:</span>
                              <span>{{ text }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- AI Generated Feedback Card -->
                      <div class="card">
                        <div class="card-body">
                          <h5 class="card-title mb-3">AI Generated Feedback</h5>
                          <ul class="list-unstyled mb-0">
                            <li
                              v-for="(item, i) in assignment.aiFeedback"
                              :key="i"
                              class="mb-space-xxs d-flex align-items-start"
                            >
                              <span class="px-space-xxxs">&bull;</span>
                              <span>{{ item }}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="d-flex justify-content-end align-items-center pt-space-xxs pb-space-xxs"
    >
      <PaginationComponent
        :currentPage="currentPage"
        :perPage="pageSize"
        :totalRows="filteredAssignments.length"
        @page-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<script>
import assignmentsData from "~/data/assignments.json";

export default {
  data() {
    return {
      openAccordion: null,
      assignments: assignmentsData.assignments,
      filteredAssignments: assignmentsData.assignments,
      currentPage: 1,
      pageSize: 8,
      searchQuery: "",
      dateFilter: null,
      selectedColumns: [
        "title",
        "studentName",
        "duration",
        "artist",
        "submittedAt",
      ],
      sortColumn: null,
      sortDirection: "asc",
    };
  },
  computed: {
    paginatedAssignments() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredAssignments.slice(start, end);
    },
    pageStart() {
      return this.filteredAssignments.length === 0
        ? 0
        : (this.currentPage - 1) * this.pageSize + 1;
    },
    pageEnd() {
      return Math.min(
        this.currentPage * this.pageSize,
        this.filteredAssignments.length
      );
    },
    totalPages() {
      return Math.ceil(this.filteredAssignments.length / this.pageSize);
    },
  },
  methods: {
    handleSearch(query) {
      if (!query) {
        this.filteredAssignments = this.assignments;
      } else {
        const searchLower = query.toLowerCase();
        this.filteredAssignments = this.assignments.filter(
          (assignment) =>
            assignment.title.toLowerCase().includes(searchLower) ||
            assignment.studentName.toLowerCase().includes(searchLower)
        );
      }
      this.applyFilters();
      this.applySorting();
      this.currentPage = 1;
    },
    handleFilterChange(filters) {
      this.dateFilter = filters?.dateRange || null;
      this.selectedColumns = filters?.selectedColumns || [
        "title",
        "studentName",
        "duration",
        "artist",
        "submittedAt",
      ];
      this.applyFilters();
      this.applySorting();
      this.currentPage = 1;
    },
    applyFilters() {
      let filtered = [...this.assignments];

      // Apply search filter
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (assignment) =>
            assignment.title.toLowerCase().includes(searchLower) ||
            assignment.studentName.toLowerCase().includes(searchLower)
        );
      }

      // Apply date range filter
      if (this.dateFilter?.start && this.dateFilter?.end) {
        const startDate = new Date(this.dateFilter.start);
        const endDate = new Date(this.dateFilter.end);
        endDate.setHours(23, 59, 59, 999); // Set to end of day

        filtered = filtered.filter((assignment) => {
          const submittedDate = new Date(assignment.submittedAt);
          return submittedDate >= startDate && submittedDate <= endDate;
        });
      }

      this.filteredAssignments = filtered;
      this.applySorting();
    },
    sortBy(column) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortColumn = column;
        this.sortDirection = "asc";
      }
      this.applySorting();
    },
    applySorting() {
      const column = this.sortColumn;
      const direction = this.sortDirection;
      if (!column) return;
      this.filteredAssignments.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        if (column === "submittedAt") {
          valA = new Date(valA);
          valB = new Date(valB);
        } else {
          valA = valA ? valA.toString().toLowerCase() : "";
          valB = valB ? valB.toString().toLowerCase() : "";
        }
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    toggleAccordion(index) {
      if (this.openAccordion === index) {
        this.openAccordion = null;
      } else {
        this.openAccordion = index;
      }
    },
  },
};
</script>

<script setup>
import IconArrowsUpDown from "~icons/heroicons/arrows-up-down";
import IconBarsArrowUp from "~icons/heroicons/bars-arrow-up";
import IconBarsArrowDown from "~icons/heroicons/bars-arrow-down";
</script>

<style scoped>
/* Scoped styles for the component */
.container-fluid {
  font-family: "Inter", sans-serif; /* A nice, clean font */
}

.clickable-row {
  cursor: pointer;
}

.rotated {
  transform: rotate(90deg);
  transition: transform 0.2s ease-in-out;
}

.bi-chevron-right {
  transition: transform 0.2s ease-in-out;
}

.table {
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
}

table > :not(caption) > * > * {
  box-shadow: none !important;
}

.card {
  border: 1px solid #e9ecef;
}
</style>
