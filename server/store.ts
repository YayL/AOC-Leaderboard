const _global = new Map();

export const getGlobal = (key: any) => {
	return _global.get(key);
}

export const setGlobal = (key: any, value: any) => {
	_global.set(key, value);
}

export const hasGlobal = (key: any) => {
	return _global.has(key);
}
