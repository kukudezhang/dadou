<template>
  <n-form ref="formRef" :model="model" size="large" :show-label="false">
    <!-- :rules="rules" -->
    <n-form-item path="userName">
      <n-input v-model:value="model.userName" placeholder="请输入用户名" />
    </n-form-item>
    <n-form-item path="password">
      <n-input v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
        <n-button :text="true" @click="showModal = true">忘记密码？</n-button>
      </div>
      <n-button
        type="primary"
        size="large"
        :block="true"
        :round="true"
        :loading="auth.loginLoading"
        @click="handleSubmit"
      >
        确定
      </n-button>
    </n-space>
  </n-form>
  <n-modal v-model:show="showModal">
    <n-card style="width: 600px" title="忘记密码？" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <!-- <template #header-extra>请联系管理员重置密码</template> -->
      请联系管理员重置密码：
      <template #footer>联系人：XXX，联系电话：1XX XXXX XXXX</template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst } from 'naive-ui'; // FormRules
import { useAuthStore } from '@/store';
// import { formRules } from '@/utils';

const auth = useAuthStore();
const { login } = useAuthStore();
const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  userName: 'admin',
  password: '123456'
});

// const rules: FormRules = {
//   password: formRules.pwd
// };

const rememberMe = ref(false);
const showModal = ref(false);
async function handleSubmit() {
  await formRef.value?.validate();

  const { userName, password } = model;

  login(userName, password);
}
</script>

<style scoped></style>
