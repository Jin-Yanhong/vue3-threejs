<template>
    <div class="appMain">
        <router-view />
        <div class="copyrightContainer">
            {{ copyright }}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import settings from '@/settings';
export default defineComponent({
    name: 'App_Main',
    setup(props, ctx) {
        const defaultRouter = ref('/');
        const current = useRoute();

        const copyright = ref<string>(settings.appConfig.copyright);
        return {
            current,
            defaultRouter,

            copyright,
        };
    },
});
</script>

<style lang="less" scoped>
@import '@/assets/style/variable.less';
.appMain {
    position: relative;
}
.copyrightContainer {
    position: absolute;
    width: calc(100% - @layout-gap);
    height: 32px;
    padding-left: @layout-gap;
    line-height: 32px;
    background: @color-theme;
    color: @color-light;
    bottom: 0;
    right: 0;
}
</style>
