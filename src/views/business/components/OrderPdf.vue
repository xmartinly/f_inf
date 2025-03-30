<script lang="ts" setup>
defineOptions({
  name: "OrderPdf"
});
import { ref, onMounted, onBeforeMount } from "vue";
import type * as infTypes from "@/api/types";
import { AppRequest } from "@/api/record";
import { useRoute } from "vue-router";
import inficon from "@/assets/inficon.png";
const requestType = ref("order");
const route = useRoute();
const orderId = ref(0);
interface OrderInfo extends infTypes.OrderData {
  seller: string;
  seller_addr: string;
  seller_postcode: string;
  seller_bank: string;
  seller_bank_no: string;
}

onBeforeMount(() => {
  if (route.query.id == undefined) {
    return;
  }
  orderId.value = parseInt(route.query.id as string);
  let _request = new AppRequest(requestType.value);
  _request.appRequest("show", {}, orderId.value).then(({ data, status }) => {
    if (status == "success") {
      Object.assign(order.value, data as infTypes.OrderData);
    }
    window.document.title = order.value.order_no;
  });
});

const orderInfo = ref([
  {
    label1: "买方：",
    field1: "customer.name_chs",
    label2: "合同号：",
    field2: "order_no",
    idx: 1
  },

  {
    label1: "卖方：",
    field1: "seller",
    label2: "日期：",
    field2: "in_date",
    idx: 2
  },
  {
    label1: "最终用户：",
    field1: "end_user",
    label2: "SAP No：",
    field2: "customer.sap_no",
    idx: 3
  }
]);

const footerInfo = ref([
  { text: "英福康（广州）真空仪器有限公司", idx: 1 },
  { text: "中国广州市天河区林和中路188号恒源大厦附楼4楼", idx: 2 },
  { text: "邮编：510610 服务热线：400 800 6826", idx: 3 },
  { text: "电话：+86 20 8723 6889 传真：+86 20 8723 6003", idx: 4 }
]);

const bankInfo = ref([
  {
    label1: "地址：",
    label2: "地址：",
    field1: "contact.address",
    field2: "seller_addr",
    idx: 1
  },
  {
    label1: "邮编：",
    label2: "邮编：",
    field1: "",
    field2: "seller_postcode",
    idx: 2
  },

  {
    label1: "电话：",
    label2: "电话：",
    field1: "contact.phone",
    field2: "seller_phone",
    idx: 3
  },

  {
    label1: "联系人：",
    label2: "联系人：",
    field1: "contact.name",
    field2: "user.chs_name",
    idx: 4
  },

  {
    label1: "负责人签字：",
    label2: "开户银行：",
    field1: "",
    field2: "seller_bank",
    idx: 5
  },

  {
    label1: "盖章：",
    label2: "银行账号：",
    field1: "",
    field2: "seller_bank_no",
    idx: 6
  }
]);

const termsInfo = ref([
  {
    label: "一、制造厂家及国别：",
    field: "order_term.origin_term",
    newLine: false
  },
  { label: "二、交货期：", field: "order_term.leadtime_term", newLine: false },
  {
    label: "三、交货地点：",
    field: "order_term.shipment_term",
    newLine: false
  },
  {
    label: " 四、付款与发票：",
    field: "order_term.payment_term",
    newLine: false
  },
  {
    label: " 五、质量保证：",
    field: "order_term.warranty_term",
    newLine: false
  },
  { label: " 六、索赔：", field: "order_term.claims_term", newLine: false },
  { label: " 七、其他：", field: "order_term.misc_term", newLine: false },
  {
    label: " 八、货物的最终用户及用途声明：",
    field: "order_term.eudec_term",
    newLine: true
  },
  { label: " 九、", field: "order_term.other_term", newLine: false }
]);
const getFieldValue = (obj: any, path: string) => {
  return path.split(".").reduce((o, p) => (o || {})[p], obj);
};

onMounted(() => {
  // setTimeout(startObserving, 2000);
  setTimeout(window.print, 3000);
  setTimeout(window.close, 5000);
});
const order = ref<OrderInfo>({
  id: 0,
  seller: "英福康（广州）真空仪器有限公司",
  in_date: "",
  done_date: "",
  order_no: "",
  bu_code: "VCP",
  user_id: 0,
  region: "",
  customer_id: 0,
  end_user: "",
  end_user_region: "",
  contact_id: null,
  status: "quotation",
  comment: "",
  total_amount: 0,
  user: {} as infTypes.UserData,
  order_items: [] as infTypes.OrderItemData[],
  customer: {} as infTypes.CustomerData,
  contact: {} as infTypes.ContactData,
  order_term: {} as infTypes.OrderTerm,
  seller_addr: "广州市天河区林和中路188号恒源大厦附楼4楼",
  seller_postcode: "510008",
  seller_bank: "中国银行广州市天河支行",
  seller_bank_no: "706857742351"
});
</script>

<template>
  <div class="a4-page">
    <div class="content">
      <el-row>
        <el-col :span="23" :offset="1">
          <el-image style="width: 200px; height: 45px" :src="inficon" />
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" :offset="0" style="text-align: center">
          <h3>&nbsp;英福康（广州）真空仪器有限公司销售合同&nbsp;</h3>
        </el-col>
      </el-row>

      <!-- 合同信息 -->
      <template v-if="order.customer.name_chs">
        <table
          v-for="item in orderInfo"
          :key="item.idx"
          style="
            font-size: 11px;
            width: 100%;
            z-index: -1;
            table-layout: fixed;
            border: none;
          "
        >
          <tr>
            <td style="border-spacing: 0; width: 65px" class="ft11b">
              {{ item.label1 }}
            </td>
            <td style="border-spacing: 0; width: 390px">
              {{ getFieldValue(order, item.field1) }}
            </td>
            <td style="border-spacing: 0; width: 60px" class="ft11b">
              {{ item.label2 }}
            </td>
            <td style="border-spacing: 0; width: 120px">
              {{ getFieldValue(order, item.field2) }}
            </td>
          </tr>
        </table>
      </template>

      <!-- 产品列表 -->
      <el-row style="margin-top: 5px">
        <el-col :span="24" :offset="0">
          <span style="font-size: 11px"
            >在此买方确认购买所需设备、备件, 并接受如下购买条件：</span
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" :offset="0" style="min-height: 6.2cm">
          <table
            id="prod_table"
            style="width: 100%; text-align: center; font-size: 11px"
          >
            <thead>
              <tr style="text-decoration: underline">
                <th class="table-border">序号</th>
                <th class="table-border">货号</th>
                <th class="table-border">品名</th>
                <th class="table-border">数量</th>
                <th class="table-border">单价未税</th>
                <th class="table-border">总价未税</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.order_items" :key="index">
                <td class="table-border">
                  {{ index + 1 }}
                </td>
                <td class="table-border">
                  {{ item.product.pn }}
                </td>
                <td
                  style="
                    border: 1px solid black;
                    border-spacing: 0;
                    font-size: 11px;
                  "
                >
                  {{ item.product.descp }}
                </td>
                <td style="border-spacing: 0; border: 1px solid black">
                  {{ item.quantity }}
                </td>
                <td class="table-border">
                  {{ item.price_rounded }}
                </td>
                <td class="table-border">
                  {{ item.amount }}
                </td>
              </tr>
            </tbody>
            <tfoot style="text-align: left">
              <tr>
                <td
                  colspan="5"
                  style="
                    border: 1px solid black;
                    border-spacing: 0;
                    text-align: right;
                  "
                >
                  人民币未税总价：
                </td>
                <td
                  style="
                    text-align: center;
                    border: 1px solid black;
                    border-spacing: 0;
                  "
                >
                  &nbsp;{{ order.total_amount }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="5"
                  style="
                    border: 1px solid black;
                    border-spacing: 0;
                    text-align: right;
                    font-weight: bold;
                  "
                >
                  中国大陆境内交货价人民币(含中国进口关税、13%增值税) ：
                </td>
                <td
                  style="
                    text-align: center;
                    border: 1px solid black;
                    border-spacing: 0;
                  "
                >
                  &nbsp;{{ parseFloat(order.total_amount * 1.13).toFixed(2) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </el-col>
      </el-row>
      <div
        v-if="order.order_items.length > 8"
        style="page-break-after: always; margin-top: 10mm"
      >
        <span class="ft11b">合同条款及公司信息见下页</span>
      </div>
      <!-- 条款 -->
      <el-row v-if="order.order_term">
        <el-col
          v-for="item in termsInfo"
          :key="item.label"
          :span="24"
          :offset="0"
        >
          <div>
            <span class="ft11b">{{ item.label }}</span>
            <br v-if="item.newLine" />
            <span class="ft11"> {{ getFieldValue(order, item.field) }}</span>
          </div>
        </el-col>
      </el-row>

      <!-- 页尾 -->
      <el-row>
        <el-col :span="24" :offset="0">
          <table style="font-size: 11px; width: 100%; z-index: -1">
            <tr style="font-weight: bold">
              <td style="width: 75px">买方：</td>
              <td style="width: 300px">{{ order.customer.name_chs }}</td>
              <td style="width: 70px">卖方：</td>
              <td>英福康（广州）真空仪器有限公司</td>
            </tr>
            <template v-for="item in bankInfo" :key="item.idx">
              <tr>
                <td style="border-spacing: 0">
                  {{ item.label1 }}
                </td>
                <td style="border-spacing: 0">
                  {{ getFieldValue(order, item.field1) }}
                </td>
                <td style="border-spacing: 0">
                  {{ item.label2 }}
                </td>
                <td style="border-spacing: 0">
                  {{ getFieldValue(order, item.field2) }}
                </td>
              </tr>
            </template>
          </table>
        </el-col>
      </el-row>
    </div>
    <el-row class="footer">
      <el-col v-for="item in footerInfo" :key="item.idx" :span="24" :offset="0">
        <p class="ft10">{{ item.text }}</p>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.a4-page {
  width: 210mm;
  height: 297mm;
  background: white;
  margin: 0px auto;
  padding: 12mm 15mm; /* 安全打印区域 */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  page-break-after: auto; /* 默认自动分页 */
}

@media print {
  @page {
    size: A4;
    margin: 1cm; /* 最小安全边距 */
  }

  body {
    margin: 0;
    background: none;
  }

  .a4-page {
    width: 100%;
    // min-height: auto;
    min-height: calc(297mm - 30mm - 24mm);
    margin: 0;
    box-shadow: none;
    padding: 0;
  }
  .footer {
    position: fixed; /* 打印时固定在每页底部 */
    bottom: 0;
    left: 0;
    right: 0;
    height: 20mm; /* 底部元素高度 */
    text-align: left;
    padding: 5mm 0mm;
  }
}
.content {
  min-height: 230mm; /* 触发分页的阈值 */
}

table {
  border: 1px solid;
  border-spacing: 0;
}

.ft11 {
  font-size: 11px;
  white-space: pre-wrap;
}
.ft10 {
  font-size: 10px;
}
.ft11b {
  font-weight: bold;
  font-size: 11px;
}
.table-border {
  border: 1px solid black;
  border-spacing: 0;
}
</style>
