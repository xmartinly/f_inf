<template>
  <div>
    <el-table
      v-loading="loading"
      :data="
        tableData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      min-height="200"
    >
      <template #empty>
        <img :src="inficon" alt="" srcset="" />
      </template>

      <el-table-column
        v-for="item in propAndLabel"
        :key="item.field"
        :prop="item.field"
        :label="item.label"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fix"
        :width="item.width"
        :sortable="item.sort"
        :align="item.align"
        :type="item.filedType"
      >
        <template #default="scope">
          <!-- 是否是链接 -->
          <div v-if="item.link">
            <el-button
              v-if="checkPropValue(scope.row[item.field])"
              type="primary"
              link
              @click="routeClick(scope.row, item.path, item.type, item.blank)"
            >
              {{ rowVal(scope.row, scope.column) }}
            </el-button>
            <span v-else>--</span>
          </div>
          <!-- 是否是按钮 -->
          <div v-if="item.button">
            <el-button
              v-if="checkPropValue(scope.row[item.field])"
              type="primary"
              link
              @click="editClick(scope.row)"
            >
              {{ rowVal(scope.row, scope.column) }}
            </el-button>
            <span v-else>--</span>
          </div>
          <!-- 是否是图标 -->
          <div v-if="item.tooltiptype">
            <el-tooltip effect="light" style="text-align: left">
              <template #content>
                <li
                  v-for="(status, index) in scope.row[item.field]"
                  :key="index"
                >
                  {{ status }}
                </li>
              </template>
              <el-icon :size="16">
                <ChatDotSquare />
              </el-icon>

              <!-- <el-button text :icon="ChatDotSquare" /> -->
            </el-tooltip>
          </div>
          <!-- 判断是否需要下拉操作 -->
          <div v-if="item.op">
            <el-dropdown
              v-if="isActiveData"
              class="setup-style"
              trigger="click"
            >
              <span class="el-dropdown-link">
                <el-button link type="primary">更多</el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(act, index) in item.actions"
                    :key="index"
                    :icon="getIcons(act.icon)"
                    @click="opAction(scope.row, act.action)"
                  >
                    {{ act.text }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              v-else
              link
              :icon="Unlock"
              type="warning"
              @click="rlsRec(scope.row)"
            />
          </div>
          <!-- 是否显示el-text -->
          <div v-if="item.eltext">
            <el-text tag="b" :type="textStyle(scope.row, scope.column)">
              {{ rowVal(scope.row, scope.column) }}
            </el-text>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="tableData.length > pagesize"
      :current-page="currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :total="tableData.length"
      class="mt-3"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Unlock,
  Checked,
  View,
  Printer,
  Delete,
  Finished,
  ChatDotSquare,
  Edit
} from "@element-plus/icons-vue";

import * as fmt from "@/utils/formatter";
import { useRouter } from "vue-router";
import { TableColumnCtx } from "element-plus";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import inficon from "@/assets/inficon.png";

interface InfoLabel {
  label: string;
  field: string;
  tooltip: boolean;
  align?: string;
  fix: boolean;
  op?: boolean;
  link?: boolean;
  button?: boolean;
  icon?: boolean;
  tooltiptype?: boolean;
  blank?: boolean;
  type?: number;
  path?: string;
  filedType?: string;
  width?: number;
  sort?: boolean;
  eltext?: boolean;
  actions?: Array<any>;
}
interface Params {
  [key: string]: any;
}

const props = defineProps({
  modelValue: {
    type: Array<any>,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  propAndLabel: {
    type: Array<InfoLabel>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  isActiveData: {
    type: Boolean,
    default: false
  }
});

const currentPage = ref(1);
const pagesize = ref(10);
const router = useRouter();

const getIcons = (icon_text: string) => {
  switch (icon_text) {
    case "Print":
      return Printer;
    case "Delete":
      return Delete;
    case "Edit":
      return Edit;
    case "View":
      return View;
    case "Checked":
      return Checked;
    case "Finished":
      return Finished;

    default:
      break;
  }
};

const emit = defineEmits([
  "view",
  "release",
  "print",
  "done",
  "del",
  "edit",
  "update:modelValue",
  "update:loading"
]);

/**
 * @description: 格式化el-text 样式
 * @param {*} row
 * @param {*} column
 * @return {*} "success"|"warning"|"error"
 */
const textStyle = (row: any, column: TableColumnCtx<any>): any => {
  const val = rowVal(row, column);
  if (val === 0) return "--";
  return fmt.fmtRateTextStyle(val);
};

/**
 * @description: 检测当前cell值. 为0/字符串返回false, 禁用链接
 * @param {*} val
 * @return {*} boolean
 */
const checkPropValue = (val: any): boolean => {
  const _val = Number(val);
  return isNaN(_val) || _val > 0;
};

/**
 * @description: 操作下拉框, 根据不同的类型触发
 * @param {*} row
 * @param {*} action
 * @return {*}
 */
const opAction = (row: any, action: string) => {
  const id = fmt.validId(row);
  if (!id) {
    message("数据ID错误", { type: "error" });
    return;
  }
  switch (action) {
    case "print":
      print(id);
      break;
    case "del":
      delRow(id);
      break;
    case "done":
      done(id);
      break;
    case "edit":
      edit(row);
      break;
    case "view":
      view(row);
      break;
    default:
      break;
  }
};

/**
 * @description: 格式化net_profit_rate数据
 * @param {*} row
 * @param {*} column
 * @return {*}
 */
const rowVal = (row: any, column: TableColumnCtx<any>) => {
  if (column.property === "net_profit_rate")
    return (row[column.property] * 100).toFixed(2);
  return row[column.property];
};

/**
 * @description: 跳转详情页/打印
 * @return {*}
 */
const routeClick = (data: any, path: any, type?: number, blank?: boolean) => {
  const params: Params = {};
  if (data != undefined) {
    params.id = data.id;
  }
  if (type != undefined) {
    params.type = type;
  }
  //当前页面打开
  if (!blank || blank == undefined) {
    router.push({
      path: path,
      query: params
    });
  } else {
    //新窗口打开, 一般为报销详情打印页面
    const routeData = router.resolve({
      path: path,
      query: params
    });
    window.open(routeData.href, "_blank");
  }
};

/**
 * @description: 分页的size变化
 * @param {*} size
 * @return {*}
 */
const handleSizeChange = (size: number) => {
  pagesize.value = size;
};
/**
 * @description: 分页的当前页变化
 * @param {*} crt_pg
 * @return {*}
 */
const handleCurrentChange = (crt_pg: number) => {
  currentPage.value = crt_pg;
};

/**
 * @description: 激发打印函数
 * @param {*} id
 * @return {*}
 */
const print = (id: any) => {
  emit("print", { id: id });
};

/**
 * @description: 激发编辑函数
 * @param {*} row
 * @return {*}
 */
const edit = (row: any) => {
  emit("edit", row);
};

/**
 * @description: 激发编辑函数
 * @param {*} row
 * @return {*}
 */
const view = (row: any) => {
  emit("view", row);
};

/**
 * @description: 激发编辑函数
 * @param {*} row
 * @return {*}
 */
const editClick = (row: any) => {
  emit("edit", row);
};

/**
 * @description: 激发完成函数
 * @param {*} id
 * @return {*}
 */
const done = (id: any) => {
  // message();
  ElMessageBox.confirm("此纪录将标记完成.", "通知", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "success"
  }).then(() => {
    emit("done", { id: id });
  });
};

/**
 * @description: 激发删除函数
 * @param {*} id
 * @return {*}
 */
const delRow = (id: any) => {
  ElMessageBox.confirm("此纪录将被删除.", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    emit("del", { id: id });
  });
};

/**
 * @description: 激发释放函数
 * @param {*} row
 * @return {*}
 */
const rlsRec = (row: any) => {
  emit("release", { id: row.id });
};
</script>

<style>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.text {
  font-size: 14px;
}

.setup-style .el-dropdown-link:focus {
  outline: none;
}
</style>
