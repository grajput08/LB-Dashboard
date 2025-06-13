<template>
  <div class="container-fluid space-xxxs rounded-lg shadow-md font-sans">
    <!-- Dashboard Header -->
    <div
      class="d-flex justify-content-between align-items-center pt-space-sm pb-space-sm"
    >
      <h1 class="h4 m-0 text-dark">Student Dashboard</h1>
    </div>
    <div class="col-4 mb-space-xxs">
      <SearchComponent v-model="searchQuery" @search="handleSearch" />
    </div>

    <!-- Assignments Table -->
    <div class="table-responsive">
      <table class="table table-hover align-middle bg-white rounded-lg">
        <thead class="table-light">
          <tr>
            <th scope="col" style="width: 50px"></th>
            <th scope="col">Assignment Title</th>
            <th scope="col">Student Name</th>
            <th scope="col">Duration</th>
            <th scope="col">Artist</th>
            <th scope="col">Submitted At</th>
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
              <td>{{ assignment.title }}</td>
              <td class="text-muted">{{ assignment.studentName }}</td>
              <td>{{ assignment.duration }}</td>
              <td>{{ assignment.artist }}</td>
              <td>{{ assignment.submittedAt }}</td>
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
      this.currentPage = 1; // Reset to first page when searching
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
