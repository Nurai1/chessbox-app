import { SortOrder } from 'src/constants/sortOrder'

export const sortFunc = <T>(a: T, b: T, key: keyof T, sortOrder: string) => {
	if (sortOrder === SortOrder.ASC) {
		if ((a[key] as string) < (b[key] as string)) {
			return -1;
		}
		if ((a[key] as string) > (b[key] as string)) {
			return 1;
		}
		return 0;
	}

	if ((a[key] as string) < (b[key] as string)) {
		return 1;
	}
	if ((a[key] as string) > (b[key] as string)) {
		return -1;
	}
	return 0;
}
