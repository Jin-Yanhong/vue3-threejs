<template>
    <div class="appMain">
        <router-view />
        <keep-alive></keep-alive>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'App_Main',
});
</script>
