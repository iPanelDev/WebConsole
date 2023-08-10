import info from './info';
import { send } from './ws';

export function subscribe(guid: string) {
    send({
        type: 'action',
        sub_type: 'subscribe',
        data: guid
    });
    info.subscribeTarget = guid;
}

export function verify(token: string) {
    send({
        type: 'action',
        sub_type: 'verify',
        data: {
            token: token,
            account: info.account,
            client_type: 'console'
        },
    });
}

export function listInstance() {
    send({
        type: 'action',
        sub_type: 'list_instance'
    });
}