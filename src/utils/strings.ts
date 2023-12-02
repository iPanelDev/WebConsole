import { getSettings } from '@/utils/settingsManager';
import { encode } from 'html-entities';

/**
 * 颜色码
 */
const colorCodes = [
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '100',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
];

/**
 * 正则表达式
 */
const patten = /\[(.+?)m(.*)/;

/**
 * 颜色代码转义
 * @param line
 * @returns html文本
 */
export function convert(line = '') {
    line = encode(line).replace(/\s/g, '&ensp;');

    if (!line || !line.includes('\x1b')) {
        return line;
    } else if (!getSettings().colorfulOutput) {
        return line.replace(/\x1b\[.*?m/g, '');
    }

    const outputs = [];
    const group = line.trimStart().split('\x1b');
    for (var i = 0; i < group.length; i++) {
        const match = patten.exec(group[i]);
        if (match == null) continue;

        const argGroup = match[1].split(';');

        const styles = [];
        const classes = [];

        for (var index = 0; index < argGroup.length; index++) {
            let childArg = argGroup[index];

            if (childArg == '1') styles.push('font-weight:bold');
            else if (childArg == '3') styles.push('font-style: italic');
            else if (childArg == '4') styles.push('text-decoration: underline');
            else if (
                argGroup[index + 1] == '2' &&
                index + 4 <= argGroup.length
            ) {
                if (childArg == '38')
                    styles.push(
                        `color: rgb(${argGroup[index + 2]},${
                            argGroup[index + 3]
                        },${argGroup[index + 4]})`
                    );
                else if (childArg == '48')
                    styles.push(
                        `background-color: rgb(${argGroup[index + 2]},${
                            argGroup[index + 3]
                        },${argGroup[index + 4]})`
                    );
            } else if (colorCodes.includes(childArg))
                classes.push(`ansi-${childArg}`);
        }
        outputs.push(
            `<span style="${styles.join(';')}" class="${classes.join(' ')}">${
                match[2]
            }</span>`
        );
    }
    return outputs.join('');
}

export function formatTimespanString(span: number) {
    if (span < 60) return `${span.toFixed(1)}秒`;
    if (span < 60 * 60) return `${(span / 60).toFixed(1)}分钟`;
    if (span < 60 * 60 * 24) return `${(span / 60 / 60).toFixed(1)}小时`;
    return `${(span / 60 / 60 / 24).toFixed(1)}天`;
}

export function formatFileSize(size: number) {
    if (size == null || size == undefined || size < 0) return '';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    if (size < 1024 * 1024 * 1024)
        return `${(size / 1024 / 1024).toFixed(1)}MB`;
    if (size < 1024 * 1024 * 1024 * 1024)
        return `${(size / 1024 / 1024 / 1024).toFixed(1)}GB`;
    return `${(size / 1024 / 1024 / 1024 / 1024 / 1024).toFixed(1)}TB`;
}
