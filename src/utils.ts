import * as monaco from 'monaco-editor';

export function applyTheme(theme: string): void {
    document.body.dataset.theme = theme;
    let monacoTheme = 'vs';
    if (theme === 'light') {
        monacoTheme = 'vs';
    } else if (theme === 'dark') {
        monacoTheme = 'vs-dark';
    } else if (theme === 'high-contrast') {
        monacoTheme = 'hc-black';
    }
    monaco.editor.setTheme(monacoTheme);
    localStorage.setItem('theme', theme);
}

export function setButtonIcon(button: HTMLElement, theme: string): void {
    button.classList.remove('light-theme-icon', 'dark-theme-icon', 'high-contrast-theme-icon');
    if (theme === 'light') {
        button.classList.add('light-theme-icon');
    } else if (theme === 'dark') {
        button.classList.add('dark-theme-icon');
    } else if (theme === 'high-contrast') {
        button.classList.add('high-contrast-theme-icon');
    }
}
