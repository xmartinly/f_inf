<script setup lang="ts">
defineOptions({
  name: "Contract"
});

import { ref, onMounted } from "vue";
import { useUserStoreHook as user } from "@/store/modules/user";
import {
  nowDate,
  fmtTimestamp,
  fmtContractTerms as terms
} from "@/utils/formatter";
import { type OrderItemData } from "@/api/utils";

const labelWidth = ref(80);
const readOnlyField = ref(false);

onMounted(() => {
  if (item_array.value.length == 0) {
    addItem();
  }
});

const item = ref<OrderItemData>({
  id: 0,
  order_id: 0,
  contact_id: 0,
  customer_id: 0,
  pn: "",
  description: "",
  quantity: 1,
  disscount: 1,
  price_rounded: 0,
  list_price: 0,
  amount: 0
});

const item_array = ref<OrderItemData[]>([]);

const form = ref({
  username: user().username,
  region: user().region,
  in_date: nowDate(),
  items: item_array,

  cust_name: "",
  cust_sap: "",
  cust_file_no: "",
  cust_locate: "",
  end_user: "",

  cont_name: "",
  cont_address: "",
  cont_phone: "",
  cont_email: "",

  origin_term: "",
  leadtime_term: "",
  shipment_term: "",
  payment_term: "",
  warrany_term: "",
  claims_term: "",
  other_term: "",
  enduser_declaration: "",
  misc_term: "",
  status: 0
});

const calcAmount = () => {
  item_array.value.forEach(item => {
    item.amount = item.quantity * item.list_price;
  });
};

const addItem = () => {
  item_array.value.push({ ...item.value });
};
</script>

<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-form>
        <el-row :gutter="30">
          <el-col :xl="10" :lg="10" :md="10" :sm="24" :xs="24">
            <el-divider content-position="right"
              >客户&nbsp;
              <el-button text type="primary"> 保存 </el-button></el-divider
            >
            <el-form-item label="客户" :label-width="labelWidth">
              <el-input v-model="form.cust_name" :readonly="readOnlyField" />
            </el-form-item>

            <el-form-item label="地区" :label-width="labelWidth">
              <el-input v-model="form.cust_locate" :readonly="readOnlyField" />
            </el-form-item>

            <el-form-item label="类型" :label-width="labelWidth">
              <el-select placeholder="请选择">
                <el-option label="代理" value="1" />
                <el-option label="用户" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="最终用户" :label-width="labelWidth">
              <el-input v-model="form.end_user" :readonly="readOnlyField" />
            </el-form-item>
            <el-divider content-position="right"
              >客户联系人&nbsp;<el-button text type="primary">
                保存
              </el-button></el-divider
            >
            <el-form-item label="姓名" :label-width="labelWidth">
              <el-input v-model="form.cont_name" :readonly="!readOnlyField" />
            </el-form-item>
            <el-form-item label="电话" :label-width="labelWidth">
              <el-input v-model="form.cont_phone" :readonly="!readOnlyField" />
            </el-form-item>
            <el-form-item label="地址" :label-width="labelWidth">
              <el-input
                v-model="form.cont_address"
                :readonly="!readOnlyField"
              />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="labelWidth">
              <el-input v-model="form.cont_email" :readonly="!readOnlyField" />
            </el-form-item>

            <el-divider content-position="right">
              产品&nbsp;<el-button text type="primary" @click="addItem">
                添加
              </el-button>
            </el-divider>
            <div>
              <el-row :gutter="10">
                <el-col :span="4" :offset="1">
                  <el-text class="mx-1" tag="b">货号</el-text>
                </el-col>
                <el-col :span="7" :offset="0">
                  <el-text class="mx-1" tag="b">描述</el-text>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-text class="mx-1" tag="b">数量</el-text>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-text class="mx-1" tag="b">单价</el-text>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-text class="mx-1" tag="b">折扣</el-text>
                </el-col>
                <el-col :span="3" :offset="0"
                  ><el-text
                    class="mx-1"
                    tag="b"
                    style="text-align: right; width: 100%"
                    >合计</el-text
                  ></el-col
                >
              </el-row>

              <el-row
                v-for="item in form.items"
                :key="item.id"
                :gutter="10"
                style="margin-top: 5px"
              >
                <el-col :span="4" :offset="1">
                  <el-input v-model="item.pn" />
                </el-col>
                <el-col :span="7" :offset="0">
                  <el-input v-model="item.description" />
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-input v-model="item.quantity" />
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-input v-model="item.list_price" />
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-input v-model="item.disscount" />
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-input v-model="item.amount" :readonly="!readOnlyField" />
                </el-col>
              </el-row>
            </div>

            <el-divider content-position="right">条款</el-divider>
            <el-row :gutter="20">
              <el-col :span="23" :offset="1">
                <el-form-item
                  v-for="item in terms"
                  :key="item.idx"
                  :label="item.label"
                  label-position="top"
                  label-width="160"
                >
                  <el-input
                    v-model="item.term"
                    :rows="item.row"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :xl="14" :lg="14" :md="14" :sm="24" :xs="24">
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
:deep(.my-info) {
  background: var(--el-color-success-light-9) !important;
  font-weight: bold;
}
</style>
