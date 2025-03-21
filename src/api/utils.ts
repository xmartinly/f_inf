// export const App_Request = new AppRequest();
export const baseUrlApi = (url: string) => `http://127.0.0.1:8000/api/${url}`;

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
  description: string;
  list_price: number;
  target_price: number;
  limit_price: number;
  p_year: number;
  p_currency: string;
  p_comment: string;
  p_class: string;
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
};

// 定义联系人数据类型
export type ContactData = {
  //  导出ContactData类型
  id?: number;
  customer_id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
};

// 定义订单数据类型
export type OrderData = {
  id: number;
  in_date: string;
  done_date: string;

  order_no: string;
  operator_name: string;
  order_region: string;

  cust_sap: string;
  cust_name_chs: string;
  cust_name_eng: string;
  cust_locate: string;
  cust_file_no: string;
  cust_type: number;
  customer_id?: number;

  end_user: string;

  cont_name: string;
  cont_phone: string;
  cont_email: string;
  cont_address: string;
  contact_id?: number;

  origin_term: string;
  leadtime_term: string;
  shipment_term: string;
  payment_term: string;
  warranty_term: string;
  claims_term: string;
  other_term: string;
  enduser_declaration_term: string;
  misc_term: string;

  status: number;
  comment: string;
  bu_code: string;

  items?: OrderItemData[];
  contact?: ContactData;
  customer?: CustomerData;
};

// 定义订单项数据类型
export type OrderItemData = {
  id?: number;

  order_id?: number;
  contact_id: number;
  customer_id: number;

  pn: string;
  description: string;
  quantity: number;
  discount: number;
  price_rounded: number;
  amount: number;

  list_price?: number;
  limit_price?: number;
};
