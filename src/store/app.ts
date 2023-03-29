import { defineStore } from 'pinia';

const useAppStore = defineStore({
    id: 'app',
    state: () => ({
        theme: 'light',
        currentPath: 'system'
    }),
    getters: {
        getTheme: state => {
            return state.theme;
        },
        getCurrentPath: state => {
            return state.currentPath;
        }
    },
    actions: {
        switchTheme: function () {
            this.theme = this.theme == 'light' ? 'dark' : 'light';
        },
        changeCurrentPath: function (state: string) {
            this.currentPath = state;
        }
    }
});

export default useAppStore;
