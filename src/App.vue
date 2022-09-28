<template>
	<router-view />
	<keep-alive></keep-alive>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
	name: 'App',
});
</script>
<style lang="scss"></style>
