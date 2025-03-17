<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { type ProductData } from "@/api/utils";
import { currencyOptions } from "@/utils/options";

interface Product extends ProductData {}

interface Props {
  modelValue: boolean;
  productData?: Product;
  isEdit?: boolean;
  isReadOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  productData: () => ({
    pn: "",
    description: "",
    list_price: 0,
    target_price: 0,
    limit_price: 0,
    p_year: 0,
    p_currency: "CNY",
    p_comment: "",
    p_class: ""
  }),
  isEdit: false,
  isReadOnly: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // 定义 update:modelValue 事件
  (e: "submit", value: ProductData): void;
  (e: "close"): void; // 添加 close 事件
}>();

const form = ref<Product>({ ...props.productData });

// 监听 props.productData 的变化，更新 form
watch(
  () => props.productData,
  newVal => {
    if (newVal) {
      form.value = { ...newVal };
    }
  },
  { immediate: true, deep: true }
);

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  if (props.productData.pn) return props.productData.pn;
  return "新建产品";
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
      <el-form-item label="货号">
        <el-input v-model="form.pn" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="标准价">
        <el-input v-model="form.list_price" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="目标价">
        <el-input v-model="form.target_price" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="最低价">
        <el-input v-model="form.limit_price" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="年份">
        <el-input v-model="form.p_year" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="货币">
        <el-select v-model="form.p_currency" :disabled="isReadOnly">
          <el-option
            v-for="item in currencyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input v-model="form.p_comment" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="类别">
        <el-input v-model="form.p_class" :disabled="isReadOnly" />
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
