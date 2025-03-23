export default {
  path: "/business",
  redirect: "/business/index",
  meta: {
    icon: "material-symbols:business-center-outline-rounded",
    title: "业务"
  },
  children: [
    {
      path: "/business/index",
      name: "Business",
      component: () => import("@/views/business/index.vue"),
      meta: {
        title: "业务"
      }
    },
    {
      path: "/business/contract",
      name: "Contract",
      component: () => import("@/views/business/components/ContractView.vue"),
      meta: {
        title: "合同",
        showLink: false
      }
    }
  ]
};
