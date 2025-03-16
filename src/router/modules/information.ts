export default {
  path: "/information",
  meta: {
    title: "信息",
    icon: "material-symbols:data-table-outline-rounded"
  },
  children: [
    {
      path: "/information/product",
      name: "Product",
      component: () => import("@/views/information/product.vue"),
      meta: {
        title: "产品",
        icon: "material-symbols:event-list-outline-rounded"
      }
    },
    {
      path: "/information/customer",
      name: "Customer",
      component: () => import("@/views/information/customer.vue"),
      meta: {
        title: "客户",
        icon: "material-symbols:home-work-outline-rounded"
      }
    },
    {
      path: "/information/contact",
      name: "Contact",
      component: () => import("@/views/information/contact.vue"),
      meta: {
        title: "联系人",
        icon: "material-symbols:contact-mail-outline-rounded"
      }
    }
  ]
};
