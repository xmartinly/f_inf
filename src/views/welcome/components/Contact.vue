<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { AppRequest } from "@/api/record";
import { type ContactData, type CustomerData, type AcData } from "@/api/types";

interface Contact extends ContactData {
  customer_name?: string;
}

interface Props {
  modelValue: boolean;
  contactData?: Contact;
  isEdit?: boolean;
  isReadOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  contactData: () => ({
    customer_id: 0,
    name: "",
    phone: "",
    email: "",
    position: "",
    address: ""
  }),
  isEdit: false,
  isReadOnly: false
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void; // 定义 update:modelValue 事件
  (e: "submit", value: ContactData): void;
  (e: "close"): void; // 添加 close 事件
}>();

const form = ref<Contact>({ ...props.contactData });

// 监听 props.productData 的变化，更新 form
watch(
  () => props.contactData,
  newVal => {
    if (newVal) {
      form.value = { ...newVal };
    }
  },
  { immediate: true, deep: true }
);

// 计算属性：对话框标题
const dialogTitle = computed(() => {
  if (props.contactData.name) return props.contactData.name;
  return "新建联系人";
});

// 关闭对话框
const handleClose = () => {
  emit("update:modelValue", false);
};

// 处理对话框显示状态的变化
const handleDialogVisibleChange = (value: boolean) => {
  emit("update:modelValue", value); // 通知父组件更新 modelValue
  emit("close"); // 触发 close 事件
};

// 提交表单
const handleSubmit = () => {
  emit("submit", form.value); // 提交表单数据
  handleClose(); // 关闭对话框
};

const acCustomer = (key: string, cb: (arg: any) => void) => {
  if (key.length < 2) return;
  let timeout: ReturnType<typeof setTimeout>;
  const _request = new AppRequest("cust");
  _request.appRequest("ac", {}, key).then(({ data }) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(data);
    }, 300 * Math.random());
  });
};

const selCustomer = ({ model }: AcData) => {
  form.value.customer_id = model.id;
  console.log(form.value);
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
      <el-form-item label="姓名">
        <el-input v-model="form.name" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="职位">
        <el-input v-model="form.position" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model.number="form.email" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model.number="form.address" :disabled="isReadOnly" />
      </el-form-item>
      <el-form-item label="公司">
        <el-autocomplete
          v-model="form.customer_name"
          clearable
          :disabled="isReadOnly"
          :fetch-suggestions="acCustomer"
          value-key="value"
          :trigger-on-focus="false"
          style="width: 100%"
          @select="selCustomer"
        />
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
