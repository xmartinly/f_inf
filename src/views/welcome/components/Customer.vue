<template>
  <el-dialog
    :modelValue="modelValue"
    draggable
    center
    :title="dialogTitle"
    width="30%"
    :close-on-click-modal="false"
    @close="handleClose"
    @update:modelValue="handleDialogVisibleChange"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="SAP No.">
        <el-input v-model="form.sap_no" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="中文名">
        <el-input v-model="form.name_chs" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="form.name_eng" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="文件号">
        <el-input v-model="form.file_no" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="地区">
        <el-input v-model="form.locate" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="form.group" :disabled="isReadOnly">
          <el-option
            v-for="item in customerGroupOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!isReadOnly" type="primary" @click="handleSubmit"
          >提交</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { type CustomerData } from "@/api/record";
import { customerGroupOptions } from "@/utils/options";

interface Customer extends CustomerData {}

interface Props {
  modelValue: boolean;
  customerData?: Customer;
  isEdit?: boolean;
  isReadOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  customerData: () => ({
    sap_no: 0,
    name_chs: "",
    name_eng: "",
    file_no: "",
    locate: "",
    group: 1
  }),
  isEdit: false,
  isReadOnly: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // 定义 update:modelValue 事件
  (e: "submit", value: CustomerData): void;
  (e: "close"): void; // 添加 close 事件
}>();

const form = ref<Customer>({ ...props.customerData });

// 监听 props.productData 的变化，更新 form
watch(
  () => props.customerData,
  newVal => {
    if (newVal) {
      form.value = { ...newVal };
    }
  },
  { immediate: true, deep: true }
);

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  if (props.customerData.sap_no) return props.customerData.name_chs;
  return "新建客户";
});

// 关闭对话框
const handleClose = () => {
  emit("update:modelValue", false);
  emit("close"); // 触发 close 事件
};

// 处理对话框显示状态的变化
const handleDialogVisibleChange = (value: boolean) => {
  emit("update:modelValue", value); // 通知父组件更新 modelValue
};

// 提交表单
const handleSubmit = () => {
  emit("submit", form.value); // 提交表单数据
  handleClose(); // 关闭对话框
};
</script>
