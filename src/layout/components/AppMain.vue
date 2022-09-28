<template>
	<div class="appMain">
		<router-view />
		<keep-alive></keep-alive>
	</div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
	name: 'App_Main',
	setup(props, ctx) {
		return {};
	},
});
</script>
