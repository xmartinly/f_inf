<script setup lang="ts">
import { Check, Plus, Edit, Search, Star } from "@element-plus/icons-vue";

import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import inficon from "@/assets/inficon.png";

const search_type = ref("prod");

const keyword = ref("");

const type_options = [
  {
    value: "prod",
    label: "Product"
  },
  {
    value: "cust",
    label: "Customer"
  },
  {
    value: "cont",
    label: "Contact"
  }
];

const table_data = [
  {
    date: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-02",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-04",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  },
  {
    date: "2016-05-01",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles"
  }
];
</script>

<template>
  <el-card shadow="always">
    <template v-slot:header>
      <div>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input
              v-model="keyword"
              style="width: 240px"
              placeholder="Keyword"
            />
          </el-form-item>

          <el-form-item>
            <el-button :icon="Search" circle type="primary" />
            <el-button :icon="Plus" circle type="success" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <el-table :data="table_data" style="width: 100%">
      <template #empty>
        <img :src="inficon" alt="" srcset="" />
      </template>
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </el-card>
</template>

<style lang="scss" scoped></style>
