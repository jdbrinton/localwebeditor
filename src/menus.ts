import { Menu, MenuBar } from '@lumino/widgets';
import { CommandRegistry } from '@lumino/commands';

export function createFileMenu(commands: CommandRegistry): Menu {
    let fileMenu = new Menu({ commands });
    fileMenu.title.label = 'File';
    fileMenu.title.mnemonic = 0;
    fileMenu.addItem({ command: 'file:new' });
    fileMenu.addItem({ command: 'file:open-directory' });
    fileMenu.addItem({ command: 'file:save' });
    fileMenu.addItem({ command: 'file:save-as' });
    fileMenu.addItem({ command: 'file:close' });
    return fileMenu;
}

export function createEditMenu(commands: CommandRegistry): Menu {
    let editMenu = new Menu({ commands });
    editMenu.title.label = 'Edit';
    editMenu.title.mnemonic = 0;
    editMenu.addItem({ command: 'edit:undo' });
    editMenu.addItem({ command: 'edit:redo' });
    editMenu.addItem({ command: 'edit:cut' });
    editMenu.addItem({ command: 'edit:copy' });
    editMenu.addItem({ command: 'edit:paste' });
    editMenu.addItem({ command: 'edit:select-all' });
    return editMenu;
}

export function createViewMenu(commands: CommandRegistry): Menu {
    let viewMenu = new Menu({ commands });
    viewMenu.title.label = 'View';
    viewMenu.title.mnemonic = 0;
    viewMenu.addItem({ command: 'view:toggle-directory-viewer' });
    viewMenu.addItem({ command: 'view:toggle-status-bar' });
    viewMenu.addItem({ command: 'view:toggle-command-palette' });
    let appearanceMenu = new Menu({ commands });
    appearanceMenu.title.label = 'Appearance';
    appearanceMenu.addItem({ command: 'theme:light' });
    appearanceMenu.addItem({ command: 'theme:dark' });
    appearanceMenu.addItem({ command: 'theme:high-contrast' });
    viewMenu.addItem({ type: 'submenu', submenu: appearanceMenu });
    return viewMenu;
}

export function createThemeToggleButton(applyTheme: (theme: string) => void): HTMLElement {
    let themeButton = document.createElement('button');
    themeButton.id = 'themeToggleButton';
    themeButton.className = 'theme-toggle-button';
    let themes = ['light', 'dark', 'high-contrast'];
    let currentThemeIndex = themes.indexOf(localStorage.getItem('theme') || 'light');
    setButtonIcon(themeButton, themes[currentThemeIndex]);
    themeButton.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        let theme = themes[currentThemeIndex];
        applyTheme(theme);
        setButtonIcon(themeButton, theme);
    });
    return themeButton;
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
