<script lang="ts" setup>
defineOptions({
  name: "OrderPdf"
});
import { ref, onMounted, onBeforeMount } from "vue";
import type * as infTypes from "@/api/types";
import { AppRequest } from "@/api/record";
import { useRoute } from "vue-router";
import { fmtTimestamp } from "@/utils/formatter";
import inficon from "@/assets/inficon.png";
const requestType = ref("order");
const route = useRoute();
const orderId = ref(0);
interface OrderInfo extends infTypes.OrderData {
  seller: string;
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
const leftOrderInfo = ref([
  { label: "买方：", field: "customer.name_chs" },
  { label: "卖方：", field: "seller" },
  { label: "最终用户：", field: "end_user" }
]);
const rightOrderInfo = ref([
  { label: "合同号：", field: "order_no" },
  { label: "日期：", field: "in_date" },
  { label: "SAP No：", field: "customer.sap_no" }
]);
const getFieldValue = (obj: any, path: string) => {
  return path.split(".").reduce((o, p) => (o || {})[p], obj);
};

onMounted(() => {
  // setTimeout(window.print, 3000);
  // setTimeout(closeWindow, 5000);
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
  order_term: {} as infTypes.OrderTerm
});
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="23" :offset="1">
        <el-image style="width: 200px; height: 45px" :src="inficon" />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24" :offset="0" style="text-align: center">
        <h3>&nbsp;英福康（广州）真空仪器有限公司销售合同&nbsp;</h3>
      </el-col>
    </el-row>

    <el-row v-if="order.customer.name_chs" :gutter="20">
      <el-col
        v-for="item in leftOrderInfo"
        :key="item.label"
        :span="12"
        :offset="0"
      >
        <span
          class="ft12b"
          style="
            display: inline-block;
            border: 1px solid black;
            
            width: 85px;
            height: 14px;
            text-align: center;
          "
          >{{ item.label }}</span
        >
        <span class="ft12"> {{ getFieldValue(order, item.field) }}</span>
      </el-col>
      <el-col
        v-for="item in rightOrderInfo"
        :key="item.label"
        :span="12"
        :offset="0"
      >
        <span
          class="ft12b"
          style="
            display: inline-block;
            border: 1px solid black;
            float: left;
            width: 85px;
            height: 14px;
            text-align: center;
          "
          >{{ item.label }}</span
        >
        <span class="ft12"> {{ getFieldValue(order, item.field) }}</span>
      </el-col>
    </el-row>

    <!-- 甲乙方信息 与合同编号-->
    <!-- <p style="top: 95px; left: 40px" class="ft12b">买方:</p>
    <p style="top: 95px; left: 100px" class="ft12b">
      {{ order.customer.name_chs }}
    </p>
    <p style="top: 115px; left: 40px" class="ft12b">卖方:</p>
    <p style="top: 115px; left: 100px" class="ft12b">
      英福康（广州）真空仪器有限公司
    </p>
    <p style="top: 95px; left: 560px" class="ft12b">合同号:</p>
    <p style="top: 95px; left: 620px" class="ft12">{{ order.order_no }}</p>
    <p style="top: 115px; left: 560px" class="ft12b">日期:</p>
    <p style="top: 115px; left: 620px" class="ft12">
      {{ fmtTimestamp(order.in_date) }}
    </p>
    <p style="top: 135px; left: 40px" class="ft12b">最终用户:</p>
    <p style="top: 135px; left: 100px" class="ft12">
      {{ order.end_user }}
    </p>
    <p style="top: 135px; left: 560px" class="ft12b">SAP No：</p>
    <p style="top: 135px; left: 620px" class="ft12">
      {{ order.customer.sap_no }}
    </p> -->

    <!-- 产品列表 -->
    <p style="top: 170px; left: 40px; font-size: 12px">
      在此买方确认购买所需设备、备件, 并接受如下购买条件：
    </p>
    <table
      style="
        position: absolute;
        top: 190px;
        left: 40px;
        width: 91%;
        text-align: center;
        font-size: 13px;
      "
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
            style="border: 1px solid black; border-spacing: 0; font-size: 11px"
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
    <!-- <div v-if="order.order_items.length > 8" style="page-break-after: always">
      <p style="top: 900px; left: 40px" class="ft12b">条款及联系信息见下页</p>
    </div> -->

    <!-- 合同条款 -->
    <p style="top: 450px; left: 40px" class="ft12b">
      一、制造厂家及国别： {{ order.order_term.origin_term }}
    </p>
    <p style="top: 468px; left: 40px" class="ft12b">
      二、交货期： {{ order.order_term.leadtime_term }}
    </p>
    <p style="top: 486px; left: 40px" class="ft12b">
      三、交货地点 {{ order.order_term.shipment_term }}
    </p>
    <p style="top: 504px; left: 40px" class="ft12b">
      四、付款与发票： {{ order.order_term.payment_term }}
    </p>
    <p style="top: 522px; left: 40px" class="ft12b">五、质量保证：</p>
    <p style="top: 540px; left: 40px; width: 732px" class="ft12">
      卖方保证货物是最上等的材料和头等工艺制成,全新、未曾用过并完全符合本合同规定的质量、规格和性能。
      <br />货物保修期为设备出厂后12个月，消耗件及人为损坏不在保修范围内。
    </p>
    <p style="top: 576px; left: 40px" class="ft12b">六、索赔：</p>
    <p style="top: 594px; left: 40px; width: 732px" class="ft12">
      如发现货物的品质、规格和数量与合同不符，除属于保险公司及运输公司的责任外，买方有权在到货后90天内，根据中国商品检验局出具的证明书向卖方提出索赔。<br />
      如果卖方在接到买方提出的索赔后一个月之内未作答复，买方即认为索赔已被卖方接受，索赔一切费用由卖方承担。
    </p>
    <p style="top: 648px; left: 40px" class="ft12b">七、其他：</p>
    <p style="top: 666px; left: 40px" class="ft12">
      本合同如发生纠纷，当事人双方应当及时协商解决，协商不成时，任何一方均可请业务主管机关调解，调解不成，向当地人民法院起诉。
    </p>
    <p style="top: 684px; left: 40px" class="ft12b">
      八、货物的最终用户及用途声明：
    </p>
    <p style="top: 702px; left: 40px" class="ft12">买方承诺</p>
    <p style="top: 720px; left: 40px; width: 732px" class="ft12">
      (a)不得将INFICON品牌产品销售给任何可能用于核武器或核武器承载，生化武器，导弹发射装置及其他军事用途的生产和研究的最终用户或其代理人。<br />
      (b)
      严格遵守出口控制法规之规定，不得向任何第三国转口销售INFICON品牌产品。<br />
      (c)
      买方应如实以书面形式申报每个最终用户的信息，并以此作为最终用户购买和使用英福康
      (INFICON)品牌 产品的有效文件。<br />
      (d)
      任何违反出口控制法规以及出口管控条例之规定的行为（包括但不限于以上(a)，(b)，(c)条款的行为都将导致此合同的立即终止。<br />
      (e)
      若依据出口控制法规而作出取消合同的决定，英福康公司将不承担任何由此所导致的损失或法律责任。
    </p>
    <p style="top: 828px; left: 40px" class="ft12b">九、</p>
    <p style="top: 830px; left: 63px" class="ft12">
      合同执行期内，买卖双方均不得随意变更或解除合同。合同如有未尽事宜，须经双方共同协商，作出补充协议，<br />补充协议与本合同具有同等效力。本合同一式2份，买卖双方各执1份,
      传真件同样具法律效力。
    </p>
    <!-- 页尾 -->
    <!-- <img width="185" height="185" style="z-index: 99" /> -->
    <table
      style="
        position: absolute;
        top: 880px;
        left: 40px;
        font-size: 12px;
        width: 91%;
        z-index: -1;
      "
    >
      <tr style="font-weight: bold">
        <td style="width: 60px">买方：</td>
        <td style="width: 340px">{{ order.customer.name_chs }}</td>
        <td style="width: 60px">卖方：</td>
        <td>英福康（广州）真空仪器有限公司</td>
      </tr>
      <tr>
        <td style="border-top: 1px solid black; border-spacing: 0">地址：</td>
        <td style="border-top: 1px solid black; border-spacing: 0">
          {{ order.contact.address }}
        </td>
        <td style="border-top: 1px solid black; border-spacing: 0">地址：</td>
        <td style="border-top: 1px solid black; border-spacing: 0">
          广州市天河区林和中路188号恒源大厦附楼4楼
        </td>
      </tr>
      <tr>
        <td>邮编：</td>
        <td>&nbsp;</td>
        <td>邮编：</td>
        <td>510008</td>
      </tr>
      <tr>
        <td>电话：</td>
        <td>{{ order.contact.phone }}</td>
        <td>电话：</td>
        <td>020-87236889, 热线 400-800-6826</td>
      </tr>
      <tr>
        <td>联系人：</td>
        <td>{{ order.contact.name }}</td>
        <td>联系人：</td>
        <td>{{ order.user.chs_name }}</td>
      </tr>
      <tr>
        <td colspan="2">负责人签字：</td>
        <td style="font-weight: bold">开户银行:</td>
        <td style="font-weight: bold">中国银行广州市天河支行</td>
      </tr>
      <tr>
        <td colspan="2">盖章：</td>
        <td style="font-weight: bold">银行帐号:</td>
        <td style="font-weight: bold">706857742351</td>
      </tr>
    </table>

    <p style="top: 1025px; left: 40px" class="ft10">
      英福康（广州）真空仪器有限公司
    </p>
    <p style="top: 1040px; left: 40px" class="ft10">
      中国广州市天河区林和中路188号恒源大厦附楼4楼
    </p>
    <p style="top: 1055px; left: 40px" class="ft10">
      邮编：510610 服务热线：400 800 6826
    </p>
    <p style="top: 1070px; left: 40px" class="ft10">
      电话：+86 20 8723 6889 传真：+86 20 8723 6003
    </p>
  </div>
</template>

<style scoped lang="scss">
@page {
  size: A4;
  margin: 0;
}
@media print {
  .navbar,
  .ad-banner {
    display: none;
  }
}
table {
  border: 1px solid;
  border-spacing: 0;
}

p {
  margin: 0;
  padding: 0;
  position: absolute;
  // white-space: nowrap;
  // font-family: "宋体";
}
.ft12 {
  font-size: 12px;
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
.misc-info {
  position: absolute;
  top: 450px;
  left: 40px;
  z-index: -1;
}
</style>
