<script setup lang="ts">
defineOptions({
  name: "Business"
});
import { ref, onMounted } from "vue";
import { AppRequest } from "@/api/record";
import { bussOptions } from "@/utils/options";
import { Plus, Search } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import inficon from "@/assets/inficon.png";
import { getIcons } from "@/utils/helper";

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
  });
});

const tableRowClass = () => {
  return "success-row";
};
const btnClick = (data: any, action: string) => {
  console.log(action);
  if (action == "del") {
    // router.push({ name: "Contract", query: { id: data.id } });
    return;
  }

  let params = { id: 0 };
  if (data == undefined) {
    return;
  }
  params.id = data.id as number;

  if (action == "print") {
    const routeData = router.resolve({
      path: "/orderpdf",
      query: params
    });
    window.open(routeData.href, "_blank");
  } else {
    router.push({
      path: `/business/contract`,
      query: params
    });
  }
};

// 新建
const addRecord = () => {
  router.push({ name: "Contract" });
};

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
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <template #empty>
        <img :src="inficon" />
      </template>
      <el-table-column type="expand">
        <template #default="props">
          <el-table
            :data="props.row.order_items"
            :row-class-name="tableRowClass"
          >
            <el-table-column label="货号" prop="product.pn" />
            <el-table-column label="描述" prop="product.descp" />
            <el-table-column label="数量" prop="quantity" />
            <el-table-column label="折扣" prop="discount" />
            <el-table-column label="金额" prop="amount" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableInfo"
        :key="item.field"
        :prop="item.field"
        :label="item.label"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fix"
        :width="item.width"
        :sortable="item.sort"
        :align="item.align"
      >
        <template #default="props">
          <div v-if="item.op">
            <el-dropdown class="setup-style" trigger="click">
              <span class="el-dropdown-link">
                <el-button link type="primary">更多</el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(act, index) in item.actions"
                    :key="index"
                    :icon="getIcons(act.icon)"
                    @click="btnClick(props.row, act.action)"
                  >
                    {{ act.text }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
