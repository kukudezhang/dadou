<template>
  <div>
    <!-- 查询数据 -->
    <n-space>
      <n-button type="primary" @click="showAddModal = true">添加组织</n-button>
      <n-modal v-model:show="showAddModal" :on-after-leave="findList">
        <n-card style="width: 600px" title="添加组织" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <Add @off="offModel"></Add>
        </n-card>
      </n-modal>
      <!-- 按类型查看用户 -->
      <n-select v-model:value="typeValue" :options="typeOptions" style="width: 150px" placeholder="按状态查看" />
      <!-- 按名称查看用户 -->
      <n-input-group>
        <n-input v-model:value="usernameValue" placeholder="按组织名查看" />
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
          <n-form-item label="组织名" path="user.organName">
            <n-input v-model:value="formValue.user.organName" placeholder="输入用户名" />
          </n-form-item>
          <n-form-item label="用户状态" path="user.state">
            <n-select v-model:value="formValue.user.state" :options="userStateOptions" />
          </n-form-item>
          <n-form-item label="地址" path="user.addressName">
            <n-input v-model:value="formValue.user.addressName" placeholder="输入地址" />
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
import { ref, reactive, h, onMounted, watch, onActivated } from 'vue';
import type { FormInst } from 'naive-ui';
import { NButton, NTag, useMessage, useDialog } from 'naive-ui';
import { request } from '@/service/request';
import Add from '@/views/organizations/add/index.vue';
const showAddModal = ref(false);
const offModel = () => {
  showAddModal.value = false;
};
// 表头数据x
const showModal = ref(false);
// 修改用户表单
const formValue = ref({
  user: {
    id: '',
    organName: '',
    state: '',
    addressName: ''
  }
});
// 表单规则
const rules = {
  user: {
    organName: {
      required: true,
      message: '请输入组织名',
      trigger: 'blur'
    },
    state: {
      required: true,
      message: '请选择用户状态'
      // trigger: 'blur'
    },
    addressName: {
      required: true,
      message: '请输入地址',
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
        .patch(`/organizations/${formValue.value.user.id}`, {
          organName: formValue.value.user.organName,
          state: formValue.value.user.state,
          addressName: formValue.value.user.addressName
        })
        .then(res => {
          if (res.data === '修改成功') {
            findList();
            showModal.value = false;
            message.success('修改成功');
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
  // eslint-disable-next-line no-console
  formValue.value.user.id = row.id;
  formValue.value.user.organName = row.organName;
  formValue.value.user.state = row.state;
  formValue.value.user.addressName = row.address_id.name;
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
      request.delete(`/organizations/${row.id}`).then(res => {
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
const columns = [
  {
    title: '组织',
    key: 'organName'
  },
  {
    title: '所属上级',
    key: 'parent.organName'
  },
  {
    title: '地址',
    key: 'address_id.name'
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
// 数组扁平化
// function flattenData(data) {
//   return data.reduce((result, obj) => {
//     const children = obj.children ? flattenData(obj.children) : [];
//     delete obj.children;
//     return result.concat(obj, children);
//   }, []);
// }
// 表格数据
const list = ref<any>([]);
const tableList = ref<any>([]);
async function findList() {
  const res: any = await request.get('organizations/findList');
  list.value = res.data;
  tableList.value = res.data;
}
onMounted(() => {
  findList();
});
onActivated(() => {
  findList();
});
// 按分类查看数据
const typeValue = ref(null);
const typeOptions = [
  {
    label: '启用中',
    value: 0
  },
  {
    label: '禁用中',
    value: 1
  }
];
watch(typeValue, newVal => {
  if (newVal !== null) {
    tableList.value = list.value.filter((item: any) => {
      if (item.state === newVal) {
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
    if (item.organName.includes(usernameValue.value)) {
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
