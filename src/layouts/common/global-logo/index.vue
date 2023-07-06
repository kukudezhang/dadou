<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <system-logo />
    <h2 v-show="showTitle" style="color: #8f147d; font-size: 30px" class="pl-8px transition duration-300 ease-in-out">
      {{ t('message.system.title') }}
    </h2>
  </router-link>
</template>

<script setup lang="ts">
import { routePath } from '@/router';
import { t } from '@/locales';

defineOptions({ name: 'GlobalLogo' });

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const routeHomePath = routePath('root');
</script>

<style scoped></style>
