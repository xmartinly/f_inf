/*
 * @Author: xmartinly 778567144@qq.com
 * @Date: 2024-01-07 09:57:03
 * @LastEditors: xmartinly 778567144@qq.com
 * @LastEditTime: 2024-05-10 12:27:20
 * @FilePath: \arj_f\src\utils\options.ts
 * @Description:
 *
 * Copyright (c) 2024 by xmartinly, All Rights Reserved.
 */

const reimbStatus = [
  {
    id: 0,
    value: 0,
    label: "未报销"
  },
  {
    id: 1,
    value: 1,
    label: "已报销"
  }
];

const searchTypeOptions = [
  {
    value: "prod",
    label: "Product"
  },
  {
    value: "cust",
    label: "Customer"
  },
  {
    value: "cont",
    label: "Contact"
  }
];

const customerGroupOptions = [
  //客户类别,  1=End User - Std, 2=OEM, 3=Distributor, 4=Agent, 6=Reseller, 8=End User - Univ., 9=End User - Govt., 10=Intercompany, 11=Service Providers
  {
    value: 1,
    label: "End User - StdEnd User - Std"
  },
  {
    value: 2,
    label: "OEM"
  },
  {
    value: 3,
    label: "Distributor"
  },
  {
    value: 4,
    label: "Agent"
  },
  {
    value: 6,
    label: "Reseller"
  },
  {
    value: 8,
    label: "End User - Univ."
  },
  {
    value: 9,
    label: "End User - Govt."
  },
  {
    value: 10,
    label: "Intercompany"
  },
  {
    value: 11,
    label: "Service Providers"
  }
];

const currencyOptions = [
  {
    value: "CNY",
    label: "人民币"
  },
  {
    value: "USD",
    label: "美元"
  }
];

const payOptions = [
  {
    id: 0,
    value: 0,
    label: "个人"
  },
  {
    id: 1,
    value: 1,
    label: "公司"
  }
];

const typeOptions = [
  {
    id: 0,
    value: 0,
    label: "销售合同"
  },
  {
    id: 1,
    value: 1,
    label: "技术服务合同"
  }
];

const taxOptions = [
  {
    id: 0,
    value: 0.01,
    label: "1"
  },
  {
    id: 1,
    value: 0.03,
    label: "3"
  },
  {
    id: 3,
    value: 0.13,
    label: "13"
  }
];

const statusOptions = [
  {
    id: 0,
    value: 0,
    label: "已取消"
  },
  {
    id: 1,
    value: 1,
    label: "报价阶段"
  },
  {
    id: 2,
    value: 2,
    label: "合同确认"
  },
  {
    id: 3,
    value: 3,
    label: "预付款到账"
  },
  {
    id: 4,
    value: 4,
    label: "订货中"
  },
  {
    id: 5,
    value: 5,
    label: "已发货"
  },
  {
    id: 6,
    value: 6,
    label: "已付尾款"
  },
  {
    id: 7,
    value: 7,
    label: "已完成"
  }
];

const invoiceOptions = [
  {
    id: 0,
    value: 0,
    label: "未开票"
  },
  {
    id: 1,
    value: 1,
    label: "已开票"
  }
];

const coOptions = [
  {
    id: 0,
    value: 1,
    label: "LXN"
  },
  {
    id: 1,
    value: 2,
    label: "XFS"
  }
];

const fileOptions = [
  { id: 0, value: "business", label: "业务" },
  { id: 1, value: "expense", label: "报销" },
  { id: 2, value: "purchase", label: "采购" },
  { id: 3, value: "others", label: "其它" }
];

const commTypeOptions = [
  { id: 0, value: 0, label: "定率" },
  { id: 1, value: 1, label: "定额" }
];

const localOptions = [
  {
    id: 0,
    value: 0,
    label: "交通"
  },
  {
    id: 3,
    value: 3,
    label: "交际"
  },
  {
    id: 5,
    value: 5,
    label: "杂项"
  }
];

const clientOptions = [
  {
    id: 0,
    value: 0,
    label: "甲方"
  },
  {
    id: 1,
    value: 1,
    label: "客户"
  }
];

const expOptions = [
  {
    id: 0,
    value: 0,
    label: "交通"
  },
  {
    id: 1,
    value: 1,
    label: "差旅"
  },
  {
    id: 2,
    value: 2,
    label: "交际"
  },
  {
    id: 3,
    value: 3,
    label: "杂项"
  }
];

const tripOptions = [
  {
    id: 1,
    value: 1,
    label: "津贴"
  },
  {
    id: 2,
    value: 2,
    label: "住宿"
  },
  {
    id: 4,
    value: 4,
    label: "机票"
  }
];
const detailOptions = tripOptions.concat(localOptions);

export {
  invoiceOptions,
  coOptions,
  statusOptions,
  taxOptions,
  typeOptions,
  reimbStatus,
  clientOptions,
  tripOptions,
  localOptions,
  payOptions,
  detailOptions,
  fileOptions,
  commTypeOptions,
  expOptions,
  currencyOptions,
  customerGroupOptions,
  searchTypeOptions
};
