<template>
    <div v-if="item.children">
        <ElSubMenu :index="fatherPath">
            <template v-slot:title>
                <span>
                    <el-icon color="#409EFC"> <component :is="item?.meta?.icon" /> </el-icon>
                    <slot name="title"> {{ item.meta?.title }} </slot>
                </span>
            </template>
            <SidebarItem v-for="child in item.children" :key="child.path" :item="child" :basePath="fatherPath" />
        </ElSubMenu>
    </div>
    <div v-else>
        <ElMenuItem v-if="item.meta?.show" :index="routerPath(item)" @click="menuClick(item)">
            <el-icon color="#409EFC"> <component :is="item?.meta?.icon" /> </el-icon>
            <span> {{ item?.meta.title }} </span>
        </ElMenuItem>
    </div>
</template>

<script lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { ElMenuItem, ElSubMenu } from 'element-plus';
import { defineComponent, PropType, ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
function registerIcon () {
    const icon: any = {};
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        icon[key] = component;
    }
    return icon;
}

export default defineComponent({
    setup (props: any) {
        const fatherPath = ref(props.basePath);
        return {
            fatherPath,
        };
    },
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
        routerPath (item: RouteRecordRaw): string {
            const path = this.fatherPath === '/' ? '/' + item.path : this.fatherPath + '/' + item.path;
            return path;
        },
        menuClick (item: RouteRecordRaw) {
            this.$router.push(this.routerPath(item));
        },
    },
});
</script>

<style lang="scss" scoped></style>
