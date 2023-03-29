export function setStorage(key: string, value: any): void {
    const str = JSON.stringify({
        [key]: value
    });
    window.localStorage.setItem(key, str);
}

export function clearStorage(): void {
    window.localStorage.clear();
}

export function getStorage(key: string): string {
    const str: string = window.localStorage.getItem(key) ?? '';
    try {
        if (str) {
            return JSON.parse(str)[key];
        } else {
            return '';
        }
    } catch (error: any) {
        return '';
    }
}
