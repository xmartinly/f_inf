<script setup lang="ts">
defineOptions({
  name: "Business"
});
import { ref, onMounted } from "vue";
import { AppRequest } from "@/api/record";
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

onMounted(() => {
  const _request = new AppRequest("order");
  const _key = keyword.value == "" ? keyword.value : "0";
  _request.appRequest("index", {}, "").then(({ data }) => {
    tableData.value = data.tableData;
    tableInfo.value = data.props;
    console.log(data);
  });
});

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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.order_items" :border="true">
            <el-table-column label="货号" prop="product.pn" />
            <el-table-column label="描述" prop="product.descp" />
            <el-table-column label="数量" prop="quantity" />
            <el-table-column label="折扣" prop="discount" />
            <el-table-column label="金额" prop="amount" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customer.name_chs" />
      <el-table-column label="联系人" prop="contact.name" />
      <el-table-column label="用户" prop="end_user" />
      <el-table-column label="地区" prop="end_user_region" />
      <el-table-column label="总金额" prop="total_amount" />
      <el-table-column label="状态" prop="status" />
    </el-table>
  </el-card>
</template>
