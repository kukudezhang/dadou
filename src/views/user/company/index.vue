<template>
  <div>
    <!-- 查询数据 -->
    <n-space>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, h, onMounted, watch } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { request } from '@/service/request';
import { useAuthStore } from '~/src/store';
const authStore = useAuthStore();
const orgId = authStore.userInfo.organization_id;

const columns = [
  {
    title: '用户',
    key: 'organName'
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
    title: '电话',
    key: 'telephone'
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
  const res: any = await request.get(`organizations/${orgId}`);
  list.value = res.data.children;
  tableList.value = res.data.children;
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
</script>
