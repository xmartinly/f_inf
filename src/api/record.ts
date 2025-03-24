import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type * as types from "./types";

// 导出AppRequest类
export class AppRequest {
  // 定义公有方法constructor，用于初始化url
  constructor(type: string) {
    this.url = baseUrlApi(type);
  }
  // 定义公有方法setUrl，用于设置url
  public setUrl = (url: string) => {
    // 将url赋值给私有变量url
    this.url = baseUrlApi(url);
  };
  // 定义公有方法appRequest，用于发送请求
  public appRequest = (action: string, data?: any, id?: string | number) => {
    // 如果url为空，则抛出错误
    if (this.url.length === 0) throw new Error("url is empty");
    if (!this.record_actions.includes(action))
      throw new Error("action is not valid");
    // 根据action的值，调用不同的私有方法
    switch (action) {
      case "add":
        return this.addRec(data);
      case "edit":
        return this.editRec(data, id);
      case "del":
        return this.delRec(id);
      case "search":
        return this.searchRec(id);
      case "ac":
        return this.acRec(id);
      case "show":
        return this.getRec(id);
      default:
        return this.indexRec();
    }
  };
  // 定义私有变量url
  private url: string;

  private record_actions = [
    "add",
    "edit",
    "del",
    "search",
    "ac",
    "index",
    "show"
  ];

  // 定义私有方法addRec，用于添加记录
  private addRec = (
    data: types.ProductData | types.CustomerData | types.ContactData
  ) => {
    // 使用http.request方法发送post请求，将data作为参数
    return http.request<any>("post", this.url, { data });
  };
  // 定义私有方法editRec，用于编辑记录
  private editRec = (
    data: types.ProductData | types.CustomerData | types.ContactData,
    id: string | number
  ) => {
    // 使用http.request方法发送put请求，将data作为参数，并在url后拼接id
    return http.request<any>("put", this.url + "/" + id, { data });
  };
  // 定义私有方法delRec，用于删除记录
  private delRec = (id?: string | number) => {
    // 使用http.request方法发送delete请求，并在url后拼接id
    return http.request<any>("delete", this.url + "/" + id);
  };
  // 定义私有方法searchRec，用于搜索记录
  private searchRec = (params?: string | number) => {
    // 使用http.request方法发送get请求，并在url后拼接params
    return http.request<types.TableResult>(
      "get",
      this.url + "/meili/" + params
    );
  };
  // 定义私有方法acRec，用于自动完成记录
  private acRec = (params: string | number) => {
    // 使用http.request方法发送get请求，并在url后拼接params
    return http.request<any>("get", this.url + "/meili/ac/" + params);
  };
  // 定义私有方法indexRec，用于获取所有记录
  private indexRec = () => {
    return http.request<any>("get", this.url);
  };
  // 定义私有方法getRec，用于获取记录
  private getRec = (id: string | number) => {
    return http.request<any>("get", this.url + "/" + id);
  };
}
