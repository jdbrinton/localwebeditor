import { CommandRegistry } from '@lumino/commands';
import { CommandPalette, DockPanel, Widget, BoxPanel, TabBar } from '@lumino/widgets';
import { ContentWidget } from './widgets/ContentWidget';
import { DirectoryViewerWidget } from './widgets/DirectoryViewerWidget';
import { applyTheme, setButtonIcon } from './utils';
import * as monaco from 'monaco-editor';

export function registerCommands(
    commands: CommandRegistry,
    palette: CommandPalette,
    dock: DockPanel,
    directoryViewer: DirectoryViewerWidget,
    leftPanel: BoxPanel,
    statusBar: Widget,
    themeToggleButton: HTMLElement
): void {
    commands.addCommand('file:new', {
        label: 'New File',
        mnemonic: 0,
        execute: () => {
            let name = 'untitled.txt';
            let content = '';
            let contentWidget = new ContentWidget(name, content);
            dock.addWidget(contentWidget);
            dock.activateWidget(contentWidget);
        },
    });

    commands.addCommand('file:open-directory', {
        label: 'Open Directory',
        mnemonic: 5,
        caption: 'Open a directory and display its files',
        execute: async () => {
            try {
                if ('showDirectoryPicker' in window) {
                    const directoryHandle = await window.showDirectoryPicker();
                    await directoryViewer.setDirectoryHandle(directoryHandle);
                } else {
                    alert('File System Access API is not supported in this browser.');
                }
            } catch (err) {
                console.error(err);
            }
        },
    });

    commands.addCommand('file:save', {
        label: 'Save',
        mnemonic: 0,
        execute: async () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                let fileHandle = current.getFileHandle();
                if (fileHandle) {
                    try {
                        const writable = await fileHandle.createWritable();
                        await writable.write(current.getEditorContent());
                        await writable.close();
                        console.log('File saved.');
                    } catch (error) {
                        console.error('Error saving file:', error);
                    }
                } else {
                    await commands.execute('file:save-as');
                }
            }
        },
    });

    commands.addCommand('file:save-as', {
        label: 'Save As...',
        mnemonic: 5,
        execute: async () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                try {
                    if ('showSaveFilePicker' in window) {
                        const fileHandle = await window.showSaveFilePicker();
                        const writable = await fileHandle.createWritable();
                        await writable.write(current.getEditorContent());
                        await writable.close();
                        current.setFileHandle(fileHandle);
                        console.log('File saved as:', fileHandle.name);
                    } else {
                        alert('File System Access API is not supported in this browser.');
                    }
                } catch (error) {
                    console.error('Error saving file:', error);
                }
            }
        },
    });

    commands.addCommand('file:close', {
        label: 'Close',
        mnemonic: 0,
        execute: () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                current.close();
            }
        },
    });

    commands.addCommand('edit:undo', {
        label: 'Undo',
        mnemonic: 0,
        execute: () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                let editor = current.getEditor();
                if (editor) {
                    editor.trigger('keyboard', 'undo', null);
                }
            }
        },
    });

    commands.addCommand('edit:redo', {
        label: 'Redo',
        mnemonic: 0,
        execute: () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                let editor = current.getEditor();
                if (editor) {
                    editor.trigger('keyboard', 'redo', null);
                }
            }
        },
    });

    commands.addCommand('edit:cut', {
        label: 'Cut',
        mnemonic: 1,
        iconClass: 'fa fa-cut',
        execute: () => {
            document.execCommand('cut');
        },
    });

    commands.addCommand('edit:copy', {
        label: 'Copy',
        mnemonic: 0,
        iconClass: 'fa fa-copy',
        execute: () => {
            document.execCommand('copy');
        },
    });

    commands.addCommand('edit:paste', {
        label: 'Paste',
        mnemonic: 0,
        iconClass: 'fa fa-paste',
        execute: () => {
            document.execCommand('paste');
        },
    });

    commands.addCommand('edit:select-all', {
        label: 'Select All',
        mnemonic: 7,
        execute: () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                let editor = current.getEditor();
                if (editor) {
                    editor.trigger('keyboard', 'selectAll', null);
                }
            }
        },
    });

    commands.addCommand('view:toggle-directory-viewer', {
        label: 'Toggle Directory Viewer',
        mnemonic: 7,
        execute: () => {
            if (leftPanel.isHidden) {
                leftPanel.show();
            } else {
                leftPanel.hide();
            }
        },
    });

    commands.addCommand('view:toggle-status-bar', {
        label: 'Toggle Status Bar',
        mnemonic: 7,
        execute: () => {
            if (statusBar.isHidden) {
                statusBar.show();
            } else {
                statusBar.hide();
            }
        },
    });

    commands.addCommand('view:toggle-command-palette', {
        label: 'Toggle Command Palette',
        mnemonic: 7,
        execute: () => {
            if (palette.isHidden) {
                palette.show();
            } else {
                palette.hide();
            }
        },
    });

    commands.addCommand('theme:light', {
        label: 'Light Theme',
        execute: () => {
            applyTheme('light');
            setButtonIcon(themeToggleButton, 'light');
        },
    });

    commands.addCommand('theme:dark', {
        label: 'Dark Theme',
        execute: () => {
            applyTheme('dark');
            setButtonIcon(themeToggleButton, 'dark');
        },
    });

    commands.addCommand('theme:high-contrast', {
        label: 'High-Contrast Dark Theme',
        execute: () => {
            applyTheme('high-contrast');
            setButtonIcon(themeToggleButton, 'high-contrast');
        },
    });

    commands.addCommand('example:split-left', {
        label: 'Split left',
        execute: () => doSplit('split-left'),
    });

    commands.addCommand('example:split-right', {
        label: 'Split right',
        execute: () => doSplit('split-right'),
    });

    commands.addCommand('example:split-top', {
        label: 'Split top',
        execute: () => doSplit('split-top'),
    });

    commands.addCommand('example:split-bottom', {
        label: 'Split bottom',
        execute: () => doSplit('split-bottom'),
    });

    commands.addCommand('save-dock-layout', {
        label: 'Save Layout',
        caption: 'Save the current dock layout',
        execute: () => {
            savedLayouts.push(dock.saveLayout());
            palette.addItem({
                command: 'restore-dock-layout',
                category: 'Dock Layout',
                args: { index: savedLayouts.length - 1 },
            });
        },
    });

    commands.addCommand('restore-dock-layout', {
        label: (args) => {
            return `Restore Layout ${args.index as number}`;
        },
        execute: (args) => {
            dock.restoreLayout(savedLayouts[args.index as number]);
        },
    });

    commands.addCommand('view:toggle-add-button', {
        label: 'Toggle Add Button',
        mnemonic: 0,
        caption: 'Toggle Add Button',
        execute: () => {
            dock.addButtonEnabled = !dock.addButtonEnabled;
        },
    });

    commands.addKeyBinding({
        keys: ['Accel X'],
        selector: 'body',
        command: 'edit:cut',
    });

    commands.addKeyBinding({
        keys: ['Accel C'],
        selector: 'body',
        command: 'edit:copy',
    });

    commands.addKeyBinding({
        keys: ['Accel V'],
        selector: 'body',
        command: 'edit:paste',
    });

    commands.addKeyBinding({
        keys: ['Accel A'],
        selector: 'body',
        command: 'edit:select-all',
    });

    commands.addKeyBinding({
        keys: ['Accel Z'],
        selector: 'body',
        command: 'edit:undo',
    });

    commands.addKeyBinding({
        keys: ['Accel Shift Z'],
        selector: 'body',
        command: 'edit:redo',
    });

    palette.addItem({
        command: 'file:new',
        category: 'File',
        rank: 1,
    });
    palette.addItem({
        command: 'file:open-directory',
        category: 'File',
        rank: 2,
    });
    palette.addItem({
        command: 'file:save',
        category: 'File',
        rank: 3,
    });
    palette.addItem({
        command: 'file:save-as',
        category: 'File',
        rank: 4,
    });
    palette.addItem({
        command: 'save-dock-layout',
        category: 'Dock Layout',
        rank: 0,
    });

    let savedLayouts: DockPanel.ILayoutConfig[] = [];

    function doSplit(mode: DockPanel.InsertMode) {
        let ref = ContentWidget.menuFocus;
        if (ref) {
            let name = 'untitled.txt';
            let content = '';
            let widget = new ContentWidget(name, content);
            dock.addWidget(widget, { mode: mode, ref: ref });
        }
    }
}
