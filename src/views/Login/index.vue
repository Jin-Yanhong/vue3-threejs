<template>
	<div class="page flex-center">
		<div class="loginForm">
			<el-card shadow="never">
				<template #header>
					<div class="card-header">
						<span>Welcome to {{ AppName }}</span>
					</div>
				</template>
				<ElForm :model="form" :label-width="labelWidth" label-position="left" ref="loginFormRef" :rules="rules">
					<el-form-item label="User Name" prop="userName" required>
						<el-input v-model="form.userName" autocomplete="off" placeholder="your user name" />
					</el-form-item>
					<el-form-item label="User Password" prop="passWord" required>
						<el-input type="password" v-model="form.passWord" placeholder="password" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit(loginFormRef)">Login</el-button>
					</el-form-item>
				</ElForm>
			</el-card>
		</div>
	</div>
</template>

<script lang="ts" setup>
import settings from '@/settings';
import router from '@/router/index';
import { loginFormType } from '@/types';
import useUserStore from '@/store/user';
import { onMounted, reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { LocationQuery, RouteLocationNormalizedLoaded, useRoute } from 'vue-router';

const form = reactive<loginFormType>({ userName: 'admin', passWord: 'admin' });
const AppName = ref<string>('');
const user = useUserStore();
const labelWidth = ref('140px');
const loginFormRef = ref<FormInstance>();
const rules = reactive<FormRules>({
	userName: [
		{
			required: true,
			message: 'Please input user name',
			trigger: 'blur'
		}
	],
	passWord: [
		{
			required: true,
			message: 'Please select user password',
			trigger: 'change'
		}
	]
});

const currentRoute: RouteLocationNormalizedLoaded = useRoute();

function onSubmit(formEl: FormInstance | undefined) {
	if (!formEl) return;
	formEl.validate(async valid => {
		if (valid) {
			user.handleLogin(form).then(() => {
				setTimeout(() => {
					const path: LocationQuery = currentRoute.query;

					if (path.redirect) {
						router.replace({
							path: '/redirect',
							query: path
						});
					} else {
						router.replace('/dashboard');
					}
				}, 200);
			});
		}
	});
}

onMounted(() => {
	AppName.value = settings.appConfig.name as string;
});
</script>
<style lang="less" scoped>
@import "@/assets/style/variable.less";

.page {
	height: 100vh;
	background: #1abc9c;

	.loginForm {
		width: 400px;
		:deep(.el-form-item__content) {
			width: calc(100% - v-bind(labelWidth));
		}
	}
}
</style>
