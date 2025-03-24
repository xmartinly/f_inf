import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

export const requestOrderNo = (bu_code: string, emp_id: string | number) => {
  return http.request<any>(
    "get",
    baseUrlApi("order/gen_no/") + `${bu_code}/${emp_id}`
  );
};
