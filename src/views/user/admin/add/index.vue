<template>
  <div>
    <div class="handOff">
      <button focusable="false" :class="{ active: isActive === true }" @click="isActive = true">添加分公司用户</button>
      <button focusable="false" :class="{ active: isActive === false }" @click="isActive = false">添加其他用户</button>
    </div>
    <div v-if="isActive" style="margin: 0 auto">
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size" style="margin-top: 50px">
        <n-form-item label="上级组织" path="orgcompanyValue" placeholder="请选择">
          <n-select v-model:value="formValue.orgcompanyValue" :options="orgcompanyOptions" />
        </n-form-item>
        <n-form-item label="用户名" path="user.userName">
          <n-input v-model:value="formValue.user.userName" placeholder="输入用户名" />
        </n-form-item>
        <n-form-item label="账号" path="user.account">
          <n-input v-model:value="formValue.user.account" placeholder="输入账号" />
        </n-form-item>
        <n-form-item label="密码" path="user.password">
          <n-input v-model:value="formValue.user.password" placeholder="输入密码" />
        </n-form-item>
        <n-form-item label="电话" path="user.tel">
          <n-input v-model:value="formValue.user.tel" placeholder="输入电话" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" style="width: 100%" type="primary" @click="addCompany">添加</n-button>
        </n-form-item>
        <n-button attr-type="button" style="width: 100%" type="tertiary" @click="resetAddCompany">重置</n-button>
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
        <n-form-item label="上级组织" path="user.cascaderValue">
          <n-cascader
            v-model:value="formValue1.user.cascaderValue"
            placeholder="请选择上级组织"
            :options="cascaderOptions"
            check-strategy="child"
            size="small"
          />
        </n-form-item>
        <n-form-item label="组织类型" path="user.permissions">
          <n-select v-model:value="formValue1.user.permissions" :options="typeOptions" placeholder="" />
        </n-form-item>
        <n-form-item label="用户名" path="user.userName">
          <n-input v-model:value="formValue1.user.userName" placeholder="输入用户名" />
        </n-form-item>
        <n-form-item label="账号" path="user.account">
          <n-input v-model:value="formValue1.user.account" placeholder="输入账号" />
        </n-form-item>
        <n-form-item label="密码" path="user.password">
          <n-input v-model:value="formValue1.user.password" placeholder="输入密码" />
        </n-form-item>
        <n-form-item label="电话" path="user.tel">
          <n-input v-model:value="formValue1.user.tel" placeholder="输入电话" />
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" style="width: 100%" type="primary" @click="addOther">添加</n-button>
        </n-form-item>
        <n-button style="width: 100%" type="tertiary" @click="resetAddOther">重置</n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FormInst } from 'naive-ui';
import { useMessage } from 'naive-ui';
import { request } from '@/service/request';
const emit = defineEmits(['off']);
// 添加用户切换
const isActive = ref(true);
// 添加分公司用户
const formRef = ref<FormInst | null>(null);
const formRef1 = ref<FormInst | null>(null);
const message = useMessage();
const size = ref<'small' | 'medium' | 'large'>('medium');

const formValue = ref({
  user: {
    userName: '',
    account: '',
    password: '',
    tel: '',
    permissions: 1,
    organization_id: ''
  },
  orgcompanyValue: ''
});
// 重置表单
const resetAddCompany = () => {
  formValue.value.user.userName = '';
  formValue.value.user.account = '';
  formValue.value.user.password = '';
  formValue.value.user.tel = '';
  formValue.value.user.organization_id = '';
  formValue.value.orgcompanyValue = '';
};
const formValue1 = ref({
  user: {
    userName: '',
    account: '',
    password: '',
    tel: '',
    permissions: null,
    organization_id: '',
    cascaderValue: ''
  }
});
// 重置表单
const resetAddOther = () => {
  formValue1.value.user = {
    userName: '',
    account: '',
    password: '',
    tel: '',
    permissions: null,
    organization_id: '',
    cascaderValue: ''
  };
};
const rules = {
  user: {
    userName: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    account: {
      required: true,
      message: '请输入账号',
      trigger: ['input', 'blur']
    },
    password: {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur']
    },
    tel: {
      required: true,
      message: '请输入电话',
      trigger: ['input', 'blur']
    }
  },
  orgcompanyValue: {
    required: true,
    message: '请选择组织',
    trigger: ['blur', 'change']
  }
};
const rules1 = {
  user: {
    userName: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    account: {
      required: true,
      message: '请输入账号',
      trigger: ['input', 'blur']
    },
    password: {
      required: true,
      message: '请输入密码',
      trigger: ['input', 'blur']
    },
    permissions: {
      required: true,
      message: '请选择类型'
    },
    cascaderValue: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    tel: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  }
};
const addCompany = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (!errors) {
      request
        .post('/users/create', {
          userName: formValue.value.user.userName,
          account: formValue.value.user.account,
          password: formValue.value.user.password,
          permissions: formValue.value.user.permissions,
          telephone: formValue.value.user.tel,
          organization_id: formValue.value.orgcompanyValue,
          sex: 0
        })
        .then(res => {
          if (res.error === null) {
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
const addOther = (e: MouseEvent) => {
  e.preventDefault();
  formRef1.value?.validate(errors => {
    if (!errors) {
      request
        .post('/users/create', {
          userName: formValue1.value.user.userName,
          account: formValue1.value.user.account,
          password: formValue1.value.user.password,
          permissions: formValue1.value.user.permissions,
          telephone: formValue1.value.user.tel,
          organization_id: formValue1.value.user.cascaderValue,
          sex: 0
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

const orgcompanyOptions = ref([]);
const cascaderOptions = ref([]);
const typeOptions = ref([
  {
    label: '工厂',
    value: 2
  },
  {
    label: '酒店',
    value: 3
  },
  {
    label: '门店',
    value: 4
  }
]);
// 获取组织
async function getOrganizationsList() {
  const res: any = await request.get('/organizations');
  const data = res.data[0].children;
  orgcompanyOptions.value = data.map((obj: any) => {
    return { label: obj.organName, value: obj.id };
  });
  cascaderOptions.value = data.map((obj: any) => {
    return {
      label: obj.organName,
      value: obj.id,
      children: obj.children
        ? obj.children.map((item: any) => {
            return {
              label: item.organName,
              value: item.id
            };
          })
        : ''
    };
  });
}
onMounted(() => {
  getOrganizationsList();
});
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
