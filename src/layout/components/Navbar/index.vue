<template>
	<div class="navbar">
		<el-menu class="horizeonMenu" :default-active="activeMenu" mode="horizontal" :ellipsis="false" :unique-opened="true" :background-color="bgColor" :collapse-transition="true" :collapse="false" active-text-color="#ffd04b" text-color="#fff">
			<MenuItem v-for="route in routerList" :item="route" :basePath="route.path" />
		</el-menu>
	</div>
</template>
<script lang="ts">
import { routes } from '@/router';
import { memuBgColor } from '@/setting';
import MenuItem from './MenuItem.vue';

import { ArrowDown, Document, Menu as IconMenu, Setting, SwitchButton } from '@element-plus/icons-vue';
import { defineComponent } from '@vue/runtime-core';
export default defineComponent({
	name: 'nav_Bar',
	setup() {
		const routerList = routes;
		const bgColor = memuBgColor;

		return {
			bgColor,
			routerList,
		};
	},
	components: {
		Document,
		IconMenu,
		Setting,
		MenuItem,
		ArrowDown,
		SwitchButton,
	},
	computed: {
		activeMenu(): string {
			const route = this.$route;
			const path = route.path;
			return path;
		},
	},

	methods: {},
});
</script>
<style lang="scss" scoped>
.navbar {
	background-color: v-bind(bgColor);
	.userCenter {
		color: #fff;
		line-height: 58px;
		cursor: pointer;
	}
}
</style>
