/**
 * color from `src/assets/style/variable.less`
 */
const themeColor = '#487eb0';
const colorActive = '#fbc531';
const colorLight = '#f5f6fa';

const settings = {
    appConfig: {
        name: 'three.js案例',
        themeColor: themeColor,
        copyright: '@ xxx 团队 版权所有',
        layOut: {
            menuWidth: '320px',
        },
    },
    menuConfig: {
        uniqueOpened: false,
        collapseTransition: true,
        backgroundColor: themeColor,
        textColor: colorLight,
        activeTextColor: colorActive,
    },
};

export default settings;
