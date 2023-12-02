import { listUsers } from './requests';

export async function validateUsername(username: string) {
    if (!username || username.length < 3) throw '用户名长度过短';

    if (
        username.includes("'") ||
        username.includes('"') ||
        username.includes('\x20') ||
        username.includes('@')
    )
        throw '用户名不得含有空格和特殊字符';

    if (Object.keys(await listUsers()).includes(username))
        throw '与已有的用户名重复';
}

export function validatePwd(pwd?: string) {
    if (!pwd || pwd.length < 6) throw '密码长度至少为6';

    if (
        pwd.includes("'") ||
        pwd.includes('"') ||
        pwd.includes('\x20') ||
        pwd.includes('@')
    )
        throw '密码不得含有空格和特殊字符';
}
