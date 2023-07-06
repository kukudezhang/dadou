<template>
  <div>
    <div class="handOff">
      <button focusable="false" :class="{ active: isActive === true }" @click="isActive = true">添加分公司组织</button>
      <button focusable="false" :class="{ active: isActive === false }" @click="isActive = false">添加其他组织</button>
    </div>
    <div v-if="isActive" style="margin: 0 auto">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size" style="margin-top: 50px">
        <n-form-item label="组织名" path="organName">
          <n-input v-model:value="formValue.organName" placeholder="输入组织名" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input v-model:value="formValue.address" placeholder="输入地址" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" style="width: 100%" type="primary" @click="addCompany">添加</n-button>
        </n-form-item>
        <n-button attr-type="button" style="width: 100%" type="tertiary" @click="resetCompany">重置</n-button>
      </n-form>
    </div>
    <div v-else>
      <n-form
        ref="formRef1"
        :label-width="80"
        :model="formValue1"
        :rules="rules1"
        :size="size"
        style="margin-top: 50px"
      >
        <n-form-item label="分公司组织名称" path="companyValue">
          <n-select v-model:value="formValue1.companyValue" :options="organizationsList" placeholder="请选择" />
        </n-form-item>
        <n-form-item label="组织名" path="orgValue">
          <n-input v-model:value="formValue1.orgValue" placeholder="输入组织名" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input v-model:value="formValue1.address" placeholder="输入地址" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" style="width: 100%" type="primary" @click="addOther">添加</n-button>
        </n-form-item>
        <n-button attr-type="button" style="width: 100%" type="tertiary" @click="resetOther">重置</n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { FormInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { request } from '@/service/request';
const emit = defineEmits(['off']);
const organizationsList = ref([
  {
    label: '请先添加分公司组织',
    value: ''
  }
]);
async function getOrganizationsList() {
  const res: any = await request.get('/organizations');
  const data = res.data[0].children;

  if (data) {
    organizationsList.value = data.map((obj: any) => {
      return { label: obj.organName, value: obj.id };
    });
  }
}
onMounted(() => {
  getOrganizationsList();
});
// 添加用户切换
const isActive = ref(true);
// 添加分公司用户
const formRef = ref<FormInst | null>(null);
const formRef1 = ref<FormInst | null>(null);
const message = useMessage();
const size = ref<'small' | 'medium' | 'large'>('medium');
const formValue = ref({
  organName: '',
  address: ''
});
const formValue1 = ref({
  companyValue: '',
  address: '',
  orgValue: ''
});
const resetOther = () => {
  formValue1.value.companyValue = '';
  formValue1.value.address = '';
  formValue1.value.orgValue = '';
};
const rules = {
  organName: {
    required: true,
    message: '请输入组织名',
    trigger: 'blur'
  },
  address: {
    required: true,
    message: '请输入地址',
    trigger: ['input', 'blur']
  }
};
const rules1 = {
  companyValue: {
    required: true,
    message: '请选择分公司组织名',
    trigger: 'blur'
  },
  tpyeValue: {
    required: true,
    message: '请输入类型',
    trigger: ['input', 'blur']
  },
  address: {
    required: true,
    message: '请输入地址',
    trigger: ['input', 'blur']
  },
  orgValue: {
    required: true,
    message: '请输入组织名',
    trigger: ['input', 'blur']
  }
};
// 添加公司功能
const addCompany = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (!errors) {
      request
        .post('/organizations', {
          organName: `${formValue.value.organName}`,
          addressName: formValue.value.address,
          parent: '64a3801c8c147c00ccfdc410'
        })
        .then(res => {
          if (res.error === null) {
            getOrganizationsList();
            message.success('添加成功');
            emit('off');
          } else {
            message.error('出错了,请稍后再试');
          }
        });
    } else {
      message.error('请正确填写信息');
    }
  });
};
// 重置
const resetCompany = () => {
  formValue.value.organName = '';
  formValue.value.address = '';
};
const addOther = (e: MouseEvent) => {
  e.preventDefault();
  formRef1.value?.validate(errors => {
    if (!errors) {
      request
        .post('/organizations', {
          organName: formValue1.value.orgValue,
          addressName: formValue1.value.address,
          parent: formValue1.value.companyValue
        })
        .then(res => {
          if (res.error === null) {
            getOrganizationsList();
            message.success('添加成功');
            emit('off');
          } else {
            message.error('出错了,请稍后再试');
          }
        });
    } else {
      message.error('请正确填写信息');
    }
  });
};
// 添加其他用户
</script>
<style scoped lang="scss">
.handOff {
  button {
    width: 50%;
    height: 50px;
  }
}

.active {
  background-color: #4098fc;
  color: #fff;
}
</style>
