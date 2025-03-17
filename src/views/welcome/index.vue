<script setup lang="ts">
defineOptions({
  name: "Welcome"
});
import { Plus, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { AppRequest } from "@/api/record";
import {
  type ProductData,
  type CustomerData,
  type ContactData
} from "@/api/utils";
import { searchTypeOptions } from "@/utils/options";
import { ref } from "vue";
import { LogTable } from "@/components/LogTable";
import { Product, Customer, Contact } from "./components";

const keyword = ref("");
const search_type = ref("prod");
const tableData = ref([]);
const tableInfo = ref([]);
const loading = ref(false);

const showProductDialog = ref(false);
const showCustomerDialog = ref(false);
const showContactDialog = ref(false);
const isEdit = ref(false);
const recReadonly = ref(false);

const currentProduct = ref<ProductData>({} as ProductData);
const currentCustomer = ref<CustomerData>({} as CustomerData);
const currentContact = ref<ContactData>({} as ContactData);

enum ActionType {
  ViewRec = 1,
  EditRec,
  NewRec
}
// 提交记录
const submitRecord = (form: CustomerData | ProductData | ContactData) => {
  let action = "";

  if (form.id) {
    action = "edit";
  } else {
    action = "add";
  }
  if (action != "") recordRequest(form, action);
};
// 删除记录
const delRecord = (record: any) => {
  recordRequest(record, "del");
};
// 搜索记录
const search = async () => {
  recordRequest({}, "search");
};
const recordRequest = (record: any, action: string) => {
  const _request = new AppRequest(search_type.value);
  if (action == "search") {
    loading.value = true;
    const _keyword = keyword.value;
    if (_keyword.length < 2) {
      loading.value = false;
      return;
    }
    _request
      .appRequest(action, record, _keyword)
      .then(({ data }) => {
        tableData.value = data.tableData;
        tableInfo.value = data.props;
      })
      .finally(() => {
        loading.value = false;
      });
    return;
  }
  _request.appRequest(action, record, record.id).then(({ data }) => {
    ElMessage.success(data);
  });
};

// 重置记录
const resetProductData = () => {
  currentProduct.value = {} as ProductData;
};
const resetCustomerData = () => {
  currentCustomer.value = {} as CustomerData;
};
const resetContactData = () => {
  currentContact.value = {} as ContactData;
};
const resetDialogStatus = () => {
  setTimeout(function () {
    showProductDialog.value = false;
    showCustomerDialog.value = false;
    showContactDialog.value = false;
    resetProductData();
    resetCustomerData();
    resetContactData();
    isEdit.value = false;
    recReadonly.value = false;
  }, 200);
};

// 查看
const viewRecrod = (record: any) => {
  recordNormalAction(ActionType.ViewRec, record);
};
// 编辑
const editRecord = (record: any) => {
  recordNormalAction(ActionType.EditRec, record);
};
// 新建
const addRecord = () => {
  recordNormalAction(ActionType.NewRec);
};
const recordNormalAction = (act_: ActionType, record?: any) => {
  const type = search_type.value;
  switch (act_) {
    case ActionType.ViewRec:
      isEdit.value = false;
      recReadonly.value = true;
      break;
    default:
      isEdit.value = true;
      recReadonly.value = false;
      break;
  }
  switch (type) {
    case "prod":
      showProductDialog.value = true;
      currentProduct.value = record as ProductData;
      break;
    case "cust":
      showCustomerDialog.value = true;
      currentCustomer.value = record as CustomerData;
      break;
    case "cont":
      showContactDialog.value = true;
      currentContact.value = record as ContactData;
      break;
    default:
      showCustomerDialog.value = false;
      showContactDialog.value = false;
      showProductDialog.value = false;
      resetContactData();
      resetCustomerData();
      resetProductData();
      break;
  }
};
</script>

<template>
  <el-card shadow="always">
    <template v-slot:header>
      <div>
        <el-form :inline="true" @keyup.enter="search">
          <el-form-item>
            <el-select
              v-model="search_type"
              style="width: 140px"
              placeholder="Search Type"
            >
              <el-option
                v-for="item in searchTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="">
            <el-input
              v-model="keyword"
              style="width: 240px"
              placeholder="Keyword"
            />
          </el-form-item>

          <el-form-item>
            <el-button :icon="Search" circle type="primary" @click="search" />
            <el-button :icon="Plus" circle type="success" @click="addRecord" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <LogTable
      v-model:tableData="tableData"
      v-model:loading="loading"
      v-model:propAndLabel="tableInfo"
      :isActiveData="true"
      @edit="editRecord"
      @del="delRecord"
      @view="viewRecrod"
    />
    <div>
      <Product
        v-model="showProductDialog"
        :productData="currentProduct"
        :isEdit="isEdit"
        :isReadOnly="recReadonly"
        @submit="submitRecord"
        @del="delRecord"
        @close="resetDialogStatus"
      />
      <Customer
        v-model="showCustomerDialog"
        :customerData="currentCustomer"
        :isEdit="isEdit"
        :isReadOnly="recReadonly"
        @submit="submitRecord"
        @close="resetDialogStatus"
      />
      <Contact
        v-model="showContactDialog"
        :isEdit="isEdit"
        :isReadOnly="recReadonly"
        @submit="submitRecord"
        @del="delRecord"
        @close="resetDialogStatus"
      />
    </div>
  </el-card>
</template>

<style lang="scss" scoped></style>
