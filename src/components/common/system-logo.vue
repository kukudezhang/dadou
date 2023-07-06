<template>
  <!-- <icon-local-logo-fill v-if="fill" /> -->
  <!-- <icon-local-logo v-else /> -->
  <!-- <img v-if="fill" src="@/assets/logo2.png" alt="" /> -->
  <img src="@/assets/logo.png" alt="" style="width: 60px" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'SystemLogo' });

interface Props {
  /** logo是否填充 */
  fill?: boolean;
}

withDefaults(defineProps<Props>(), {
  fill: false
});
</script>

<style scoped></style>
