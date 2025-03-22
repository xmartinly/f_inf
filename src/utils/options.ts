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

const buCodeOptions = [
  {
    value: "VCP",
    label: "VCP"
  },
  {
    value: "LDT",
    label: "LDT"
  },
  {
    value: "TFC",
    label: "TFC"
  },
  {
    value: "STC",
    label: "STC"
  }
];

// canceled,quoatation,signed,executing,done
const statusOptions = [
  {
    value: "canceled",
    label: "已取消"
  },
  {
    value: "quoatation",
    label: "询价"
  },
  {
    value: "signed",
    label: "签订"
  },
  {
    value: "executing",
    label: "执行中"
  },
  {
    value: "done",
    label: "完成"
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

const fileOptions = [
  { id: 0, value: "business", label: "业务" },
  { id: 2, value: "purchase", label: "采购" },
  { id: 3, value: "others", label: "其它" }
];

const bussOptions = [
  {
    value: -1,
    label: "询价"
  },
  {
    value: 2,
    label: "合同"
  },
  {
    value: 0,
    label: "取消"
  }
];

const searchTypeOptions = [
  {
    value: "prod",
    label: "产品"
  },
  {
    value: "cust",
    label: "客户"
  },
  {
    value: "cont",
    label: "联系人"
  }
];

// const detailOptions = tripOptions.concat(localOptions);

export {
  invoiceOptions,
  statusOptions,
  fileOptions,
  currencyOptions,
  customerGroupOptions,
  searchTypeOptions,
  bussOptions,
  buCodeOptions
};
