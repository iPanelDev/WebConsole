const defaultSettings: Settings = {
    colorfulOutput: true,
    saveOutput: true,
    maxCacheLines: 500,
};

declare type Settings = {
    colorfulOutput: boolean;
    saveOutput: boolean;
    maxCacheLines: number;
};

function loadSettings() {
    try {
        const text = localStorage["ipanel.setttings"];
        if (!text) throw new TypeError("设置为空");
        return JSON.parse(text) as Settings;
    } catch (error) {
        console.error("加载设置失败", error);
        saveSettings();
    }
}

let settings = loadSettings() || defaultSettings;

export const getSettings = () => settings;

export function saveSettings(newSettings?: Settings) {
    settings = newSettings;
    localStorage["ipanel.setttings"] = JSON.stringify(
        newSettings ?? defaultSettings
    );
}
