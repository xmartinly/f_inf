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
import {
  customerGroupOptions,
  statusOptions,
  buCodeOptions
} from "@/utils/options";
import {
  type OrderItemData,
  type CustomerData,
  type ContactData,
  type OrderData,
  type OrderTerm,
  type AcData
} from "@/api/utils";
import { acInput } from "@/utils/autoc";
import { AppRequest } from "@/api/record";
import { message } from "@/utils/message";

const labelWidth = ref(80);
const readOnlyField = ref(false);
const activeNames = ref([1, 2, 3, 4]);

onMounted(() => {
  terms.forEach(item => {
    form.value.terms[item.idx] = item.term; // 将 term 值赋给对应字段
  });
  if (form.value.items.length == 0) {
    addItem();
  }
});

const form = ref<OrderData>({
  id: 0,
  in_date: nowDate(),
  done_date: "",

  order_no: "",
  bu_code: "VCP",
  operator_name: user().username,
  region: user().region,

  customer_id: 0,

  end_user: "",
  end_user_region: "",

  contact_id: 0,

  status: -1,
  comment: "",
  total_amount: 0,

  items: [] as OrderItemData[],
  customer: {} as CustomerData,
  contact: {} as ContactData,
  terms: {} as OrderTerm
});

const addItem = () => {
  form.value.items.push({} as OrderItemData);
};

const selProduct = (item: AcData, item_row: OrderItemData) => {
  // item_row.description = item.descp;
  // item_row.list_price = item.list_price;
  // item_row.limit_price = item.limit_price;
  // item_row.quantity = item_row.quantity || 1;
  // item_row.discount = item_row.discount || 100;
  // item_row.price_rounded = item.list_price;
  // item_row.amount =
  //   item_row.quantity * item_row.list_price * (item_row.discount / 100);
};

const selCustomer = (item: AcData) => {
  const _id = item.model.id;
  form.value.customer_id = item.model.id;
  form.value.items.forEach(item_row => {
    item_row.customer_id = _id;
  });
};

const selContact = (item: AcData) => {
  const _id = item.model.id;
  form.value.contact_id = _id;
  form.value.items.forEach(item_row => {
    item_row.contact_id = _id;
  });
};

const selInput = (item: AcData, item_row: any, type: string) => {
  // console.log(item, item_row, type);
  switch (type) {
    case "prod":
      selProduct(item, item_row as OrderItemData);
      break;
    case "cust":
      selCustomer(item);
      break;
    case "cont":
      selContact(item);
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
  // 保留3位小数（可选）
  item.price_rounded = parseFloat(rounded.toFixed(3));
  item.amount = parseFloat(amount.toFixed(3));
};

const onSubmit = () => {
  if (form.value.customer_id == 0 || form.value.contact_id == 0) {
    message("请在输入用户和联系人后提交", { type: "error" });
    return;
  }

  form.value.items.forEach(item_row => {
    item_row.customer_id = form.value.customer_id;
    item_row.contact_id = form.value.contact_id;
  });
  const _request = new AppRequest("order");
  const order_id = form.value.id ? +"" : undefined;
  let action = "update";

  if (!order_id) {
    action = "add";
  }
  _request.appRequest(action, form.value, order_id).then(({ data, status }) => {
    message(data, { type: status });
  });
};
</script>

<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <el-form>
        <el-row :gutter="30">
          <el-col :xl="12" :lg="10" :md="10" :sm="24" :xs="24">
            <el-divider content-position="right">客户与信息</el-divider>

            <!-- 客户与联系人 -->
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="客户" :label-width="labelWidth">
                  <el-autocomplete
                    v-model="form.customer.name_chs"
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
                        selInput(selectedItem as any, form.customer, 'cust')
                    "
                  >
                    <template #default="{ item }">
                      <span>{{ item.value }} <br /></span>
                      <span class="ac_misc">{{ item.misc }}</span>
                    </template>
                  </el-autocomplete>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="联系人" :label-width="labelWidth">
                  <el-autocomplete
                    v-model="form.contact.name"
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
                        selInput(selectedItem as any, form.contact, 'cont')
                    "
                  >
                    <template #default="{ item }">
                      <div>{{ item.value }}</div>
                      <span class="ac_misc">{{ item.misc }}</span>
                    </template></el-autocomplete
                  >
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 最终用户信息 -->
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="最终用户" :label-width="labelWidth">
                  <el-input v-model="form.end_user" :readonly="readOnlyField" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="地区" :label-width="labelWidth">
                  <el-input
                    v-model="form.end_user_region"
                    :readonly="readOnlyField"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 类别与状态 -->
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="类别" :label-width="labelWidth">
                  <el-select v-model="form.bu_code">
                    <el-option
                      v-for="item in buCodeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="状态" :label-width="labelWidth">
                  <el-select v-model="form.status">
                    <el-option
                      v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- comment -->
            <el-row :gutter="20">
              <el-col :span="24" :offset="0">
                <el-form-item label="简述" :label-width="labelWidth">
                  <el-input v-model="form.comment" :readonly="readOnlyField" />
                </el-form-item>
              </el-col>
            </el-row>

            <template v-if="form.customer_id && form.contact_id">
              <el-divider content-position="right">
                产品&nbsp;<el-button text type="primary" @click="addItem">
                  添加
                </el-button>
              </el-divider>

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
                    v-model="item.product.pn"
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
                  <el-input v-model="item.product.descp" />
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
            </template>

            <el-divider content-position="right">条款</el-divider>
            <el-row :gutter="20">
              <el-col :span="23" :offset="1">
                <el-collapse
                  v-for="item in terms"
                  :key="item.idx"
                  v-model="activeNames"
                >
                  <el-collapse-item :title="item.label" :name="item.id">
                    <el-input
                      v-model="form.terms[item.idx]"
                      :autosize="true"
                      type="textarea"
                  /></el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
          </el-col>

          <el-col :xl="12" :lg="14" :md="14" :sm="24" :xs="24">
            <el-divider content-position="left"> 概要 </el-divider>
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
                <el-text class="mx-1">{{ form.terms.origin_term }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.in_date }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.order_no || "n/a" }}</el-text>
              </el-col>
            </el-row>
            <el-divider content-position="left">
              产品:&nbsp;
              <el-text tag="b">{{ form.terms.leadtime_term }}</el-text>
            </el-divider>
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

            <el-divider content-position="right">操作</el-divider>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item style="float: right">
                  <el-button type="primary" @click="onSubmit"> 保存 </el-button>
                  <el-button type="success"> 打印 </el-button>
                  <el-button> 取消 </el-button></el-form-item
                >
              </el-col>
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
</style>
