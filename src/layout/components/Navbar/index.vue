<template>
    <div class="navbar flex">
        <div class="logo flex-center">
            <span class="img">logo </span>
            <span class="name" @click="toHome">
                {{ appName }}
            </span>
        </div>
        <div class="contentNav">
            <ul class="flex-start">
                <li v-for="nav in contentNav" :key="nav.id" :class="currentPath == nav.path ? 'current' : ''" @click="switchNav(nav)">
                    {{ nav.label }}
                </li>
            </ul>
        </div>
        <div class="nav flex-end">
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <span class="userCenter"> User Center </span>
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="handleLogout">
                            <el-icon>
                                <SwitchButton />
                            </el-icon>
                            Logout
                        </el-dropdown-item>
                        <el-dropdown-item @click="drawer = true">
                            <el-icon><Setting /></el-icon>
                            打开设置
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>

        <el-drawer v-model="drawer" title="系统设置" direction="rtl" :close-on-click-modal="false">
            <div class="flex-between">
                <span> 系统主题色 </span>

                <span>
                    <el-color-picker v-model="themeColor" />
                    <span>{{ themeColor }} </span>
                </span>
            </div>

            <ElDivider />
            <div class="flex-between">
                <span> 菜单布局 </span>
                <el-radio-group v-model="menuLayout">
                    <el-radio-button label="horizontal" />
                    <el-radio-button label="vertical" />
                </el-radio-group>
            </div>
        </el-drawer>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { ArrowDown, SwitchButton, Setting } from '@element-plus/icons-vue';
import useAppStore from '@/store/app';
import useUserStore from '@/store/user';
import { contentNavType } from '@/types';
import { enumMenuLayout } from '@/enum';
import settings from '@/settings';
import router from '@/router';

const app = useAppStore();
const user = useUserStore();
const drawer = ref<boolean>(false);
const themeColor = ref<string>('#409EFF');
const menuLayout = ref<enumMenuLayout>(enumMenuLayout.horizontal);
const sidebarWidth = ref<string>(settings.appConfig.layOut.menuWidth);
const appName = ref<string>(settings.appConfig.name);
const contentNav = ref<Array<contentNavType>>([
    { id: 1, label: 'chapter-01', path: 'chapter-01' },
    { id: 2, label: 'chapter-02', path: 'chapter-02' },
    { id: 3, label: 'chapter-03', path: 'chapter-03' },
    { id: 4, label: 'chapter-04', path: 'chapter-04' },
    { id: 4, label: 'chapter-05', path: 'chapter-05' },
    { id: 4, label: 'chapter-06', path: 'chapter-06' },
    { id: 4, label: 'chapter-07', path: 'chapter-07' },
    { id: 4, label: 'chapter-08', path: 'chapter-08' },
]);
const currentPath = ref<string>(contentNav.value[0].path);

app.changeCurrentPath(currentPath.value);

function handleLogout(): void {
    ElMessageBox.confirm('Are you confirm to logout ?', 'Warning', {
        confirmButtonText: 'I conform',
        cancelButtonText: 'Cancle',
        type: 'warning',
    }).then(() => {
        user.handleLogout();
        location.reload();
    });
}

function switchNav(nav: contentNavType) {
    currentPath.value = nav.path;
    app.changeCurrentPath(nav.path);
}

function toHome() {
    router.push('/');
}
</script>
<style lang="less" scoped>
@import '@/assets/style/variable.less';

.navbar {
    background-color: @color-layout-bg-navbar;
    .logo {
        width: v-bind(sidebarWidth);
        color: #fff;
        user-select: none;
        .img {
            margin-right: @layout-gap;
        }
        .name {
            cursor: pointer;
            &:hover {
                color: @color-active;
            }
        }
    }
    .contentNav {
        ul {
            padding-left: 2 * @layout-gap;
            li {
                text-align: center;
                cursor: pointer;
                box-sizing: border-box;
                color: @color-light;
                height: 58px;
                line-height: 58px;
                margin: 0 2 * @layout-gap;
                border-bottom: 4px solid transparent;
                transition: all 0.2s;
            }
            .current {
                border-bottom: 4px solid #fbc531;
                height: 58px;
            }
        }
    }
    .userCenter {
        color: #fff;
        line-height: 58px;
        cursor: pointer;
    }
    .nav {
        flex: 1;
        padding: 0 @layout-gap;
    }
}
</style>
