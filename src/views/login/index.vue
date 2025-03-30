<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";

import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";

import { setToken } from "@/utils/auth";
import { addPathMatch, getTopMenu } from "@/router/utils";
import { usePermissionStoreHook } from "@/store/modules/permission";

defineOptions({
  name: "Login"
});
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  email: "",
  password: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({ email: ruleForm.email, password: ruleForm.password })
        .then(res => {
          if (res.code == 200) {
            setToken(res.data as any);
            usePermissionStoreHook().handleWholeMenus([]);
            addPathMatch();
            router.push(getTopMenu(true).path);
            message("登录成功", { type: "success" });
            loading.value = false;
          } else {
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (["Enter", "NumpadEnter"].includes(code)) {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <Motion>
        <h2 style="color: #f9f9f9">{{ title }}</h2>
      </Motion>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="loginRules"
        size="large"
      >
        <Motion :delay="100">
          <el-form-item
            :rules="[
              {
                required: true,
                message: '请输入邮箱',
                trigger: 'blur'
              }
            ]"
            prop="email"
          >
            <el-input
              v-model="ruleForm.email"
              clearable
              placeholder="账号"
              :prefix-icon="useRenderIcon(User)"
            />
          </el-form-item>
        </Motion>

        <Motion :delay="150">
          <el-form-item prop="password">
            <el-input
              v-model="ruleForm.password"
              clearable
              show-password
              placeholder="密码"
              :prefix-icon="useRenderIcon(Lock)"
            />
          </el-form-item>
        </Motion>

        <Motion :delay="250">
          <el-button
            class="w-full mt-4"
            size="default"
            :loading="loading"
            @click="onLogin(ruleFormRef)"
          >
            登录
          </el-button>
        </Motion>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  padding: 0 2rem;

  background-image: url("@/assets/img/9.jpg");
  z-index: -1;
}

.login-form {
  width: 360px;
  position: absolute;
  right: 25%;
  bottom: 30%;
}
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
