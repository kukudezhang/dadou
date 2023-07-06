<template>
  <div>
    <h1>欢迎使用 后台管理系统</h1>
  </div>
</template>

<script lang="ts" setup>
import { subscribe } from '@/utils/sailsSocket'
subscribe({
  name: 'aa',
  url: '/sockets/login',
  callback: (data: any) => {
    console.log(data);
  }
})
</script>
<style scoped></style>
