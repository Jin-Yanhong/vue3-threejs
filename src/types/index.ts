export interface RouteConfig {
    path: string;
    name: string;
    redirect?: string;
    component: string;
    meta: {
        title?: string;
        icon?: string;
        affix?: boolean;
    };
    children?: Array<RouteConfig>;
}
