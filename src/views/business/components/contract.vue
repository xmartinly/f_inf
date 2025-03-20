<script setup lang="ts">
defineOptions({
  name: "Contract"
});

import { ref, onMounted } from "vue";
import { useUserStoreHook as user } from "@/store/modules/user";
import {
  nowDate,
  fmtContractTerms as terms,
  itemHeader,
  fmtPriceTextStyle
} from "@/utils/formatter";
import { customerGroupOptions } from "@/utils/options";
import {
  type OrderItemData,
  type CustomerData,
  type ContactData,
  type OrderData
} from "@/api/utils";
import { acInput } from "@/utils/autoc";

const labelWidth = ref(80);
const readOnlyField = ref(false);

onMounted(() => {
  terms.forEach(item => {
    form.value[item.idx] = item.term; // 将 term 值赋给对应字段
  });
  if (item_array.value.length == 0) {
    addItem();
  }
});

interface AcProduct {
  pn: string;
  value: string;
  description: string;
  misc: string;
  list_price: number;
  limit_price: number;
}

const item = ref<OrderItemData>({
  id: 0,
  order_id: 0,
  contact_id: 0,
  customer_id: 0,
  pn: "",
  description: "",
  quantity: 1,
  discount: 100,
  price_rounded: 0,
  list_price: 0,
  amount: 0
});

const item_array = ref<OrderItemData[]>([]);

const form = ref<OrderData>({
  id: 0,
  in_date: nowDate(),
  done_date: "",

  order_no: "",
  operator_name: user().username,
  order_region: user().region,

  cust_sap: "",
  cust_name_chs: "",
  cust_name_eng: "",
  cust_locate: "",
  cust_file_no: "",
  cust_type: 1,
  customer_id: 0,

  end_user: "",

  cont_name: "",
  cont_phone: "",
  cont_email: "",
  cont_address: "",
  contact_id: 0,

  origin_term: "",
  leadtime_term: "",
  shipment_term: "",
  payment_term: "",
  warranty_term: "",
  claims_term: "",
  other_term: "",
  enduser_declaration_term: "",
  misc_term: "",

  status: 0,
  comment: "",
  items: item_array.value,
  customer: {} as CustomerData,
  contact: {} as ContactData
});

const addItem = () => {
  item_array.value.push({ ...item.value });
};

const selProduct = (item: AcProduct, item_row: OrderItemData) => {
  item_row.description = item.description;
  item_row.list_price = item.list_price;
  item_row.limit_price = item.limit_price;
  item_row.quantity = item_row.quantity || 1;
  item_row.discount = item_row.discount || 100;
  item_row.price_rounded = item.list_price;
  item_row.amount =
    item_row.quantity * item_row.list_price * (item_row.discount / 100);
};

const selCustomer = (item: CustomerData) => {
  form.value.cust_sap = item.sap_no + "";
  form.value.cust_name_eng = item.name_eng;
  form.value.cust_file_no = item.file_no;
  form.value.cust_locate = item.locate;
  form.value.cust_type = item.group;
  form.value.customer_id = item.id;
  form.value.items.forEach(item_row => {
    item_row.customer_id = item.id;
  });
  console.log(form.value.items);
};

const selContact = (item: ContactData) => {
  form.value.contact_id = item.id;
  form.value.cont_address = item.address;
  form.value.cont_email = item.email;
  form.value.cont_phone = item.phone;
  form.value.items.forEach(item_row => {
    item_row.contact_id = item.id;
  });
  console.log(form.value.items);
};

const selInput = (item: any, item_row: any, type: string) => {
  switch (type) {
    case "prod":
      selProduct(item as AcProduct, item_row as OrderItemData);
      break;
    case "cust":
      selCustomer(item as CustomerData);
      break;
    case "cont":
      selContact(item as ContactData);
      break;
  }
};
// 计算单行货值
const calculateAmount = (item: OrderItemData) => {
  // 确保值为数字（处理空值或非法输入）
  const quantity = Number(item.quantity) || 0;
  const listPrice = Number(item.list_price) || 0;
  const discount = Number(item.discount) || 0;

  // 计算逻辑：amount = 数量 * 单价 * (1 - 折扣百分比)
  const rounded = listPrice * (discount / 100);
  const amount = quantity * rounded;

  // 保留两位小数（可选）
  item.price_rounded = parseFloat(rounded.toFixed(3));
  console.log(item.price_rounded);
  item.amount = parseFloat(amount.toFixed(3));
};
</script>

<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-form>
        <el-row :gutter="30">
          <el-col :xl="12" :lg="10" :md="10" :sm="24" :xs="24">
            <el-divider content-position="right"
              >客户&nbsp;
              <el-button text type="primary"> 新建 </el-button></el-divider
            >
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="客户" :label-width="labelWidth">
                  <el-autocomplete
                    v-model="form.cust_name_chs"
                    clearable
                    :disabled="readOnlyField"
                    :fetch-suggestions="
                      (queryString, cb) => {
                        acInput(queryString, cb, 'cust');
                      }
                    "
                    value-key="value"
                    :trigger-on-focus="false"
                    style="width: 100%"
                    class="autoc"
                    @select="
                      selectedItem =>
                        selInput(selectedItem as any, item, 'cust')
                    "
                  >
                    <template #default="{ item }">
                      <div>{{ item.value }}</div>
                      <span class="ac_misc">{{ item.misc }}</span>
                    </template></el-autocomplete
                  >
                </el-form-item>

                <el-form-item label="地区" :label-width="labelWidth">
                  <el-input
                    v-model="form.cust_locate"
                    :readonly="readOnlyField"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="类型" :label-width="labelWidth">
                  <el-select v-model="form.cust_type">
                    <el-option
                      v-for="type in customerGroupOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="最终用户" :label-width="labelWidth">
                  <el-input v-model="form.end_user" :readonly="readOnlyField" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="right"
              >客户联系人&nbsp;<el-button text type="primary">
                新建
              </el-button></el-divider
            >
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="姓名" :label-width="labelWidth">
                  <el-autocomplete
                    v-model="form.cont_name"
                    clearable
                    :disabled="readOnlyField"
                    :fetch-suggestions="
                      (queryString, cb) => {
                        acInput(queryString, cb, 'cont');
                      }
                    "
                    value-key="value"
                    :trigger-on-focus="false"
                    style="width: 100%"
                    class="autoc"
                    @select="
                      selectedItem =>
                        selInput(selectedItem as any, item, 'cont')
                    "
                  >
                    <template #default="{ item }">
                      <div>{{ item.value }}</div>
                      <span class="ac_misc">{{ item.misc }}</span>
                    </template></el-autocomplete
                  >
                </el-form-item>
                <el-form-item label="电话" :label-width="labelWidth">
                  <el-input
                    v-model="form.cont_phone"
                    :readonly="!readOnlyField"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="地址" :label-width="labelWidth">
                  <el-input
                    v-model="form.cont_address"
                    :readonly="!readOnlyField"
                  />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="labelWidth">
                  <el-input
                    v-model="form.cont_email"
                    :readonly="!readOnlyField"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="right">
              产品&nbsp;<el-button text type="primary" @click="addItem">
                添加
              </el-button>
            </el-divider>
            <div>
              <el-row :gutter="10">
                <el-col
                  v-for="headers in itemHeader('edit')"
                  :key="headers.id"
                  :span="headers.sp"
                  :offset="headers.off"
                >
                  <el-text class="mx-1" tag="b">{{ headers.label }}</el-text>
                </el-col>
              </el-row>

              <el-row
                v-for="item in form.items"
                :key="item.id"
                :gutter="10"
                style="margin-top: 5px"
              >
                <el-col :span="4" :offset="1">
                  <el-autocomplete
                    v-model="item.pn"
                    :debounce="300"
                    clearable
                    :disabled="readOnlyField"
                    :fetch-suggestions="
                      (queryString, cb) => {
                        acInput(queryString, cb, 'prod');
                      }
                    "
                    value-key="value"
                    :trigger-on-focus="false"
                    style="width: 100%"
                    class="autoc"
                    @select="
                      selectedItem =>
                        selInput(selectedItem as any, item, 'prod')
                    "
                  >
                    <template #default="{ item }">
                      <div>{{ item.value }}</div>
                      <span class="ac_misc">{{ item.misc }}</span>
                    </template></el-autocomplete
                  >
                </el-col>
                <el-col :span="8" :offset="0">
                  <el-input v-model="item.description" />
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-input
                    v-model="item.quantity"
                    @input="calculateAmount(item)"
                  />
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-input
                    v-model="item.discount"
                    @input="calculateAmount(item)"
                  />
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-input
                    v-model="item.list_price"
                    @input="calculateAmount(item)"
                  />
                </el-col>
                <el-col :span="4" :offset="0">
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
                    v-model="form[item.idx]"
                    :autosize="true"
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :xl="12" :lg="14" :md="14" :sm="24" :xs="24">
            <el-divider content-position="right">
              概要&nbsp;<el-button text type="success"> 打印 </el-button>
            </el-divider>
            <el-row :gutter="10">
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">员工</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">地区</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">日期</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">编号</el-text>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.operator_name }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.order_region }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.in_date }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.order_no || "n/a" }}</el-text>
              </el-col>
            </el-row>
            <el-divider content-position="right"> 产品 </el-divider>
            <el-row :gutter="10">
              <el-col
                v-for="header in itemHeader('shown')"
                :key="header.id"
                :span="header.sp"
                :offset="header.off"
              >
                <el-text class="mx-1" tag="b">{{ header.label }}</el-text>
              </el-col>
            </el-row>
            <el-row v-for="item in item_array" :key="item.pn" :gutter="10">
              <template v-if="item.pn">
                <el-col :offset="0" :span="4">
                  <el-text>{{ item.pn }}</el-text>
                </el-col>
                <el-col :span="8" :offset="0">
                  <el-text>{{ item.description }}</el-text>
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-text>{{ item.quantity }}</el-text>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-text
                    :type="
                      fmtPriceTextStyle(item.price_rounded, item.limit_price)
                    "
                    >{{ item.price_rounded }}</el-text
                  >
                </el-col>
                <el-col :span="3" :offset="0"
                  ><el-text>{{ item.amount }}</el-text></el-col
                >
                <el-col :span="3" :offset="0"
                  ><el-text>{{ item.limit_price }}</el-text></el-col
                >
              </template>
            </el-row>
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
.el-textarea__inner {
  white-space: pre-wrap; /* 保留换行符 */
}

.autoc li {
  line-height: 3mm;
  padding: 2px;
}
.ac_misc {
  text-overflow: ellipsis;
  overflow: hidden;
  font-style: italic;
  color: gray;
  font-size: smaller;
}

// <span style="float: left,font-size: 12px">{{ item.descp }}</span>
//                     <el-text tag="sub" size="small" style="float: right; color: var(--el-text-color-secondary)">
//                       {{ item.pn }}
//                     </el-text>
//                     <el-text tag="sup" size="small" style="float: right; color: var(--el-text-color-secondary)">{{ item.year }}/</el-text>
</style>
