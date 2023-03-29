<template>
    <router-view />
</template>
<script lang="ts" setup>
import { provide } from 'vue';
import { windowSize } from './utils/constant';

provide('windowSize', windowSize);
</script>
<style lang="scss"></style>
