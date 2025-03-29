import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

// 导出一个名为delFile的函数，参数为id，类型为string或number
export const delFile = (id: string | number) => {
  // 发送delete请求，请求地址为baseUrlApi(`/file/${id}`)，返回类型为any
  return http.request<any>("delete", baseUrlApi(`file/${id}`));
};

// 导出一个名为addFile的函数，接收一个参数data
export const addFile = (data: any) => {
  // 使用http.request方法发送一个post请求，请求的url为baseUrlApi(`/file`)，请求的数据为data，请求的headers为{"Content-Type": "multipart/form-data"}
  return http.request<any>(
    "post",
    baseUrlApi(`file`),
    { data },
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// 导出一个函数getFile，用于获取文件
export const getFile = (id: number | string) => {
  // 使用http.request方法发送get请求，获取文件
  return http.request<any>("get", baseUrlApi(`file/${id}`));
};

/**
 * @description: 下载后台文件
 * @param {number} id
 * @return {*}
 */
export const downloadFile = (id: number | string) => {
  getFile(id).then(({ data }) => {
    // const url = data.url.replace(/^http/, "https");
    window.open(data.url, "_blank");
  });
};
