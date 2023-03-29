<template>
    <template v-if="item?.children?.length as number > 1">
        <ElSubMenu :index="basePath">
            <template #title>
                <el-icon> <component :is="item?.meta?.icon" /> </el-icon>
                <span> {{ item.meta?.title }}</span>
            </template>
            <SidebarItem v-for="child in item.children" v-bind:key="child.path" :item="child" :basePath="basePath" />
        </ElSubMenu>
    </template>
    <template v-else>
        <ElMenuItem v-show="item.meta?.show" :index="resolvePath([basePath, '/', item.path])">
            <el-icon> <component :is="item?.meta?.icon" /> </el-icon>
            <template #title>
                <span> {{ item.meta?.title }} </span>
            </template>
        </ElMenuItem>
    </template>
</template>

<script lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import { defineComponent, PropType } from 'vue';
import { RouteRecordRaw } from 'vue-router';

function registerIcon() {
    const icon: any = {};
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        icon[key] = component;
    }
    return icon;
}

export default defineComponent({
    props: {
        item: { type: Object as PropType<RouteRecordRaw>, required: true },
        basePath: { type: String, required: true },
    },
    name: 'SidebarItem',
    components: {
        ElSubMenu,
        ElMenuItem,
        ...registerIcon(),
    },
    methods: {
        resolvePath(paths: string[]): string {
            const pathNode: string[] = paths.join('').replace(/\//g, ' ').split(' ');
            const result: string = Array.from(new Set(pathNode)).join('/') || '/';
            return result;
        },
    },
});
</script>

<style lang="scss" scoped></style>
