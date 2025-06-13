<template>
  <rds-pagination
    :value="currentPage"
    :perPage="perPage"
    :totalRows="totalRows"
    @input="onPageChange"
    v-bind="{
      align: 'left',
      ariaControls: '',
      ariaLabel: 'Pagination',
      disabled: false,
      ellipsisClass: '',
      ellipsisText: '...',
      firstClass: '',
      firstNumber: false,
      firstText: '«',
      hideEllipsis: false,
      hideGotoEndButtons: false,
      labelFirstPage: 'Go to first page',
      labelLastPage: 'Go to last page',
      labelNextPage: 'Go to next page',
      labelPage: 'Go to page',
      labelPrevPage: 'Go to previous page',
      lastClass: '',
      lastNumber: false,
      lastText: '»',
      limit: 5,
      nextClass: '',
      nextText: '›',
      pageClass: '',
      pills: false,
      prevClass: '',
      prevText: '‹',
      size: 'md',
    }"
  />
</template>

<script>
import { RdsPagination } from "@rds-vue-ui/rds-pagination";
export default {
  name: "PaginationComponent",
  components: {
    RdsPagination,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    totalRows: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onPageChange(newPage) {
      this.$emit("page-change", newPage);
    },
  },
};
</script>
