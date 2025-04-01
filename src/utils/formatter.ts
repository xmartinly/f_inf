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

export const fmtPriceTextStyle = (
  rounded_price: number,
  limit_price: number
): any => {
  // console.log(rounded_price, limit_price);
  const rounded = Number(rounded_price);
  const limit = Number(limit_price);
  if (rounded == 0 || limit == 0) return "warning";

  if (limit >= rounded) {
    return "danger";
  }
  if (rounded_price > limit_price * 1.2) {
    return "success";
  }
  return "warning";
};

/**
 * @description: 利率显示状态, <6 为红色, <10为黄色, >10为绿色
 * @param {*} rate
 * @return {*} el-text 的type 字符串
 */
export const fmtRateTextStyle = (rate: number): string => {
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

export const itemHeader = (type: string) => {
  const comm_header = [
    {
      id: 0,
      sp: 4,
      off: 1,
      label: "货号",
      element: "pn"
    },
    {
      id: 1,
      sp: 8,
      off: 0,
      label: "描述",
      element: "description"
    },
    {
      id: 2,
      sp: 2,
      off: 0,
      label: "数量",
      element: "quantity"
    },
    {
      id: 10,
      sp: 3,
      off: 0,
      label: "合计",
      element: "amount"
    }
  ];

  const edit_header = [
    {
      id: 3,
      sp: 3,
      off: 0,
      label: "折扣",
      element: "discount"
    },
    {
      id: 4,
      sp: 3,
      off: 0,
      label: "标准价",
      element: "list_price"
    }
  ];
  const shown_header = [
    {
      id: 7,
      sp: 3,
      off: 0,
      label: "单价",
      element: "price_rouuded"
    },
    {
      id: 20,
      sp: 3,
      off: 0,
      label: "最低价",
      element: "limit_price"
    }
  ];

  let headers: any[] = [];
  switch (type) {
    case "edit":
      headers = [...comm_header, ...edit_header];
      break;
    case "shown":
      comm_header[0].off = 0;
      headers = [...comm_header, ...shown_header];
      break;
    default:
      break;
  }
  return headers.sort((a, b) => a.id - b.id);
};

// 导出一个函数，用于格式化合同条款
export const fmtContractTerms = [
  // 返回一个对象，包含合同条款
  // 制造厂家及国别
  {
    id: 1,
    idx: "origin_term",
    row: 1,
    label: "一、制造厂家及国别：",
    term: "保证为原厂"
  },
  // 交货期
  {
    id: 2,
    idx: "leadtime_term",
    row: 1,
    label: "二、交货期：",
    term: "无现货， 合同签订后 XXX 周。"
  },
  // 交货地点
  {
    id: 3,
    idx: "shipment_term",
    row: 1,
    label: "三、交货地点：",
    term: "买方指定地点，运费由卖方负责。"
  },
  // 付款与发票
  {
    id: 4,
    idx: "payment_term",
    row: 1,
    label: "四、付款与发票：",
    term: "预付100%, 到货后开具发票并发货。"
  },
  // 质量保证
  {
    id: 5,
    idx: "warranty_term",
    row: 3,
    label: "五、质量保证：",
    term: "卖方保证货物是最上等的材料和头等工艺制成,全新、未曾用过并完全符合本合同规定的质量、规格和性能。货物保修期为设备出厂后12个月，消耗件及人为损坏不在保修范围内。 "
  },
  // 索赔
  {
    id: 6,
    idx: "claims_term",
    row: 3,
    label: "六、索赔：",
    term: "如发现货物的品质、规格和数量与合同不符，除属于保险公司及运输公司的责任外，买方有权在到货后90天内，根据中国商品检验局出具的证明书向卖方提出索赔。如果卖方在接到买方提出的索赔后一个月之内未作答复，买方即认为索赔已被卖方接受，索赔一切费用由卖方承担。"
  },
  // 其他
  {
    id: 7,
    idx: "other_term",
    row: 2,
    label: "七、其他：",
    term: "本合同如发生纠纷，当事人双方应当及时协商解决，协商不成时，任何一方均可请业务主管机关调解，调解不成，向当地人民法院起诉。"
  },
  // 货物的最终用户及用途声明
  {
    id: 8,
    idx: "eudec_term",
    row: 8,
    label: "八、货物的最终用户及用途声明：",
    term: "买方承诺\n(a) 不得将INFICON品牌产品销售给任何可能用于核武器或核武器承载，生化武器，导弹发射装置及其他军事用途的生产和研究的最终用户或其代理人。\n(b) 严格遵守出口控制法规之规定，不得向任何第三国转口销售INFICON品牌产品。\n(c) 买方应如实以书面形式申报每个最终用户的信息，并以此作为最终用户购买和使用英福康 (INFICON)品牌产品的有效文件。\n(d) 任何违反出口控制法规以及出口管控条例之规定的行为（包括但不限于以上(a)，(b)，(c)条款的行为）都将导致此合同的立即终止。\n(e) 若依据出口控制法规而作出取消合同的决定，英福康公司将不承担任何由此所导致的损失或法律责任。"
  },
  // 杂项
  {
    id: 9,
    idx: "misc_term",
    row: 3,
    label: "九、",
    term: "合同执行期内，买卖双方均不得随意变更或解除合同。合同如有未尽事宜，须经双方共同协商，作出补充协议，补充协议与本合同具有同等效力。本合同一式2份，买卖双方各执1份, 传真件同样具法律效力。"
  }
];

export const fmtGroup = (_group: number | string) => {
  const group = Number(_group);
  let group_t = "";
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
