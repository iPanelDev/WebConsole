import {
    mdiApplicationOutline,
    mdiCodeBraces,
    mdiCogOutline,
    mdiFileDocument,
    mdiFileImage,
    mdiFileOutline,
    mdiGit,
    mdiLanguageC,
    mdiLanguageCpp,
    mdiLanguageCsharp,
    mdiLanguageCss3,
    mdiLanguageGo,
    mdiLanguageHtml5,
    mdiLanguageJava,
    mdiLanguageJavascript,
    mdiLanguageMarkdown,
    mdiLanguageTypescript,
    mdiVideo,
    mdiZipBox,
} from '@mdi/js';

export function getIcon(file: string) {
    if (file.includes('.')) {
        switch (file.substring(file.lastIndexOf('.') + 1).toLowerCase()) {
            case 'es':
            case 'es6':
            case 'es5':
            case 'js':
                return mdiLanguageJavascript;

            case 'ts':
                return mdiLanguageTypescript;

            case 'md':
            case 'mdx':
            case 'markdown':
                return mdiLanguageMarkdown;

            case 'java':
                return mdiLanguageJava;

            case 'html':
            case 'htm':
                return mdiLanguageHtml5;

            case 'cs':
                return mdiLanguageCsharp;

            case 'c':
                return mdiLanguageC;

            case 'cpp':
                return mdiLanguageCpp;

            case 'css':
                return mdiLanguageCss3;

            case 'go':
                return mdiLanguageGo;

            case 'txt':
                return mdiFileDocument;

            case 'ini':
            case 'cfg':
            case 'config':
            case 'properties':
                return mdiCogOutline;

            case 'exe':
            case 'msi':
                return mdiApplicationOutline;

            case 'json':
            case 'json5':
            case 'jsonc':
                return mdiCodeBraces;

            case 'gitattribute':
            case 'gitignore':
                return mdiGit;

            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
                return mdiZipBox;

            case 'bmp':
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'webp':
            case 'psd':
                return mdiFileImage;

            case 'avi':
            case 'mp4':
                return mdiVideo;
        }
    }
    return mdiFileOutline;
}
