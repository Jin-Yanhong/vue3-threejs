// 错误类型
export enum requestCode {
    params = 50001,
    queryError = 50002,
    userNotFound = 50003,
    userNotAuthorized = 50004,
    other = 50010,
    success = 20000,
}

export enum windowSize {
    innerWidth = window.innerWidth - 342,
    innerHeight = window.innerHeight - 110,
}
