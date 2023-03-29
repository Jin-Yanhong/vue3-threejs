<template>
	<div class="fullScreen" v-loading.fullscreen="fullscreenLoading"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import router from '@/router/index';
import { LocationQuery, RouteLocationNormalizedLoaded, useRoute } from 'vue-router';

const currentRoute: RouteLocationNormalizedLoaded = useRoute();

const fullscreenLoading = ref(false);

onMounted(() => {
	fullscreenLoading.value = true;
	const path: LocationQuery = currentRoute.query;
	router.replace({
		path: path.redirect as string
	});
});
</script>

<style lang="less" scoped>
.fullScreen {
	width: 100vw;
	height: 100vh;
}
</style>
