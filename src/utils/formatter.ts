/**
 * @description: 格式化钱
 * @param {number} money
 * @return {*}
 */
import dayjs from "dayjs";

export function fmtMoney(money: number) {
  const _money = Number(money);
  return _money ? _money.toFixed(2) : "";
}

export const fmtFileName = (fileName: string) => {
  if (fileName.length < 1) return "";
  if (fileName.length < 20) return fileName;
  const temp_name = fileName.split(".");
  // const file_name_front = temp_name[0].substring(0, 13) + "~.";
  return temp_name[0].substring(0, 17) + "...";
};

export const validId = (val: any) => {
  const id = Number(val.id);
  if (id == undefined && id == 0) {
    return false;
  }
  return id;
};

/**
 * @description: 报销状态格式化
 * @param {*} cellValue
 * @return {*}
 */
export const fmtReimb = (cellValue: any) => {
  return cellValue ? " 已报销 " : " 未报销 ";
};

export const fmtTimestamp = (time: string) => {
  return dayjs(time).clone().format("YYYY-MM-DD");
};

export const nowDate = () => {
  return dayjs().format("YYYY-MM-DD");
};

/**
 * @description: 报销状态显示状态, 报销的显示删除
 * @param {*} rate
 * @return {*} el-text 的tag 字符串
 */
export const fmtReimbStyle = (is_reimb: number) => {
  return is_reimb ? "del" : "mark";
};

/**
 * @description: 利率显示状态, <6 为红色, <10为黄色, >10为绿色
 * @param {*} rate
 * @return {*} el-text 的type 字符串
 */
export const fmtRateTextStyle = (rate: number): any => {
  if (isNaN(rate) || rate <= 6) {
    return "danger";
  }
  if (rate > 6 && rate <= 10) {
    return "warning";
  }
  if (rate > 10) {
    return "success";
  }
  return "";
};

// 导出一个函数，用于格式化合同条款
export const fmtContractTerms = {
  // 返回一个对象，包含合同条款

  // 制造厂家及国别
  origin: {
    idx: "origin",
    row: 1,
    label: "一、制造厂家及国别：",
    term: "INFICON LTD/列支敦士登"
  },
  // 交货期
  lead: {
    idx: "lead",
    row: 1,
    label: "二、交货期：",
    term: "无现货， 合同签订后16周。"
  },
  // 交货地点
  shipment: {
    idx: "shipment",
    row: 1,
    label: "三、交货地点：",
    term: "买方指定地点，运费由卖方负责。"
  },
  // 付款与发票
  payment: {
    idx: "payment",
    row: 1,
    label: "四、付款与发票：",
    term: "开具发票之日起30天内100%付款到英福康（广州）真空仪器有限公司的账户。"
  },
  // 质量保证
  warrany: {
    idx: "warrany",
    row: 2,
    label: "五、质量保证：CR",
    term: "卖方保证货物是最上等的材料和头等工艺制成,全新、未曾用过并完全符合本合同规定的质量、规格和性能。货物保修期为设备出厂后12个月，消耗件及人为损坏不在保修范围内。 "
  },
  // 索赔
  claims: {
    idx: "claims",
    row: 3,
    label: "六、索赔：CR",
    term: "如发现货物的品质、规格和数量与合同不符，除属于保险公司及运输公司的责任外，买方有权在到货后90天内，根据中国商品检验局出具的证明书向卖方提出索赔。如果卖方在接到买方提出的索赔后一个月之内未作答复，买方即认为索赔已被卖方接受，索赔一切费用由卖方承担。"
  },
  // 其他
  other: {
    idx: "other",
    row: 1,
    label: "七、其他：CR",
    term: "本合同如发生纠纷，当事人双方应当及时协商解决，协商不成时，任何一方均可请业务主管机关调解，调解不成，向当地人民法院起诉。"
  },
  // 货物的最终用户及用途声明
  enduser_declaration: {
    idx: "enduser_declaration",
    row: 5,
    label: "八、货物的最终用户及用途声明：CR",
    term: "买方承诺CR(a) 不得将INFICON品牌产品销售给任何可能用于核武器或核武器承载，生化武器，导弹发射装置及其他军事用途的生产和研究的最终用户或其代理人。CR(b) 严格遵守出口控制法规之规定，不得向任何第三国转口销售INFICON品牌产品。CR(c) 买方应如实以书面形式申报每个最终用户的信息，并以此作为最终用户购买和使用英福康 (INFICON)品牌产品的有效文件。CR(d) 任何违反出口控制法规以及出口管控条例之规定的行为（包括但不限于以上(a)，(b)，(c)条款的行为）都将导致此合同的立即终止。CR(e) 若依据出口控制法规而作出取消合同的决定，英福康公司将不承担任何由此所导致的损失或法律责任。"
  },
  // 杂项
  misc: {
    idx: "misc",
    row: 2,
    label: "九、",
    term: "合同执行期内，买卖双方均不得随意变更或解除合同。合同如有未尽事宜，须经双方共同协商，作出补充协议，补充协议与本合同具有同等效力。本合同一式2份，买卖双方各执1份, 传真件同样具法律效力。"
  }
};

export const fmtGroup = (_group: number | string) => {
  const group = Number(_group);
  let group_t = "";
  // 1=End User - Std, 2=OEM, 3=Distributor, 4=Agent, 6=Reseller, 8=End User - Univ., 9=End User - Govt., 10=Intercompany, 11=Service Providers
  switch (group) {
    case 1:
      group_t = "End User - Std";
      break;
    case 2:
      group_t = "OEM";
      break;
    case 3:
      group_t = "Distributor";
      break;
    case 4:
      group_t = "Agent";
      break;
    case 6:
      group_t = "Reseller";
      break;
    case 8:
      group_t = "End User - Univ";
      break;
    case 9:
      group_t = "End User - Govt.";
      break;
    case 10:
      group_t = "Intercompany";
      break;
    case 11:
      group_t = "Service Providers";
      break;

    default:
      group_t = "未知";
      break;
  }
  return group_t;
};
