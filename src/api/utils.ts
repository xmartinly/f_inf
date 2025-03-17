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

// operator_name;
// order_region;
// cust_name;
// cont_name;
// cont_phone;
// in_date;
// status;
// cust_locate;
// leadtime_term;
// end_user;

// order_no;
// cust_sap;
// cust_file_no;
// cont_address;
// cont_email;
// done_date;
// delivery_term;
// payment_term;
// other_terms;
// comment;

export type QuotationData = {
  id?: number;
  operator_name: string;
  order_region: string;
  cust_name: string;
  cust_locate: string;
  end_user: string;
  cont_name: string;
  cont_phone: string;
  in_date: Date;
  status: number;
  leadtime_term: Text;
};

export type OrderData = {
  id?: number;
  order_no?: string;
  cust_sap?: string;
  cust_file_no?: string;
  cont_address?: string;
  cont_email?: string;
  done_date?: Date;
  delivery_term?: string;
  payment_term?: string;
  other_terms?: string;
  comment?: string;
};
