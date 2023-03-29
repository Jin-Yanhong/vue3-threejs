<template>
    <div class="sidebarCom">
        <div class="scrollY" style="height: 100%">
            <ElMenu
                :default-active="activeMenu"
                :unique-opened="menuConfig.uniqueOpened"
                :collapse-transition="menuConfig.collapseTransition"
                :collapse="false"
                :background-color="menuConfig.backgroundColor"
                :active-text-color="menuConfig.activeTextColor"
                :text-color="menuConfig.textColor"
                mode="vertical"
                :router="true"
            >
                <SidebarItem v-for="route in routerList" :key="route.path" :item="route" :basePath="route.path" />
            </ElMenu>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { chapter01 } from '@/router/modules/chapter01';
import { chapter02 } from '@/router/modules/chapter02';
import { chapter03 } from '@/router/modules/chapter03';
import { chapter04 } from '@/router/modules/chapter04';
import { ref, computed, reactive, watch } from 'vue';
import { RouteRecordRaw, useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { menuConfigType } from '@/types';
import useAppStore from '@/store/app';
import settings from '@/settings';

const app = useAppStore();
const currentRoute = useRoute();
const menuConfig = reactive<menuConfigType>({ ...settings.menuConfig });
const activeMenu = computed(() => currentRoute.path);
const sidebarWidth = ref<string>(settings.appConfig.layOut.menuWidth);

const path = computed(() => app.getCurrentPath);

const routerList = ref<Array<RouteRecordRaw>>(chapter01);

watch(path, path => {
    switch (path) {
        case 'chapter-01':
            routerList.value = chapter01;
            break;
        case 'chapter-02':
            routerList.value = chapter02;
            break;
        case 'chapter-03':
            routerList.value = chapter03;
            break;
        case 'chapter-04':
            routerList.value = chapter04;
            break;
        // case 'chapter-05':
        //     routerList.value = chapter05;
        //     break;
        // case 'chapter-06':
        //     routerList.value = chapter06;
        //     break;
        // case 'chapter-07':
        //     routerList.value = chapter07;
        //     break;
        // case 'chapter-08':
        //     routerList.value = chapter08;
        //     break;

        default:
            routerList.value = chapter01;
            break;
    }
});
</script>
<style lang="less" scoped>
@import '@/assets/style/variable.less';
.sidebarCom {
    position: relative;
    background-color: @color-layout-bg-navbar;
    :deep(.el-menu) {
        border: none;
    }
    .btn {
        position: absolute;
        top: 50%;
        right: 0;
        z-index: 1;
    }

    [role='menubar'] {
        min-width: v-bind(sidebarWidth);
    }
}
</style>
