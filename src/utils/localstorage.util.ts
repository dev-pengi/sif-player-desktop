type LocalStorageTypes = 'string' | 'number' | 'boolean';

function extractLocalStorage<T extends LocalStorageTypes>(key: string, defaultValue: T extends 'boolean' ? boolean : (T extends 'number' ? number : string), type: T, conditionCb?: ((value: any) => boolean)): T extends 'boolean' ? boolean : (T extends 'number' ? number : string) {
    const value = localStorage.getItem(key);
    if (value === null || (conditionCb && !conditionCb(value))) {
        localStorage.setItem(key, String(defaultValue));
        return defaultValue;
    }
    if (type === "boolean") {
        return (value === "true") as any;
    }
    else if (type === "number") {
        return Number(value) as any;
    }
    return value as any;
}

export { extractLocalStorage };