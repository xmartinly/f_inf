// 定义表格结果类型
export type TableResult = {
  status: string;
  code: number;
  data: {
    /** 表格数据 */
    tableData: [];
    /** 表格头 */
    props: [];
    /** 新建许可 */
    $add_pers?: boolean;
  };
};

// 定义产品数据类型
export type ProductData = {
  id?: number;
  pn: string;
  descp: string;
  list_price: number;
  target_price: number;
  limit_price: number;
  p_year: number;
  p_currency: string;
  p_comment: string;
  p_class: string;
  status?: string;
};
// 定义产品数据类型
export type UserData = {
  id?: number;
  name: string;
  chs_name: string;
  region: number;
  group: number;
  email: number;
  password?: string;
};

// 定义客户数据类型
export type CustomerData = {
  //  导出CustomerData类型
  id?: number;
  sap_no: number;
  name_chs: string;
  name_eng: string;
  file_no: string;
  locate: string;
  group: number;
  contacts?: ContactData[];
};

// 定义联系人数据类型
export type ContactData = {
  //  导出ContactData类型
  id?: number;
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  position: string;
  address: string;
  customer?: CustomerData;
};

export type OrderTerm = {
  id: number;
  order_id: string;
  origin_term: string;
  leadtime_term: string;
  shipment_term: string;
  payment_term: string;
  warranty_term: string;
  claims_term: string;
  other_terms: string;
  eudec_term: string;
  misc_term: string;
  status: string;
};

export type AcData = {
  value: string;
  misc: string;
  model: CustomerData | ProductData;
};

// 定义订单数据类型
export type OrderData = {
  id: number;
  in_date: string;
  done_date: string;
  contact_id: number;
  customer_id: number;
  user_id: number | string;
  order_no: string;
  region: string;
  bu_code: string;
  end_user: string;
  end_user_region: string;
  total_amount: number;
  status: string;
  comment: string;

  contact?: ContactData;
  customer?: CustomerData;
  user?: UserData;
  order_term?: OrderTerm;
  order_items?: OrderItemData[];
};

// 定义订单项数据类型
export type OrderItemData = {
  id?: number;
  order_id?: number;
  contact_id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  discount: number;
  price_rounded: number;
  amount: number;
  list_price?: number;
  limit_price?: number;
  product: ProductData;
};
