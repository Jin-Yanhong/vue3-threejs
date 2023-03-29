import { clearStorage, getStorage, setStorage } from '@/utils/index';
import { defineStore } from 'pinia';
import { loginFormType } from '@/types';

const useUserStore = defineStore({
	id: 'user',
	state: () => ({
		token: getStorage('token')
	}),
	getters: {
		getToken: state => {
			return state.token;
		}
	},
	actions: {
		handleLogin(loginArgs: loginFormType) {
			return new Promise((resolve, reject) => {
				const str = JSON.stringify(loginArgs);
				resolve(str);
			})
				.then(res => {
					const accessToken = res as string;
					setStorage('token', accessToken);
					this.$patch({
						token: accessToken
					});
				})
				.catch(err => {
					this.$patch({
						token: ''
					});
					clearStorage();
				});
		},
		async handleLogout() {
			this.$patch({
				token: ''
			});
			clearStorage();
		}
	}
});

export default useUserStore;
