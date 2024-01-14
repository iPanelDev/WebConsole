<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormControl from '@/components/FormControl.vue';
import FormField from '@/components/FormField.vue';
import InstanceSelector from '@/components/InstanceSelector.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import UsersTable from '@/components/UsersTable.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { createNotify } from '@/notification';
import { callWhenLogined, permissionLevel } from '@/service';
import {
    createUser,
    editUser,
    listInstances,
    listUsers,
    removeUser,
} from '@/service/requests';
import { useServiceStore } from '@/service/store';
import { User } from '@/service/types';
import { validatePwd, validateUsername } from '@/service/user';
import {
    mdiAccountCard,
    mdiAccountMultiple,
    mdiAccountPlus,
    mdiAccountSettings,
    mdiAlertCircle,
    mdiFormTextboxPassword,
    mdiPencil,
    mdiRefresh,
} from '@mdi/js';
import { ref } from 'vue';

const serviceStore = useServiceStore();

const users = ref([]);
callWhenLogined(updateUsers);

async function updateUsers() {
    users.value = [];
    const dict = {};

    for (const kv of Object.entries(await listUsers())) {
        dict[kv[0]] = kv[1];
    }
    users.value = Array.from(Object.entries(dict as Record<string, User>));
}

const permissionLevelDict = permissionLevel.map((v, i) => ({
    id: i,
    label: v,
}));

const instances = ref({} as Record<string, [boolean, string?]>);
const userName = ref('');
const isRemoveFormActive = ref(false);
const isEditFormActive = ref(false);
const isCreateFormActive = ref(false);
const user = ref({
    instances: [],
} as User & { _level?: { id: number; label: string } });

function showRemoveComfirm(name: string) {
    userName.value = name;
    isRemoveFormActive.value = true;
}

async function updateInstanceArray(user: User) {
    const dict: Record<string, [boolean, string?]> = {};
    for (const instance of await listInstances())
        dict[instance.instanceId] = [
            user.instances.includes(instance.instanceId),
            instance.customName,
        ];

    const added = Object.keys(dict);
    user.instances
        .filter((i) => !added.includes(i))
        .forEach((i) => (dict[i] = [true]));

    instances.value = dict;
}

async function showEditForm(name: string) {
    userName.value = name;
    isEditFormActive.value = true;
    user.value = { ...users.value.find((u) => u[0] === name)[1] };
    user.value._level = permissionLevelDict[user.value.level];
    await updateInstanceArray(user.value);
}

async function showCreateForm() {
    userName.value = '';
    isCreateFormActive.value = true;
    user.value = { level: 0, instances: [] } as any;
    user.value._level = permissionLevelDict[user.value.level];
    await updateInstanceArray(user.value);
}

async function _removeUser() {
    try {
        await removeUser(userName.value);
        createNotify({
            type: 'success',
            title: '删除用户成功',
        });
    } catch (error) {
        createNotify({
            type: 'danger',
            title: '删除用户失败',
            message: String(error),
        });
    }
    await updateUsers();
}

async function _editUser() {
    try {
        user.value.level = user.value._level.id;
        user.value._level = undefined;
        user.value.instances = Object.entries(instances.value)
            .filter((i) => i[1][0])
            .map((i) => i[0]);

        if (user.value.password) validatePwd(user.value.password);

        await editUser(userName.value, user.value);
        createNotify({
            type: 'success',
            title: '修改用户成功',
        });
    } catch (error) {
        isEditFormActive.value = true;
        user.value._level = permissionLevelDict[user.value.level];
        createNotify({
            type: 'danger',
            title: '修改用户失败',
            message: String(error),
        });
    }
    await updateUsers();
}

async function _createUser() {
    try {
        await validateUsername(userName.value);
        validatePwd(user.value.password);

        user.value.instances = Object.entries(instances.value)
            .filter((i) => i[1][0])
            .map((i) => i[0]);
        user.value.level = user.value._level.id;
        user.value._level = undefined;

        await createUser(userName.value, user.value);
        createNotify({
            type: 'success',
            title: '创建用户成功',
        });
    } catch (error) {
        isCreateFormActive.value = true;
        createNotify({
            type: 'danger',
            title: '创建用户失败',
            message: String(error),
        });
    }
    await updateUsers();
}

const levelHelpMsg = `▪ 游客:   禁止登录（默认值）
▪ 只读:   仅可查看指定的实例
▪ 助手:   允许控制指定的实例
▪ 管理员: 允许控制所有实例、新建修改删除用户`;

const pwdHelpMsg = `▪ 长度应大于6
▪ 不建议于其他密码相同
▪ 推荐大小写字母数字结合`;

const userNameHelpMsg = `▪ 长度应大于3
▪ 不含有空格和特殊字符（'"\\@）
▪ 不与已有的用户名重复`;

const instanceHelpMsg = `▪ 只有在此处指定的实例才能被只读查看
▪ 只有在此处指定的实例才能被助手查看和管理
▪ 游客禁止登录，管理员总是可以查看并管理所有实例，故二者无法设置可使用的实例`;
</script>
<template>
    <LayoutAuthenticated>
        <SectionMain>
            <NotificationBar
                color="danger"
                :icon="mdiAlertCircle"
                v-if="serviceStore.currentUser?.level != 3"
            >
                <b>权限不足</b>
                你没有权限使用这个页面
            </NotificationBar>
            <SectionTitleLineWithButton
                :icon="mdiAccountMultiple"
                title="用户管理"
                main
            >
                <BaseButtons>
                    <BaseButton
                        :icon="mdiAccountPlus"
                        color="lightDark"
                        @click="showCreateForm"
                    />
                    <BaseButton
                        :icon="mdiRefresh"
                        color="lightDark"
                        @click="updateUsers"
                    />
                </BaseButtons>
            </SectionTitleLineWithButton>

            <CardBoxModal
                v-model="isRemoveFormActive"
                button-label="确认"
                :title="`确定要删除用户“${userName}”吗？`"
                has-cancel
                @confirm="_removeUser"
            >
                此操作不可被撤销
            </CardBoxModal>

            <CardBoxModal
                v-model="isEditFormActive"
                button-label="确认"
                :title="`修改用户“${userName}”`"
                has-cancel
                @confirm="_editUser"
            >
                <FormField label="用户权限" :help="levelHelpMsg">
                    <FormControl
                        v-model="user._level"
                        :options="permissionLevelDict"
                        :icon="mdiAccountSettings"
                    />
                </FormField>
                <FormField
                    label="描述"
                    :help="'▪ 可选\n▪ 仅用于备注用户，不影响用户权限'"
                >
                    <FormControl
                        type="textarea"
                        autocomplete="off"
                        inputmode="text"
                        v-model="user.description"
                        :icon="mdiPencil"
                    />
                </FormField>

                <FormField label="用户可使用的实例" :help="instanceHelpMsg">
                    <InstanceSelector
                        v-model="instances"
                        :disabled="
                            user._level?.id === 0 || user._level?.id == 3
                        "
                    />
                </FormField>

                <FormField
                    label="新的密码"
                    :help="'▪ 可选\n▪ 留空则不修改' + '\n' + pwdHelpMsg"
                >
                    <FormControl
                        :icon="mdiFormTextboxPassword"
                        name="password"
                        type="password"
                        v-model="user.password"
                        autocomplete="new-password"
                    />
                </FormField>
            </CardBoxModal>

            <CardBoxModal
                v-model="isCreateFormActive"
                button-label="确认"
                title="创建用户"
                has-cancel
                @confirm="_createUser"
            >
                <FormField label="用户名" :help="userNameHelpMsg">
                    <FormControl v-model="userName" :icon="mdiAccountCard" />
                </FormField>
                <FormField label="用户权限" :help="levelHelpMsg">
                    <FormControl
                        v-model="user._level"
                        :options="permissionLevelDict"
                    />
                </FormField>

                <FormField label="用户可使用的实例" :help="instanceHelpMsg">
                    <InstanceSelector
                        v-model="instances"
                        :disabled="
                            user._level?.id === 0 || user._level?.id == 3
                        "
                    />
                </FormField>

                <FormField
                    label="描述"
                    :help="'▪ 可选\n▪ 仅用于备注用户，不影响用户权限'"
                >
                    <FormControl
                        type="textarea"
                        autocomplete="off"
                        inputmode="text"
                        v-model="user.description"
                        :icon="mdiPencil"
                    />
                </FormField>

                <FormField label="密码" :help="pwdHelpMsg">
                    <FormControl
                        :icon="mdiFormTextboxPassword"
                        name="password"
                        type="password"
                        v-model="user.password"
                        autocomplete="new-password"
                    />
                </FormField>
            </CardBoxModal>

            <UsersTable
                :users="users"
                @edit="showEditForm"
                @remove="showRemoveComfirm"
            />
        </SectionMain>
    </LayoutAuthenticated>
</template>
