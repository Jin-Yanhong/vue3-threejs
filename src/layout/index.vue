<template>
    <div class="app-container">
        <Sidebar class="sidebar" />
        <AppMain class="appMain" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppMain from './components/AppMain.vue';
import Sidebar from './components/Sidebar/index.vue';
export default defineComponent({
    setup() {
        return {};
    },
    name: 'ViewLayout',
    components: {
        Sidebar,
        AppMain
    }
});
</script>
<style lang="scss" scoped>
.app-container {
    display: grid;
    grid-template-rows: 100vh;
    grid-template-columns: [r1] 300px [r2] calc(100vw - 300px) [r3];

    .sidebar {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 1;
        grid-column-end: 2;
    }
    .appMain {
        grid-row-start: 1;
        grid-row-end: 2;
        grid-column-start: 2;
        grid-column-end: 2;
    }
}
</style>
