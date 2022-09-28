<template>
	<template v-if="item.children">
		<ElSubMenu :index="fatherPath">
			<template v-slot:title>
				<span>
					<el-icon color="#409EFC"> <component :is="item?.meta?.icon" /> </el-icon>
					<slot name="title"> {{ item.meta.title }} </slot>
				</span>
			</template>
			<SidebarItem v-for="child in item.children" :item="child" :basePath="fatherPath" />
		</ElSubMenu>
	</template>
	<template v-else>
		<ElMenuItem v-if="item.meta.show" :index="routerPath(item)" @click="menuClick(item)">
			<el-icon color="#409EFC"> <component :is="item?.meta?.icon" /> </el-icon>
			<span> {{ item.meta.title }} </span>
		</ElMenuItem>
	</template>
</template>

<script lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { defineComponent } from '@vue/runtime-core';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import { RouteRecordRaw } from 'vue-router';
function registerIcon() {
	let icon: any = {};
	for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
		icon[key] = component;
	}
	return icon;
}

export default defineComponent({
	setup(props: any) {
		let { item, basePath: fatherPath } = props;
		return {
			item,
			fatherPath,
		};
	},
	props: {
		item: { type: Object, required: true },
		basePath: { type: String, required: true },
	},
	name: 'SidebarItem',
	components: {
		ElSubMenu,
		ElMenuItem,
		...registerIcon(),
	},

	methods: {
		routerPath(item: RouteRecordRaw): string {
			let path = this.fatherPath === '/' ? '/' + item.path : this.fatherPath + '/' + item.path;
			return path;
		},
		menuClick(item: RouteRecordRaw) {
			this.$router.push(this.routerPath(item));
		},
	},

	handleIcon(icon: string) {},
});
</script>

<style lang="scss" scoped></style>
