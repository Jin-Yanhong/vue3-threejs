<template>
	<div class="app-container">
		<Navbar class="navBar" />
		<router-view />
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import Navbar from './Navbar/index.vue';
export default defineComponent({
	setup() {
		return {};
	},
	name: 'App_Main',
	components: {
		Navbar,
	},
});
</script>
<style lang="scss" scoped>
.app-container {
	display: grid;
	grid-template-rows: [r1] 58px [r2] calc(100vh - 58px) [r3];
	grid-template-columns: [c1] calc(100vw) [c2];
	.navBar {
		overflow: hidden;
	}
}
</style>
