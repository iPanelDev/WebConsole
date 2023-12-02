import { mdiAccountCircle, mdiCog, mdiHome } from '@mdi/js';

export default [
    {
        to: '/overview',
        icon: mdiHome,
        label: '总览',
    },
    {
        to: '/profile',
        label: '个人资料',
        icon: mdiAccountCircle,
    },
    {
        to: '/settings',
        label: '设置',
        icon: mdiCog,
    },
];
