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
const orderInfoLeft = ref([
  {
    label: "买方：",
    field: "customer.name_chs",
    idx: 1
  },
  {
    label: "卖方：",
    field: "seller",
    idx: 2
  },
  {
    label: "最终用户：",
    field: "end_user",
    idx: 3
  }
]);

const orderInfoRight = ref([
  {
    label: "合同号：",
    field: "order_no",
    idx: 1
  },

  {
    label: "日期：",
    field: "in_date",
    idx: 2
  },
  {
    label: "SAP No：",
    field: "customer.sap_no",
    idx: 3
  }
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
  // setTimeout(window.print, 3000);
  // setTimeout(window.close, 5000);
});
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
</script>

<template>
  <div class="main">
    <div class="page-container">
      <div class="logo">
        <el-image
          style="width: 200px; height: 45px; margin-left: 10px"
          :src="inficon"
        />
      </div>
      <h3 style="text-align: center">
        &nbsp;英福康（广州）真空仪器有限公司销售合同&nbsp;
      </h3>
      <div v-if="order.customer.name_chs" class="info-section">
        <div>
          <table
            v-for="item in orderInfoLeft"
            :key="item.idx"
            style="width: 100%; border: none"
          >
            <tr>
              <td style="border-spacing: 0; width: 65px" class="ft12b">
                {{ item.label }}
              </td>
              <td style="border-spacing: 0" class="ft12">
                {{ getFieldValue(order, item.field) }}
              </td>
            </tr>
          </table>
        </div>
        <div>
          <table
            v-for="item in orderInfoRight"
            :key="item.idx"
            style="width: 100%; border: none"
          >
            <tr>
              <td style="border-spacing: 0; width: 65px" class="ft12b">
                {{ item.label }}
              </td>
              <td style="border-spacing: 0" class="ft12">
                {{ getFieldValue(order, item.field) }}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 产品列表 -->
      <div class="product-list">
        <span style="font-size: 12px"
          >在此买方确认购买所需设备、备件, 并接受如下购买条件：</span
        >
        <table style="width: 99%; text-align: center; font-size: 12px">
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
              <td class="table-border" style="text-align: right">
                {{ item.price_rounded }}
              </td>
              <td class="table-border" style="text-align: right">
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
                  text-align: right;
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
                  text-align: right;
                  border: 1px solid black;
                  border-spacing: 0;
                "
              >
                &nbsp;{{ parseFloat(order.total_amount * 1.13).toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <span
        class="ft12b"
        style="position: absolute; bottom: 1.65cm; font-style: italic"
        >合同条款及公司信息见下页</span
      >
      <div class="footer">
        <hr />
        <p>英福康（广州）真空仪器有限公司</p>
        <p>中国广州市天河区林和中路188号恒源大厦附楼4楼</p>
        <p>邮编：510610 服务热线：400 800 6826</p>
        <p>电话：+86 20 8723 6889 传真：+86 20 8723 6003</p>
      </div>
    </div>

    <div class="page-container">
      <div class="logo">
        <el-image
          style="width: 200px; height: 45px; margin-left: 10px"
          :src="inficon"
        />
      </div>
      <!-- 条款 -->
      <div v-if="order.order_term" class="content">
        <div
          v-for="item in termsInfo"
          :key="item.label"
          class="terms-and-conditions"
        >
          <div>
            <span class="ft12b">{{ item.label }}</span>
            <br v-if="item.newLine" />
            <span class="ft12"> {{ getFieldValue(order, item.field) }}</span>
          </div>
        </div>
      </div>

      <!-- 签名 -->
      <div class="signature-area">
        <table style="font-size: 12px; width: 99.5%; border: none">
          <tr style="font-weight: bold">
            <td style="width: 53px">买方：</td>
            <td style="width: 240px">
              {{ order.customer.name_chs }}
            </td>
            <td style="width: 43px">卖方：</td>
            <td style="width: 200px">英福康（广州）真空仪器有限公司</td>
          </tr>
          <template v-for="item in bankInfo" :key="item.idx">
            <tr>
              <td>
                {{ item.label1 }}
              </td>
              <td>
                {{ getFieldValue(order, item.field1) }}
              </td>
              <td>
                {{ item.label2 }}
              </td>
              <td>
                {{ getFieldValue(order, item.field2) }}
              </td>
            </tr>
          </template>
        </table>
      </div>

      <div class="footer">
        <hr />
        <p>英福康（广州）真空仪器有限公司</p>
        <p>中国广州市天河区林和中路188号恒源大厦附楼4楼</p>
        <p>邮编：510610 服务热线：400 800 6826</p>
        <p>电话：+86 20 8723 6889 传真：+86 20 8723 6003</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
main {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-container {
  width: 21cm; /* A4 paper width */
  height: 29.7cm; /* A4 paper height */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  background-color: white;
  margin: 1cm;
  float: left;
  padding: 20px;
}

.logo {
  height: 1.5cm;
  line-height: 1.5cm;
}

.footer {
  height: 1.6cm;
  text-align: left;
  font-size: 10px;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.content {
  padding-top: 1.5cm;
  padding-bottom: 6cm; /* Adjusted to accommodate signature area and footer */
  height: calc(
    100% - 8.5cm
  ); /* Total height minus logo, signature area, and footer */
  display: flex;
  flex-direction: column;
}

.info-section {
  height: 2cm;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-list {
  flex-grow: 1;
  overflow-y: auto;
}

.signature-area {
  height: 6cm;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 1.65cm; /* Positioned above the footer */
  width: 100%;
}

.terms-and-conditions {
  flex-grow: 1;
}

@media print {
  main {
    background-color: transparent;
    margin: 0;
    padding: 0;
    display: block;
  }

  .page-container {
    box-shadow: none;
    padding: 0;
    margin: 0;
    page-break-after: always;
  }

  .logo,
  .footer,
  .info-section,
  .product-list,
  .signature-area,
  .terms-and-conditions {
    break-inside: avoid;
  }
}

table {
  border: 1px solid;
  border-spacing: 0;
}

.ft12 {
  font-size: 12px;
  white-space: pre-wrap;
}
.ft10 {
  font-size: 10px;
}
.ft12b {
  font-weight: bold;
  font-size: 12px;
}
.table-border {
  border: 1px solid black;
  border-spacing: 0;
}
</style>
