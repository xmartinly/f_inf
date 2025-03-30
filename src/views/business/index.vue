<script setup lang="ts">
defineOptions({
  name: "Business"
});
import { ref, onMounted } from "vue";
import { AppRequest } from "@/api/record";
import * as fileOperation from "@/api/file";
import { FileInfo, OrderData } from "@/api/types";
import { bussOptions } from "@/utils/options";
import { Plus, Search, Delete } from "@element-plus/icons-vue";
import {
  genFileId,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from "element-plus";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";
import inficon from "@/assets/inficon.png";
import { getIcons } from "@/utils/helper";

const _request = new AppRequest("order");
const keyword = ref("");
const search_type = ref(-1);
const tableData = ref([]);
const tableInfo = ref([]);
const loading = ref(false);
const uploadVisible = ref(false);
const uploadLoading = ref(false);
const router = useRouter();
const fileList = ref([] as FileInfo[]);
const upload = ref<UploadInstance>();
const fileInfo = ref({
  id: 0,
  order_id: 0,
  descp: "合同"
});

onMounted(() => {
  _request.appRequest("index", {}, "").then(({ data }) => {
    tableData.value = data.tableData;
    tableInfo.value = data.props;
  });
});

const tableRowClass = () => {
  return "success-row";
};
const uploadSuccess = ({ data }: any) => {
  message(data.name + " 上传成功.", { type: "success" });
  fileList.value.push(data);
  uploadLoading.value = false;
  // fileList.value.push(data);
};
const handleExceed: UploadProps["onExceed"] = files => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};
const downloadFile = (id: number | string) => {
  fileOperation.downloadFile(id);
};
const deleteFile = (id: number | string) => {
  fileOperation.delFile(id).then(({ data }) => {
    message(data + " 删除成功.", { type: "success" });
    fileList.value = fileList.value.filter((file: any) => file.id !== id);
  });
};
const submitUpload = () => {
  uploadLoading.value = true;
  upload.value!.submit();
};
const uploadFile = (options: any) => {
  return fileOperation.addFile(options);
};

const btnClick = (data: OrderData, action: string) => {
  if (action == "upload") {
    fileInfo.value.order_id = data.id as number;
    fileList.value = tableData.value.find(
      item => item.id === data.id
    ).order_files;
    uploadVisible.value = true;
    return;
  }

  let params = { id: 0 };
  if (data == undefined) {
    return;
  }
  params.id = data.id as number;

  if (action == "print") {
    if (data.order_no == undefined || data.order_no == "") {
      message("请先保存订单为合同并生成订单编号.", { type: "error" });
      return;
    }
    const routeData = router.resolve({
      path: "/orderpdf",
      query: params
    });
    window.open(routeData.href, "_blank");
  }
  if (action == "edit") {
    router.push({
      path: `/business/contract`,
      query: params
    });
  }
  if (action == "del") {
    _request.appRequest("del", params, "").then(({ data }) => {
      message(data.comment + " 删除成功.", { type: "success" });
    });
  }
};

// 新建
const addRecord = () => {
  router.push({ name: "Contract" });
};

const search = () => {};
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
                v-for="item in bussOptions"
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
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <template #empty>
        <img :src="inficon" />
      </template>
      <el-table-column type="expand">
        <template #default="props">
          <el-table
            :data="props.row.order_items"
            :row-class-name="tableRowClass"
          >
            <el-table-column label="货号" prop="product.pn" />
            <el-table-column label="描述" prop="product.descp" />
            <el-table-column label="数量" prop="quantity" />
            <el-table-column label="折扣" prop="discount" />
            <el-table-column label="金额" prop="amount" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        v-for="item in tableInfo"
        :key="item.field"
        :prop="item.field"
        :label="item.label"
        :show-overflow-tooltip="item.tooltip"
        :fixed="item.fix"
        :width="item.width"
        :sortable="item.sort"
        :align="item.align"
      >
        <template #default="props">
          <div v-if="item.op">
            <el-dropdown class="setup-style" trigger="click">
              <span class="el-dropdown-link">
                <el-button link type="primary">更多</el-button>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(act, index) in item.actions"
                    :key="index"
                    :icon="getIcons(act.icon)"
                    @click="btnClick(props.row, act.action)"
                  >
                    {{ act.text }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="uploadVisible"
      title="文件上传"
      width="30%"
      @close="uploadVisible = false"
    >
      <template #header>
        <div class="my-header">
          <h4>文件上传</h4>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="fileInfo.descp" placeholder="文件描述" />
        </el-col>

        <el-col :span="6" style="text-align: right">
          <el-upload
            ref="upload"
            :limit="1"
            action=""
            :auto-upload="false"
            :http-request="uploadFile"
            :on-exceed="handleExceed"
            :on-success="uploadSuccess"
            :data="{
              order_id: fileInfo.order_id,
              descp: fileInfo.descp
            }"
          >
            <template #trigger>
              <el-button type="primary">选取文件</el-button>
            </template>
          </el-upload>
        </el-col>

        <el-col :span="6" style="text-align: right">
          <el-button type="success" @click="submitUpload">上传</el-button>
        </el-col>
      </el-row>

      <el-table :data="fileList" style="width: 100%">
        <el-table-column prop="descp" label="描述" min-width="30%" />
        <el-table-column prop="name" label="文件名" min-width="50%">
          <template #default="scope">
            <el-text>
              <!-- <svg-icon :icon-class="scope.row.type" size="15px" /> -->
              <el-button
                v-if="scope.row.id"
                link
                small
                type="primary"
                :title="scope.row.name"
                @click="downloadFile(scope.row.id)"
              >
                {{ scope.row.name }}
              </el-button>
            </el-text>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="20%">
          <template #default="scope">
            <el-button
              type="danger"
              link
              :icon="Delete"
              @click="deleteFile(scope.row.id)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
