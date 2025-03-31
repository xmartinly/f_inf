<script setup lang="ts">
import { useNav } from "@/layout/hooks/useNav";
import LayNavMix from "../lay-sidebar/NavMix.vue";
import { ref } from "vue";
import LaySidebarBreadCrumb from "../lay-sidebar/components/SidebarBreadCrumb.vue";
import LaySidebarTopCollapse from "../lay-sidebar/components/SidebarTopCollapse.vue";
import { useUserStoreHook } from "@/store/modules/user";

import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import { changePasswd } from "@/api/user";
import { message } from "@/utils/message";

const showPasswdDialog = ref(false);
const password = ref({
  passwd_old: "",
  passwd_new: "",
  id: useUserStoreHook().id
});
const changePasswdHandle = async () => {
  // console.log(useUserStoreHook().id);

  const { passwd_old, passwd_new } = password.value;
  if (passwd_old === "" || passwd_new === "") {
    message("密码不能为空", { type: "error" });
    return;
  }

  const res = await changePasswd(password.value);
  if (res.code === 200) {
    message("修改密码成功, 将于3秒后退出系统. 请重新登陆", { type: "success" });
    setTimeout(() => {
      logout();
    }, 3000);
  }
};

const { layout, device, logout, onPanel, pureApp, toggleSideBar } = useNav();
</script>

<template>
  <div class="navbar bg-[#fff] shadow-sm shadow-[rgba(0,21,41,0.08)]">
    <LaySidebarTopCollapse
      v-if="device === 'mobile'"
      class="hamburger-container"
      :is-active="pureApp.sidebar.opened"
      @toggleClick="toggleSideBar"
    />

    <LaySidebarBreadCrumb
      v-if="layout !== 'mix' && device !== 'mobile'"
      class="breadcrumb-container"
    />

    <LayNavMix v-if="layout === 'mix'" />

    <div v-if="layout === 'vertical'" class="vertical-header-right">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link navbar-bg-hover select-none">
          <p class="dark:text-white">{{ useUserStoreHook().username }}</p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="logout">
            <el-dropdown-item @click="showPasswdDialog = true">
              <IconifyIconOffline :icon="Setting" style="margin: 5px" />
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="logout">
              <IconifyIconOffline
                :icon="LogoutCircleRLine"
                style="margin: 5px"
              />
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <!-- 改密码弹出框 -->
    <el-dialog v-model="showPasswdDialog" title="修改密码" width="30%">
      <el-form :model="password" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="24" :offset="0">
            <el-form-item label="旧密码" required>
              <el-input v-model="password.passwd_old" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" :offset="0">
            <el-form-item label="新密码" required>
              <el-input v-model="password.passwd_new" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24" style="text-align: right">
            <el-space :size="30">
              <el-button type="warning" @click="showPasswdDialog = false"
                >取消</el-button
              >
              <el-button type="primary" @click="changePasswdHandle"
                >保存</el-button
              >
            </el-space>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  height: 48px;
  overflow: hidden;

  .hamburger-container {
    float: left;
    height: 100%;
    line-height: 48px;
    cursor: pointer;
  }

  .vertical-header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 280px;
    height: 48px;
    margin-right: 1rem;
    color: #000000d9;

    .el-dropdown-link {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 48px;
      padding: 10px;
      color: #000000d9;
      cursor: pointer;

      p {
        font-size: 14px;
      }

      img {
        width: 22px;
        height: 22px;
        border-radius: 50%;
      }
    }
  }

  .breadcrumb-container {
    float: left;
    margin-left: 16px;
  }
}

.logout {
  width: 120px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
