<script setup lang="ts">
defineOptions({
  name: "Contract"
});

import { ref } from "vue";
import { useUserStoreHook as user } from "@/store/modules/user";
import { nowDate, fmtTimestamp } from "@/utils/formatter";
import { type OrderItemData } from "@/api/utils";
console.log(nowDate());

const labelWidth = ref(80);
const readOnlyField = ref(false);

const item = ref<OrderItemData>({} as OrderItemData);

const item_array = ref<OrderItemData[]>([]);

const form = ref({
  username: user().username,
  region: user().region,
  in_date: nowDate(),
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});
</script>

<template>
  <div class="container">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-form>
        <el-row :gutter="20">
          <el-col :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
            <el-divider content-position="right"
              >客户
              <el-button text type="primary"> 保存 </el-button></el-divider
            >
            <el-form-item label="客户" :label-width="labelWidth">
              <el-input v-model="form.in_date" :readonly="readOnlyField" />
            </el-form-item>

            <el-form-item label="地区" :label-width="labelWidth">
              <el-input v-model="form.region" :readonly="readOnlyField" />
            </el-form-item>
            <el-form-item label="类型" :label-width="labelWidth">
              <el-select placeholder="请选择">
                <el-option label="代理" value="1" />
                <el-option label="用户" value="2" />
              </el-select>
            </el-form-item>
            <el-divider content-position="right"
              >客户联系人<el-button text type="primary">
                保存
              </el-button></el-divider
            >
            <el-form-item label="姓名" :label-width="labelWidth">
              <el-input v-model="form.in_date" :readonly="!readOnlyField" />
            </el-form-item>
            <el-form-item label="电话" :label-width="labelWidth">
              <el-input v-model="form.region" :readonly="!readOnlyField" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="labelWidth">
              <el-input v-model="form.region" :readonly="!readOnlyField" />
            </el-form-item>

            <el-divider content-position="right">
              产品<el-button text type="primary"> 添加 </el-button>
            </el-divider>

            <el-divider content-position="right">条款</el-divider>
          </el-col>

          <el-col :xl="16" :lg="16" :md="16" :sm="24" :xs="24">
            <el-descriptions title="业务信息">
              <el-descriptions-item label="员工" class-name="my-info">{{
                form.username
              }}</el-descriptions-item>
              <el-descriptions-item label="地区" class-name="my-info">{{
                form.region
              }}</el-descriptions-item>
              <el-descriptions-item label="日期" class-name="my-info">
                {{ form.in_date }}</el-descriptions-item
              >
            </el-descriptions>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 10px;
}
:deep(.my-info) {
  background: var(--el-color-success-light-9) !important;
  font-weight: bold;
}
</style>
