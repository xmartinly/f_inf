export default {
  path: "/business",
  meta: {
    title: "业务",
    icon: "material-symbols:business-center-outline-rounded"
  },
  children: [
    {
      path: "/business/quotation",
      name: "Quotation",
      component: () => import("@/views/business/quotation.vue"),
      meta: {
        title: "询价",
        icon: "material-symbols:headset-mic-outline-rounded"
      }
    },
    {
      path: "/business/contract",
      name: "Contract",
      component: () => import("@/views/business/contract.vue"),
      meta: {
        title: "合同",
        icon: "material-symbols:contract-edit-outline-rounded"
      }
    }
  ]
};
