<script setup lang="ts">
defineOptions({
  name: "Contract"
});
</script>

<template>
  <el-card shadow="always">
    <el-form>
      <el-row :gutter="20">
        <el-col :xl="8" :lg="8" :sm="24" :xs="24">
          <el-form-item label="合同编号">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :sm="24" :xs="24">
          <el-form-item label="合同名称">
            <el-input />
          </el-form-item>
        </el-col>
        <el-col :xl="8" :lg="8" :sm="24" :xs="24">
          <el-form-item label="合同金额">
            <el-input />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="合同类型">
        <el-select placeholder="请选择">
          <el-option label="选项1" value="1" />
          <el-option label="选项2" value="2" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
