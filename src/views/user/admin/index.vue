<template>
  <div>
    <!-- 查询数据 -->
    <n-space>
      <n-button type="primary" @click="showAddModal = true">添加用户</n-button>
      <n-modal v-model:show="showAddModal" :on-after-leave="findList">
        <n-card style="width: 600px" title="添加用户" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <Add @off="offModel"></Add>
        </n-card>
      </n-modal>
      <!-- 按类型查看用户 -->
      <n-select v-model:value="typeValue" :options="typeOptions" style="width: 150px" placeholder="按类型查看" />
      <!-- 按名称查看用户 -->
      <n-input-group>
        <n-input v-model:value="usernameValue" placeholder="按上级组织名查看" />
        <n-button type="primary" ghost @click="usernameView">搜索</n-button>
      </n-input-group>
      <n-button type="primary" @click="resetTableData">重置</n-button>
    </n-space>
    <!-- 数据表格和分页器 -->
    <n-data-table :columns="columns" :data="tableList" :pagination="pagination" style="margin-top: 20px" />
    <!-- 修改数据 -->
    <n-modal v-model:show="showModal">
      <n-card style="width: 800px" title="修改用户信息" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules" :size="size">
          <n-form-item label="账号" path="user.account">
            <n-input v-model:value="formValue.user.account" disabled />
          </n-form-item>
          <n-form-item label="用户名" path="user.userName">
            <n-input v-model:value="formValue.user.userName" placeholder="输入用户名" />
          </n-form-item>
          <n-form-item label="用户状态" path="user.state">
            <n-select v-model:value="formValue.user.state" :options="userStateOptions" />
          </n-form-item>
          <n-form-item label="电话" path="user.tel">
            <n-input v-model:value="formValue.user.tel" placeholder="输入电话" />
          </n-form-item>
          <n-form-item style="display: flex; justify-content: center">
            <n-button attr-type="button" style="margin-right: 20px" type="primary" @click="editUserInfo">修改</n-button>
            <n-button attr-type="button" @click="cancleEdit">取消</n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted, watch } from 'vue';
import type { FormInst } from 'naive-ui';
import { NButton, NTag, useMessage, useDialog } from 'naive-ui';
import { request } from '@/service/request';
import Add from '@/views/user/admin/add/index.vue';
const showAddModal = ref(false);
const offModel = () => {
  showAddModal.value = false;
};
// 表头数据x
const showModal = ref(false);
// 修改用户表单
const formValue = ref({
  user: {
    userName: '',
    state: '',
    account: '',
    id: '',
    tel: ''
  }
});
// 表单规则
const rules = {
  user: {
    userName: {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    state: {
      required: true,
      message: '请选择用户状态'
      // trigger: 'blur'
    },
    account: {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    },
    password: {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    tel: {
      required: true,
      message: '请输入电话',
      trigger: 'blur'
    }
  }
};
// 表单方法
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const userStateOptions = [
  {
    label: '启用中',
    value: 0
  },
  {
    label: '禁用中',
    value: 1
  }
];
const editUserInfo = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate(errors => {
    if (!errors) {
      request
        .patch(`users/${formValue.value.user.id}`, {
          userName: formValue.value.user.userName,
          state: formValue.value.user.state,
          telephone: formValue.value.user.tel
        })
        .then(res => {
          if (res.error === null) {
            message.success('修改成功');
            findList();
            showModal.value = false;
          } else {
            message.error('出错了,请稍后再试');
          }
        });
    } else {
      message.error('请正确填写信息');
    }
  });
};
const cancleEdit = () => {
  showModal.value = false;
};
const edit = (row: any) => {
  formValue.value.user.userName = row.userName;
  formValue.value.user.state = row.state;
  formValue.value.user.account = row.account;
  formValue.value.user.id = row.id;
  formValue.value.user.tel = row.telephone;
  showModal.value = true;
};
const dialog = useDialog();
const del = (row: any) => {
  dialog.warning({
    title: '警告',
    content: '确定删除？',
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: () => {
      request.delete(`/users/${row.id}`).then(res => {
        if (res.error === null) {
          message.success('删除成功');
          findList();
        } else {
          message.error('出错了,请稍后再试');
        }
      });
    },
    onNegativeClick: () => {
      message.info('已取消');
    }
  });
};
const reset = (row: any) => {
  dialog.warning({
    title: '警告',
    content: '确定重置密码？',
    positiveText: '重置',
    negativeText: '取消',
    onPositiveClick: () => {
      request
        .post(`users/resetPassword`, {
          id: row.id
        })
        .then(res => {
          if (res.error === null) {
            message.success('重置成功');
          } else {
            message.error('出错了,请稍后再试');
          }
        });
    },
    onNegativeClick: () => {
      message.info('已取消');
    }
  });
};
const columns = [
  {
    title: '用户',
    key: 'userName'
  },
  {
    title: '类型',
    key: 'permissions',
    render(row: any) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info',
          bordered: false
        },
        {
          default: (): string => {
            switch (row.permissions) {
              case 0:
                return '总公司';
              case 1:
                return '分公司';
              case 2:
                return '工厂';
              case 3:
                return '酒店';
              case 4:
                return '门店';
              default:
                return '其他';
            }
          }
        }
      );
    }
  },
  {
    title: '上级组织',
    key: 'organization_id.organName'
  },
  {
    title: '电话',
    key: 'telephone'
  },
  {
    title: '账号',
    key: 'account'
  },
  {
    title: '状态',
    key: 'state',
    render(row: any) {
      return h(
        NTag,
        {
          style: {
            marginRight: '6px'
          },
          type: 'info',
          bordered: false
        },
        {
          default: (): string => {
            if (row.state === 0) {
              return '启用中';
            }
            return '禁用中';
          }
        }
      );
    }
  },
  {
    title: '操作',
    key: 'opreate',
    render(row: any) {
      return [
        h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick: () => edit(row)
          },
          { default: () => '修改' }
        ),
        h(
          NButton,
          {
            type: 'error',
            size: 'small',
            style: 'margin-left:20px',
            onClick: () => del(row)
          },
          { default: () => '删除' }
        ),
        h(
          NButton,
          {
            type: 'warning',
            size: 'small',
            style: 'margin-left:20px',
            onClick: () => reset(row)
          },
          { default: () => '重置密码' }
        )
      ];
    }
  }
];
// 分页器
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [5, 10],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});
// 表格数据
const list = ref<any>([]);
const tableList = ref<any>([]);
async function findList() {
  const res: any = await request.post('users/findList');
  list.value = res.data.list;
  tableList.value = res.data.list;
}
onMounted(() => {
  findList();
});
// 按分类查看数据
const typeValue = ref(null);
const typeOptions = [
  {
    label: '分公司',
    value: 1
  },
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
];
watch(typeValue, newVal => {
  if (newVal !== null) {
    tableList.value = list.value.filter((item: any) => {
      if (item.permissions === newVal) {
        return item;
      }
      return null;
    });
  }
});
// 按用户名查看用户
const usernameValue = ref(null);
const usernameView = () => {
  tableList.value = list.value.filter((item: any) => {
    if (item.organization_id.organName.includes(usernameValue.value)) {
      return item;
    }
    return null;
  });
};
const resetTableData = () => {
  typeValue.value = null;
  tableList.value = list.value;
};
// 修改,删除功能
const size = ref<'small' | 'medium' | 'large'>('medium');
</script>
