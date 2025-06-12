<template>
  <div class="container-fluid">
    <div class="row mb-3">
      <div class="col-md-4">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            v-model="search"
            placeholder="Search..."
          />
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th></th>
            <th>#</th>
            <th>Date</th>
            <th>Status</th>
            <th>Email</th>
            <th class="text-end">Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td>
              <button
                class="btn btn-sm btn-link"
                @click="row.expanded = !row.expanded"
              >
                <i
                  class="bi"
                  :class="row.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"
                ></i>
              </button>
            </td>
            <td>#{{ row.id }}</td>
            <td>{{ formatDate(row.date) }}</td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-success': row.status === 'paid',
                  'bg-danger': row.status === 'failed',
                  'bg-warning': row.status === 'refunded',
                }"
              >
                {{ row.status }}
              </span>
            </td>
            <td>{{ row.email }}</td>
            <td class="text-end">€{{ row.amount.toFixed(2) }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="handleView(row)"
              >
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="d-flex align-items-center">
        <select
          class="form-select form-select-sm me-2"
          v-model="pageSize"
          style="width: auto"
        >
          <option :value="5">5 per page</option>
          <option :value="10">10 per page</option>
          <option :value="20">20 per page</option>
          <option :value="50">50 per page</option>
        </select>
        <span class="text-muted">
          Showing {{ startIndex + 1 }}-{{ endIndex }} of
          {{ filteredData.length }} entries
        </span>
      </div>
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a class="page-link" href="#" @click.prevent="page--">Previous</a>
          </li>
          <li
            v-for="pageNum in pageCount"
            :key="pageNum"
            class="page-item"
            :class="{ active: page === pageNum }"
          >
            <a class="page-link" href="#" @click.prevent="page = pageNum">
              {{ pageNum }}
            </a>
          </li>
          <li class="page-item" :class="{ disabled: page === pageCount }">
            <a class="page-link" href="#" @click.prevent="page++">Next</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TableRow {
  id: string;
  date: string;
  status: "paid" | "failed" | "refunded";
  email: string;
  amount: number;
  expanded?: boolean;
}

const loading = ref(false);
const search = ref("");
const page = ref(1);
const pageSize = ref(10);

const data = ref<TableRow[]>([
  {
    id: "4600",
    date: "2024-03-11T15:30:00",
    status: "paid",
    email: "john@example.com",
    amount: 594,
  },
  {
    id: "4599",
    date: "2024-03-11T10:10:00",
    status: "failed",
    email: "sarah@example.com",
    amount: 276,
  },
  {
    id: "4598",
    date: "2024-03-11T08:50:00",
    status: "refunded",
    email: "mike@example.com",
    amount: 315,
  },
  {
    id: "4597",
    date: "2024-03-10T19:45:00",
    status: "paid",
    email: "lisa@example.com",
    amount: 529,
  },
  {
    id: "4596",
    date: "2024-03-10T15:55:00",
    status: "paid",
    email: "david@example.com",
    amount: 639,
  },
]);

const filteredData = computed(() => {
  let result = [...data.value];

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    result = result.filter(
      (row) =>
        row.id.toLowerCase().includes(searchLower) ||
        row.email.toLowerCase().includes(searchLower) ||
        row.status.toLowerCase().includes(searchLower)
    );
  }

  return result;
});

const pageCount = computed(() =>
  Math.ceil(filteredData.value.length / pageSize.value)
);

const startIndex = computed(() => (page.value - 1) * pageSize.value);
const endIndex = computed(() =>
  Math.min(startIndex.value + pageSize.value, filteredData.value.length)
);

const paginatedData = computed(() => {
  return filteredData.value.slice(startIndex.value, endIndex.value);
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleView = (row: TableRow) => {
  console.log("View row:", row);
};
</script>

<style scoped>
.table th {
  font-weight: 600;
  background-color: #f8f9fa;
}

.badge {
  text-transform: capitalize;
}

.page-link {
  cursor: pointer;
}
</style>
