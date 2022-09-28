<template>
	<div class="app-container">
		<Sidebar class="sidebar" />
		<Navbar class="navbar" />
		<AppMain class="appMain" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import AppMain from './components/AppMain.vue';
import Navbar from './components/Navbar/index.vue';
import Sidebar from './components/Sidebar/index.vue';
export default defineComponent({
	setup() {
		return {};
	},
	name: 'Layout',
	components: {
		Sidebar,
		Navbar,
		AppMain,
	},
});
</script>
<style lang="scss" scoped>
.app-container {
	display: grid;
	grid-template-rows: [r1] 58px [r2] calc(100vh - 58px) [r3];
	grid-template-columns: [r1] 300px [r2] calc(100vw - 300px) [r3];

	.sidebar {
		grid-row-start: 1;
		grid-row-end: 3;
		grid-column-start: 1;
		grid-column-end: 2;
	}
	.navbar {
		grid-row-start: 1;
		grid-row-end: 2;
		grid-column-start: 2;
		grid-column-end: 3;
	}
	.appMain {
		grid-row-start: 2;
		grid-row-end: 3;
		grid-column-start: 2;
		grid-column-end: 2;
	}
}
</style>
