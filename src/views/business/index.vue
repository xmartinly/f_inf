<script setup lang="ts">
defineOptions({
  name: "Business"
});
import { ref } from "vue";
import { bussOptions } from "@/utils/options";
import { LogTable } from "@/components/LogTable";
import { Plus, Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const keyword = ref("");
const search_type = ref(-1);
const tableData = ref([]);
const tableInfo = ref([]);
const loading = ref(false);
const router = useRouter();

// 查看
const viewRecrod = (record: any) => {};
// 编辑
const editRecord = (record: any) => {};
// 新建
const addRecord = () => {
  router.push({ name: "Contract" });
};
const delRecord = () => {};
const search = () => {};
</script>

<template>
  <el-card shadow="always">
    <template v-slot:header>
      <div>
        <el-form :inline="true" @keyup.enter="search">
          <el-form-item>
            <el-select
              v-model="search_type"
              style="width: 140px"
              placeholder="Search Type"
            >
              <el-option
                v-for="item in bussOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input
              v-model="keyword"
              style="width: 240px"
              placeholder="Keyword"
            />
          </el-form-item>

          <el-form-item>
            <el-button :icon="Search" circle type="primary" @click="search" />
            <el-button :icon="Plus" circle type="success" @click="addRecord" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <LogTable
      v-model:tableData="tableData"
      v-model:loading="loading"
      v-model:propAndLabel="tableInfo"
      :isActiveData="true"
      @edit="editRecord"
      @del="delRecord"
      @view="viewRecrod"
    />
  </el-card>
</template>
