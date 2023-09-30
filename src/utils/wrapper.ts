import { convertToCamelCase } from "@/utils/strings";

export function unwrap<T extends Record<string, any>>(obj: T): T {
    if (typeof obj != "object") {
        return obj;
    }

    const result: Record<string, any> = {};
    for (const kv of Object.entries(obj)) {
        result[convertToCamelCase(String(kv[0]))] = kv[1];
    }
    return result as T;
}
