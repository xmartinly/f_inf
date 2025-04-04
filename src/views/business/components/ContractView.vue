<script setup lang="ts">
defineOptions({
  name: "Contract"
});
import { ref, onMounted } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import {
  nowDate,
  fmtContractTerms as terms,
  itemHeader,
  fmtPriceTextStyle
} from "@/utils/formatter";
import { statusOptions, buCodeOptions } from "@/utils/options";
import type * as infTypes from "@/api/types";
import { acInput } from "@/utils/autoc";
import { AppRequest } from "@/api/record";
import { requestOrderNo } from "@/api/misc";
import { message } from "@/utils/message";
import { useRouter, useRoute } from "vue-router";

const labelWidth = ref(80);
const orderId = ref(0);
const requestType = ref("order");
const readOnlyField = ref(false);
const activeNames = ref([1, 2, 3, 4]);
const contactOptions = ref([] as infTypes.ContactData[]);
const employeeOptions = ref([] as infTypes.UserData[]);
const router = useRouter();
const route = useRoute();
onMounted(() => {
  if (route.query.id != undefined) {
    orderId.value = parseInt(route.query.id as string);
    let _request = new AppRequest(requestType.value);
    _request.appRequest("show", {}, orderId.value).then(({ data, status }) => {
      if (status == "success") {
        Object.assign(form.value, data as infTypes.OrderData);
        Object.assign(
          contactOptions.value,
          data.contacts as infTypes.UserData[]
        );
        selCustomer(data.customer as infTypes.CustomerData);
        selStatus(data.status as string);
      }
    });
  } else {
    terms.forEach(item => {
      form.value.order_term[item.idx] = item.term;
    });
  }
  let _request = new AppRequest("users");
  _request.appRequest("index", {}, "").then(({ data, status }) => {
    if (status == "success") {
      employeeOptions.value = data as infTypes.UserData[];
    }
  });
});
const form = ref<infTypes.OrderData>({
  id: 0,
  in_date: nowDate(),
  done_date: "",
  user_id: null,
  customer_id: null,
  contact_id: null,
  region: useUserStoreHook().region,
  order_no: "",
  bu_code: "VCP",
  end_user: "",
  end_user_region: "",
  status: "quotation",
  comment: "",
  total_amount: 0,
  order_items: [] as infTypes.OrderItemData[],
  customer: {} as infTypes.CustomerData,
  contact: {} as infTypes.ContactData,
  order_term: {} as infTypes.OrderTerm
});
const clearProduct = (item: infTypes.OrderItemData) => {
  form.value.order_items.splice(form.value.order_items.indexOf(item), 1);
};
const genOrderNo = () => {
  if (!form.value.bu_code || !form.value.user_id) {
    message("请选择业务部门和业务员", { type: "error" });
    return;
  }
  requestOrderNo(form.value.bu_code, form.value.user_id).then(
    ({ data, status }) => {
      if (status == "success") {
        form.value.order_no = data as string;
      }
    }
  );
};

const addItem = () => {
  form.value.order_items.push({
    contact_id: form.value.contact_id,
    customer_id: form.value.customer_id,
    quantity: 1, // 默认数量
    discount: 100, // 默认折扣
    price_rounded: 0,
    amount: 0,
    product: {
      pn: "",
      descp: "",
      id: 0
    } as infTypes.ProductData
  } as infTypes.OrderItemData);
};
const selProduct = (
  item: infTypes.ProductData,
  item_row: infTypes.OrderItemData
) => {
  item_row.product.descp = item.descp;
  item_row.product_id = item.id;
  item_row.product.list_price = item.list_price;
  item_row.product.limit_price = item.limit_price;
  item_row.quantity = item_row.quantity || 1;
  item_row.discount = item_row.discount || 100;
  item_row.price_rounded = item.list_price;
  item_row.amount =
    item_row.quantity * item_row.product.list_price * (item_row.discount / 100);
};
const selStatus = (status: string) => {
  form.value.status = statusOptions.find(option => option.label === status)[
    "value"
  ];
};
const selCustomer = (item: infTypes.CustomerData) => {
  form.value.customer_id = item.id;
  if (item.contacts.length > 0) {
    form.value.contact_id = item.contacts[0].id;
    contactOptions.value = item.contacts;
    if (form.value.order_items.length == 0) {
      addItem();
    }
  }
};
const selInput = (item: infTypes.AcData, item_row: any, type: string) => {
  switch (type) {
    case "prod":
      selProduct(
        item.model as infTypes.ProductData,
        item_row as infTypes.OrderItemData
      );
      break;
    case "cust":
      selCustomer(item.model as infTypes.CustomerData);
      break;
  }
};
const calcTotalAmountWT = () => {
  let total = 0;
  form.value.order_items.forEach(item => {
    total += item.amount * 1;
  });
  return parseFloat((total * 1.13).toFixed(2)).toLocaleString();
};

// 计算单行货值
const calculateAmount = (item: infTypes.OrderItemData) => {
  // 确保值为数字（处理空值或非法输入）
  const quantity = Number(item.quantity) || 0;
  const listPrice = Number(item.product.list_price) || 0;
  const discount = Number(item.discount) || 0;
  // 计算逻辑：amount = 数量 * 单价 * (1 - 折扣百分比)
  const rounded = listPrice * (discount / 100);
  const amount = quantity * rounded;
  item.price_rounded = parseFloat(rounded.toFixed(3));
  item.amount = parseFloat(amount.toFixed(3));
};
const goBack = () => {
  router.push({ path: "/business/index" });
};
const onSubmit = () => {
  if (form.value.customer_id == 0 || form.value.contact_id == 0) {
    message("请在输入用户和联系人后提交", { type: "error" });
    return;
  }
  // filterEmptyProductPN();
  const _request = new AppRequest(requestType.value);
  let action = "edit";
  if (!form.value.id) {
    action = "add";
  }
  _request
    .appRequest(action, form.value, form.value.id)
    .then(({ data, status }) => {
      let info = data.order_no ?? data.end_user;
      message(info + " 保存成功. 3秒后返回主页", { type: status });
      setTimeout(goBack, 3000);
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
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="联系人" :label-width="labelWidth">
                  <el-select v-model="form.contact_id">
                    <el-option
                      v-for="item in contactOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- 最终用户信息 -->
            <el-row :gutter="20">
              <el-col :span="12" :offset="0">
                <el-form-item label="最终用户" :label-width="labelWidth">
                  <el-input v-model="form.end_user" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="地区" :label-width="labelWidth">
                  <el-input v-model="form.end_user_region" />
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
              <el-col :span="12" :offset="0">
                <el-form-item label="简述" :label-width="labelWidth">
                  <el-input v-model="form.comment" />
                </el-form-item>
              </el-col>
              <el-col :span="12" :offset="0">
                <el-form-item label="联络人" :label-width="labelWidth">
                  <el-select v-model="form.user_id">
                    <el-option
                      v-for="item in employeeOptions"
                      :key="item.id"
                      :label="item.chs_name"
                      :value="item.id"
                    />
                  </el-select> </el-form-item
              ></el-col>
            </el-row>
            <!-- 产品列表 -->
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
                v-for="item in form.order_items"
                :key="item.id"
                :gutter="10"
                style="margin-top: 5px"
              >
                <el-col :span="4" :offset="1">
                  <el-autocomplete
                    v-model="item.product.pn"
                    :debounce="300"
                    clearable
                    :fetch-suggestions="
                      (queryString, cb) => {
                        acInput(queryString, cb, 'prod');
                      }
                    "
                    value-key="value"
                    :trigger-on-focus="false"
                    style="width: 100%"
                    class="autoc"
                    @clear="clearProduct(item)"
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
                    v-model="item.product.list_price"
                    @input="calculateAmount(item)"
                  />
                </el-col>
                <el-col :span="4" :offset="0">
                  <el-input v-model="item.amount" :readonly="!readOnlyField" />
                </el-col>
              </el-row>
            </template>
            <!-- 合同条款 -->
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
                      v-model="form.order_term[item.idx]"
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
                <el-text class="mx-1" tag="b">操作员</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">地区</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b">日期</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1" tag="b"
                  >编号&nbsp;<el-button
                    type="primary"
                    text
                    style="margin-top: -2px"
                    @click="genOrderNo"
                  >
                    生成
                  </el-button></el-text
                >
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{
                  useUserStoreHook().chs_name
                }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.region }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-text class="mx-1">{{ form.in_date }}</el-text>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-input v-model="form.order_no" style="width: 180px" />
              </el-col>
            </el-row>
            <el-divider content-position="left">
              产品:&nbsp;
              <el-text tag="b"
                >{{ form.order_term.leadtime_term }}&nbsp; 含税总价:&nbsp;{{
                  calcTotalAmountWT()
                }}</el-text
              >
            </el-divider>
            <el-row :gutter="10">
              <el-col
                v-for="header in itemHeader('shown', true)"
                :key="header.id"
                :span="header.sp"
                :offset="header.off"
              >
                <el-text class="mx-1" tag="b">{{ header.label }}</el-text>
              </el-col>
            </el-row>
            <el-row
              v-for="item in form.order_items"
              :key="item.product.pn"
              :gutter="10"
            >
              <template v-if="item.product_id">
                <el-col :span="4" :offset="0">
                  <el-text>{{ item.product.pn }}</el-text>
                </el-col>
                <el-col :span="9" :offset="0">
                  <el-text>{{ item.product.descp }}</el-text>
                </el-col>
                <el-col :span="2" :offset="0">
                  <el-text>{{ item.quantity }}</el-text>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-text>{{ item.price_rounded }}</el-text>
                </el-col>
                <el-col :span="3" :offset="0"
                  ><el-text>{{
                    (item.amount * 1.13).toFixed(2)
                  }}</el-text></el-col
                >
                <el-col :span="3" :offset="0"
                  ><el-text
                    :type="
                      fmtPriceTextStyle(
                        item.price_rounded,
                        item.product.limit_price
                      )
                    "
                    >{{ item.product.limit_price }}</el-text
                  ></el-col
                >
              </template>
            </el-row>
            <el-divider content-position="right">操作</el-divider>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item style="float: right">
                  <el-button type="primary" @click="onSubmit"> 保存 </el-button>
                  <el-button @click="goBack"> 取消 </el-button></el-form-item
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
