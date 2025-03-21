// import { reactive } from "vue";
// import type { FormRules } from "element-plus";
// import { type OrderData } from "@/api/utils";

// interface OrderForm extends OrderData;

// const orderFromRules = reactive<FormRules<OrderForm>>({
//   name: [
//     { required: true, message: "Please input Activity name", trigger: "blur" },
//     { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" }
//   ],
//   region: [
//     {
//       required: true,
//       message: "Please select Activity zone",
//       trigger: "change"
//     }
//   ],
//   count: [
//     {
//       required: true,
//       message: "Please select Activity count",
//       trigger: "change"
//     }
//   ],
//   date1: [
//     {
//       type: "date",
//       required: true,
//       message: "Please pick a date",
//       trigger: "change"
//     }
//   ],
//   date2: [
//     {
//       type: "date",
//       required: true,
//       message: "Please pick a time",
//       trigger: "change"
//     }
//   ],
//   location: [
//     {
//       required: true,
//       message: "Please select a location",
//       trigger: "change"
//     }
//   ],
//   type: [
//     {
//       type: "array",
//       required: true,
//       message: "Please select at least one activity type",
//       trigger: "change"
//     }
//   ],
//   resource: [
//     {
//       required: true,
//       message: "Please select activity resource",
//       trigger: "change"
//     }
//   ],
//   desc: [
//     { required: true, message: "Please input activity form", trigger: "blur" }
//   ]
// });
