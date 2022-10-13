<template>
  <div class="navbar flex">
    <div class="flex-between-column">
      <div style="flex-grow: 2">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadcrumbList" :key="item.path" :to="{ path: item.path }"> {{ item.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-tag class="tagsView" :effect="current.path === homeURI ? 'dark' : 'light'">
          <router-link :class="['noActive', current.path === homeURI ? ' Active' : '']" :to="{ path: '/' }"> 02-first-scene </router-link>
        </el-tag>
        <el-tag class="tagsView" v-for="tag in tagViews" :key="tag.path" closable @close="tagClose(tag)" :effect="tag.isActive ? 'dark' : 'light'">
          <router-link :class="['noActive', tag.isActive ? ' Active' : '']" :to="tag.path">
            {{ tag.title }}
          </router-link>
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AppMain from '@/layout/components/AppMain.vue';
import SidebarItem from '@/layout/components/Sidebar/SidebarItem.vue';
import { routes } from '@/router';
import { homePath, memuBgColor } from '@/setting';
import { ArrowDown, Document, Menu as IconMenu, Setting, SwitchButton } from '@element-plus/icons-vue';
import { defineComponent, ref } from 'vue';
import { RouteLocationMatched, useRoute } from 'vue-router';

interface tagViewsType {
  title: string;
  path: string;
  isActive: boolean;
}

export default defineComponent({
  name: 'nav_Bar',
  setup() {
    const homeURI = homePath;
    const routerList = routes;
    const bgColor = memuBgColor;
    const current = useRoute();
    let breadcrumbList = ref<Array<RouteLocationMatched>>(current.matched);
    let tagViews = ref<Array<tagViewsType>>([]);
    return {
      bgColor,
      routerList,
      current,
      breadcrumbList,
      tagViews,
      homeURI,
    };
  },
  components: {
    AppMain,
    Document,
    IconMenu,
    Setting,
    SidebarItem,
    ArrowDown,
    SwitchButton,
  },
  watch: {
    $route: function (nVal, oVal) {
      this.breadcrumbList = nVal.matched;
      let item: tagViewsType = {
        title: nVal.meta?.title,
        path: nVal.path,
        isActive: true,
      };
      if (nVal.path === this.homeURI) {
        this.tagViews = this.tagViews.map(el => {
          return { ...el, isActive: false };
        });
      } else {
        this.tagViews = this.tagViews.map(el => {
          return { ...el, isActive: el.path === item.path };
        });

        let hasTag =
          this.tagViews.filter(el => {
            return el.path === item.path;
          }).length === 1;

        if (!hasTag) {
          this.tagViews.push({
            title: nVal.meta?.title,
            path: nVal.path,
            isActive: true,
          });
        }
      }
    },
  },
  computed: {
    activeMenu(): string {
      const route = this.$route;
      const path = route.path;
      return path;
    },
  },
  methods: {
    tagClose(tag: tagViewsType) {
      if (this.tagViews.length === 1) {
        return;
      } else {
        let index = this.tagViews.indexOf(tag);
        this.tagViews.splice(index, 1);
      }
    },
  },
});
</script>
<style lang="scss" scoped>
@import '@/style/variables.scss';

.navbar {
  background-color: v-bind(bgColor);
  padding-left: 12px;
  .userCenter {
    color: #fff;
    line-height: 58px;
    cursor: pointer;
  }

  .flex-between-column {
    height: 100%;
  }
  ::v-deep(.el-tag) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  ::v-deep(.el-breadcrumb) {
    line-height: 34px;
    .el-breadcrumb__inner {
      color: #fff !important;
    }
  }
  .noActive {
    color: var(--el-color-primary);
  }

  .Active {
    color: #fff;
  }
}
</style>
