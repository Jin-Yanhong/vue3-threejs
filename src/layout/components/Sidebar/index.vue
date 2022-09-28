<template>
	<div class="sidebar">
		<el-menu :default-active="activeMenu" :unique-opened="true" :collapse-transition="true" :collapse="false" :background-color="bgColor" active-text-color="#ffd04b" class="el-menu-vertical-demo" text-color="#fff" mode="vertical">
			<SidebarItem v-for="route in routerList" :item="route" :basePath="route.path" />
		</el-menu>
	</div>
</template>

<script lang="ts">
import { routes } from '@/router';
import { memuBgColor } from '@/setting';
import { Document, Menu as IconMenu, Setting } from '@element-plus/icons-vue';
import { defineComponent } from '@vue/runtime-core';
import SidebarItem from './SidebarItem.vue';
export default defineComponent({
	setup() {
		const routerList = routes;
		const bgColor = memuBgColor;
		return {
			bgColor,
			routerList,
		};
	},
	name: 'Side_bar',
	components: {
		Document,
		IconMenu,
		Setting,
		SidebarItem,
	},
	computed: {
		activeMenu(): string {
			const route = this.$route;
			const path = route.path;
			return path;
		},
	},
});
</script>
<style lang="scss" scoped>
.sidebar {
	border-right: solid 1px var(--el-menu-border-color);
	background-color: v-bind(bgColor);
	:deep(.el-menu) {
		border: none;
	}
}
</style>
