export type loginFormType = {
    userName: string;
    passWord: string;
};

export type responseData = {
    code: number;
    data: Array<any> | any;
    message: string;
};
export type menuConfigType = {
    uniqueOpened: boolean;
    collapseTransition: boolean;
    backgroundColor: string;
    activeTextColor: string;
    textColor: string;
};

export type contentNavType = {
    id: number;
    label: string;
    path: string;
};

export type tagViewsType = {
    title: string;
    path: string;
    isActive: boolean;
};

export type RouterListKey = 'routes' | 'system' | 'flatMap' | 'reliefMap' | 'spaceModel';

export type requestIdleCallback = (res: responseData) => void;
