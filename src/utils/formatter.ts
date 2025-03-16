/*
 * @Author: xmartinly 778567144@qq.com
 * @Date: 2024-01-15 00:02:23
 * @LastEditors: xmartinly 778567144@qq.com
 * @LastEditTime: 2024-05-10 12:35:48
 * @FilePath: \arj_f\src\utils\formatter.ts
 * @Description:
 *
 * Copyright (c) 2024 by xmartinly, All Rights Reserved.
 */
/**
 * @description: 格式化钱
 * @param {number} money
 * @return {*}
 */
import * as allOptions from "./options";
import dayjs from "dayjs";

export function fmtMoney(money: number) {
  const _money = Number(money);
  return _money ? _money.toFixed(2) : "";
}

export const fmtFileName = (fileName: string) => {
  if (fileName.length < 1) return "";
  if (fileName.length < 20) return fileName;
  const temp_name = fileName.split(".");
  // const file_name_front = temp_name[0].substring(0, 13) + "~.";
  return temp_name[0].substring(0, 17) + "...";
};

export const validId = (val: any) => {
  const id = Number(val.id);
  if (id == undefined && id == 0) {
    return false;
  }
  return id;
};

export const fmtDetailType = (type = 0) => {
  const options = allOptions.detailOptions;
  const lable = options.filter(x => x.value == type);
  return lable[0].label;
};

export const fmtClientType = (row: any, column: any, cellValue: any) => {
  const options = allOptions.clientOptions;
  let text = cellValue;
  const _idx = options.filter(
    (x: any) => parseFloat(x.value) == parseFloat(cellValue)
  );
  if (_idx.length > 0) {
    text = _idx[0].label;
  }
  return text;
};

/**
 * @description: 报销状态格式化
 * @param {*} cellValue
 * @return {*}
 */
export const fmtReimb = (cellValue: any) => {
  return cellValue ? " 已报销 " : " 未报销 ";
};

export const fmtTimestamp = (time: string) => {
  return dayjs(time).clone().format("YYYY-MM-DD");
};

/**
 * @description: 报销状态显示状态, 报销的显示删除
 * @param {*} rate
 * @return {*} el-text 的tag 字符串
 */
export const fmtReimbStyle = (is_reimb: number) => {
  return is_reimb ? "del" : "mark";
};

/**
 * @description: 利率显示状态, <6 为红色, <10为黄色, >10为绿色
 * @param {*} rate
 * @return {*} el-text 的type 字符串
 */
export const fmtRateTextStyle = (rate: number): any => {
  if (isNaN(rate) || rate <= 6) {
    return "danger";
  }
  if (rate > 6 && rate <= 10) {
    return "warning";
  }
  if (rate > 10) {
    return "success";
  }
  return "";
};

export const fmtGroup = (_group: number | string) => {
  const group = Number(_group);
  let group_t = "";
  // 1=End User - Std, 2=OEM, 3=Distributor, 4=Agent, 6=Reseller, 8=End User - Univ., 9=End User - Govt., 10=Intercompany, 11=Service Providers
  switch (group) {
    case 1:
      group_t = "End User - Std";
      break;
    case 2:
      group_t = "OEM";
      break;
    case 3:
      group_t = "Distributor";
      break;
    case 4:
      group_t = "Agent";
      break;
    case 6:
      group_t = "Reseller";
      break;
    case 8:
      group_t = "End User - Univ";
      break;
    case 9:
      group_t = "End User - Govt.";
      break;
    case 10:
      group_t = "Intercompany";
      break;
    case 11:
      group_t = "Service Providers";
      break;

    default:
      group_t = "未知";
      break;
  }
  return group_t;
};
