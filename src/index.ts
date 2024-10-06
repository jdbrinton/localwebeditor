import { CommandRegistry } from '@lumino/commands';
import { ISignal, Signal } from '@lumino/signaling';
import { Message, MessageLoop } from '@lumino/messaging';
import {
    BoxPanel,
    CommandPalette,
    ContextMenu,
    DockPanel,
    Menu,
    MenuBar,
    TabBar,
    Widget
} from '@lumino/widgets';

import * as monaco from 'monaco-editor';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';

interface FileSystemDirectoryHandle {
    entries(): AsyncIterableIterator<[string, FileSystemDirectoryHandle | FileSystemFileHandle]>;
    kind: 'directory';
    name: string;
}

interface FileSystemFileHandle {
    kind: 'file';
    name: string;
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream {
    write(data: string | BufferSource): Promise<void>;
    close(): Promise<void>;
}

declare global {
    interface Window {
        showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
        showSaveFilePicker: () => Promise<FileSystemFileHandle>;
    }
}

const commands = new CommandRegistry();

function createFileMenu(): Menu {
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

function createEditMenu(): Menu {
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

function createViewMenu(): Menu {
    let viewMenu = new Menu({ commands });
    viewMenu.title.label = 'View';
    viewMenu.title.mnemonic = 0;

    viewMenu.addItem({ command: 'view:toggle-directory-viewer' });
    viewMenu.addItem({ command: 'view:toggle-status-bar' });
    viewMenu.addItem({ command: 'view:toggle-command-palette' });

    return viewMenu;
}

class ContentWidget extends Widget {
    static menuFocus: ContentWidget | null;
    static currentWidget: ContentWidget | null = null; // Added to track current widget

    private editor: monaco.editor.IStandaloneCodeEditor | null = null;
    private initialContent: string;
    private fileHandle: FileSystemFileHandle | null = null;

    constructor(name: string, initialContent: string = '', fileHandle: FileSystemFileHandle | null = null) {
        super();
        this.setFlag(Widget.Flag.DisallowLayout);
        this.addClass('content');

        const safeName = name.toLowerCase().replace(/[^a-z0-9\-_]/g, '-');
        this.addClass(safeName);

        this.title.label = name;
        this.title.closable = true;
        this.title.caption = `Editing: ${name}`;
        this.title.iconClass = 'fa fa-file';

        this.initialContent = initialContent;
        this.fileHandle = fileHandle;

        let widget = this;
        this.node.addEventListener('contextmenu', (event: MouseEvent) => {
            ContentWidget.menuFocus = widget;
        });

        this.node.style.width = '100%';
        this.node.style.height = '100%';
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        this.editor = monaco.editor.create(this.node, {
            value: this.initialContent,
            language: 'javascript',
            automaticLayout: true,
        });
    }

    protected onResize(msg: Widget.ResizeMessage): void {
        super.onResize(msg);
        if (this.editor) {
            this.editor.layout();
        }
    }

    protected onActivateRequest(msg: Message): void {
        if (this.editor) {
            this.editor.focus();
        }
        // Update the currentWidget when activated
        ContentWidget.currentWidget = this;
    }

    protected onBeforeDetach(msg: Message): void {
        if (ContentWidget.menuFocus === this) {
            ContentWidget.menuFocus = null;
        }
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
        super.onBeforeDetach(msg);
    }

    dispose(): void {
        if (this.editor) {
            this.editor.dispose();
            this.editor = null;
        }
        super.dispose();
    }

    getEditorContent(): string {
        return this.editor ? this.editor.getValue() : '';
    }

    getFileHandle(): FileSystemFileHandle | null {
        return this.fileHandle;
    }

    setFileHandle(handle: FileSystemFileHandle): void {
        this.fileHandle = handle;
        this.title.label = handle.name;
        this.title.caption = `Editing: ${handle.name}`;
    }

    // Getter for the editor
    getEditor(): monaco.editor.IStandaloneCodeEditor | null {
        return this.editor;
    }
}

interface DirectoryNode {
    name: string;
    kind: 'file' | 'directory';
    handle: FileSystemDirectoryHandle | FileSystemFileHandle;
    children?: Map<string, DirectoryNode>;
}

class DirectoryViewerWidget extends Widget {
    private container: HTMLElement;
    private rootUl!: HTMLUListElement;
    private directoryHandle: FileSystemDirectoryHandle | null;
    private directoryTree: DirectoryNode | null = null;
    private expandedPaths: Set<string> = new Set();
    private monitorInterval: number | null = null;

    private _fileOpened = new Signal<this, { path: string; handle: FileSystemFileHandle }>(this);

    constructor() {
        super();
        this.addClass('directory-viewer-widget');

        this.container = document.createElement('div');
        this.container.className = 'directory-viewer-container';
        this.node.appendChild(this.container);

        this.directoryHandle = null;

        const openDirButton = document.createElement('button');
        openDirButton.textContent = 'Open Directory';
        openDirButton.classList.add('lm-Button');
        openDirButton.addEventListener('click', () => {
            commands.execute('file:open-directory');
        });
        this.container.appendChild(openDirButton);
    }

    get fileOpened(): ISignal<this, { path: string; handle: FileSystemFileHandle }> {
        return this._fileOpened;
    }

    async setDirectoryHandle(handle: FileSystemDirectoryHandle) {
        this.directoryHandle = handle;

        if (this.monitorInterval !== null) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }

        this.directoryTree = await this.buildDirectoryTree(handle);
        const rootPath = this.directoryTree.name;
        this.expandedPaths.add(rootPath);

        this.container.innerHTML = '';
        this.rootUl = await this.buildDomTree(this.directoryTree);
        this.container.appendChild(this.rootUl);

        this.monitorInterval = window.setInterval(() => {
            this.checkForUpdates();
        }, 5000);
    }

    async buildDirectoryTree(
        handle: FileSystemDirectoryHandle | FileSystemFileHandle,
        path: string = ''
    ): Promise<DirectoryNode> {
        const node: DirectoryNode = {
            name: handle.name,
            kind: handle.kind,
            handle: handle
        };
        const currentPath = path ? `${path}/${handle.name}` : handle.name;
        if (handle.kind === 'directory') {
            node.children = new Map<string, DirectoryNode>();
            for await (const [name, childHandle] of (handle as FileSystemDirectoryHandle).entries()) {
                const childNode = await this.buildDirectoryTree(childHandle, currentPath);
                node.children.set(name, childNode);
            }
        }
        return node;
    }

    async buildDomTree(node: DirectoryNode, path: string = ''): Promise<HTMLUListElement> {
        const ul = document.createElement('ul');
        ul.className = 'directory-tree';

        const li = await this.createDomNode(node, path);
        ul.appendChild(li);

        return ul;
    }

    async createDomNode(node: DirectoryNode, path: string = ''): Promise<HTMLLIElement> {
        const li = document.createElement('li');
        li.className = 'directory-item';
        const currentPath = path ? `${path}/${node.name}` : node.name;
        li.setAttribute('data-path', currentPath);

        const icon = document.createElement('span');
        icon.className = 'directory-icon';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = node.name;

        li.appendChild(icon);
        li.appendChild(nameSpan);

        if (node.kind === 'directory') {
            const ul = document.createElement('ul');
            ul.className = 'nested';

            if (this.expandedPaths.has(currentPath)) {
                li.classList.add('expanded');
                icon.classList.add('fa', 'fa-folder-open');

                for (const [name, childNode] of node.children!) {
                    const childLi = await this.createDomNode(childNode, currentPath);
                    ul.appendChild(childLi);
                }
            } else {
                li.classList.add('collapsed');
                icon.classList.add('fa', 'fa-folder');
            }

            li.addEventListener('click', async (event) => {
                event.stopPropagation();
                if (li.classList.contains('collapsed')) {
                    li.classList.remove('collapsed');
                    li.classList.add('expanded');
                    icon.classList.remove('fa-folder');
                    icon.classList.add('fa-folder-open');
                    this.expandedPaths.add(currentPath);

                    if (!ul.hasChildNodes()) {
                        for (const [name, childNode] of node.children!) {
                            const childLi = await this.createDomNode(childNode, currentPath);
                            ul.appendChild(childLi);
                        }
                    }
                } else {
                    li.classList.remove('expanded');
                    li.classList.add('collapsed');
                    icon.classList.remove('fa-folder-open');
                    icon.classList.add('fa-folder');
                    this.expandedPaths.delete(currentPath);
                }
            });

            li.appendChild(ul);
        } else {
            icon.classList.add('fa', 'fa-file');
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                this._fileOpened.emit({ path: currentPath, handle: node.handle as FileSystemFileHandle });
            });
        }

        return li;
    }

    async checkForUpdates() {
        if (!this.directoryHandle || !this.directoryTree || !this.rootUl) {
            return;
        }

        const newDirectoryTree = await this.buildDirectoryTree(this.directoryHandle);
        await this.updateDomTree(this.directoryTree, newDirectoryTree, this.rootUl.firstElementChild as HTMLElement);
        this.directoryTree = newDirectoryTree;
    }

    async updateDomTree(
        oldNode: DirectoryNode,
        newNode: DirectoryNode,
        domElement: HTMLElement,
        path: string = ''
    ) {
        const currentPath = path ? `${path}/${oldNode.name}` : oldNode.name;

        if (oldNode.kind !== newNode.kind || oldNode.name !== newNode.name) {
            const parentElement = domElement.parentElement;
            const newDomElement = await this.createDomNode(newNode, path);
            parentElement?.replaceChild(newDomElement, domElement);
        } else if (newNode.kind === 'directory') {
            if (this.expandedPaths.has(currentPath)) {
                domElement.classList.add('expanded');
                domElement.classList.remove('collapsed');
            } else {
                domElement.classList.add('collapsed');
                domElement.classList.remove('expanded');
            }

            const domUl = domElement.querySelector('ul');
            if (!domUl) {
                return;
            }

            const oldChildren = oldNode.children!;
            const newChildren = newNode.children!;

            const oldNames = new Set(oldChildren.keys());
            const newNames = new Set(newChildren.keys());

            for (const name of oldNames) {
                if (!newNames.has(name)) {
                    const childDomElement = domUl.querySelector(`[data-path="${currentPath}/${name}"]`);
                    if (childDomElement) {
                        domUl.removeChild(childDomElement);
                    }
                }
            }

            for (const name of newNames) {
                if (!oldNames.has(name)) {
                    const newChildNode = newChildren.get(name)!;
                    const newChildDomElement = await this.createDomNode(newChildNode, currentPath);
                    domUl.appendChild(newChildDomElement);
                }
            }

            for (const name of newNames) {
                if (oldNames.has(name)) {
                    const oldChildNode = oldChildren.get(name)!;
                    const newChildNode = newChildren.get(name)!;
                    const childDomElement = domUl.querySelector(
                        `[data-path="${currentPath}/${name}"]`
                    ) as HTMLElement;
                    if (childDomElement) {
                        await this.updateDomTree(oldChildNode, newChildNode, childDomElement, currentPath);
                    }
                }
            }
        }
    }

    dispose(): void {
        if (this.monitorInterval !== null) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
        }
        super.dispose();
    }
}

function main(): void {
    let directoryViewer = new DirectoryViewerWidget();

    let menuBar = new MenuBar();
    menuBar.addMenu(createFileMenu());
    menuBar.addMenu(createEditMenu());
    menuBar.addMenu(createViewMenu());
    menuBar.id = 'menuBar';

    let palette = new CommandPalette({ commands });
    palette.id = 'palette';

    commands.addCommand('file:new', {
        label: 'New File',
        mnemonic: 0,
        execute: () => {
            let name = 'untitled.js';
            let content = '';
            let contentWidget = new ContentWidget(name, content);
            dock.addWidget(contentWidget);
            dock.activateWidget(contentWidget);
        }
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
        }
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
        }
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
        }
    });

    commands.addCommand('file:close', {
        label: 'Close',
        mnemonic: 0,
        execute: () => {
            let current = ContentWidget.currentWidget;
            if (current) {
                current.close();
            }
        }
    });

    // Edit Commands
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
        }
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
        }
    });

    commands.addCommand('edit:cut', {
        label: 'Cut',
        mnemonic: 1,
        iconClass: 'fa fa-cut',
        execute: () => {
            document.execCommand('cut');
        }
    });

    commands.addCommand('edit:copy', {
        label: 'Copy',
        mnemonic: 0,
        iconClass: 'fa fa-copy',
        execute: () => {
            document.execCommand('copy');
        }
    });

    commands.addCommand('edit:paste', {
        label: 'Paste',
        mnemonic: 0,
        iconClass: 'fa fa-paste',
        execute: () => {
            document.execCommand('paste');
        }
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
        }
    });

    // View Commands
    commands.addCommand('view:toggle-directory-viewer', {
        label: 'Toggle Directory Viewer',
        mnemonic: 7,
        execute: () => {
            if (leftPanel.isHidden) {
                leftPanel.show();
            } else {
                leftPanel.hide();
            }
        }
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
        }
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
        }
    });

    // Key Bindings
    commands.addKeyBinding({
        keys: ['Accel X'],
        selector: 'body',
        command: 'edit:cut'
    });

    commands.addKeyBinding({
        keys: ['Accel C'],
        selector: 'body',
        command: 'edit:copy'
    });

    commands.addKeyBinding({
        keys: ['Accel V'],
        selector: 'body',
        command: 'edit:paste'
    });

    commands.addKeyBinding({
        keys: ['Accel A'],
        selector: 'body',
        command: 'edit:select-all'
    });

    commands.addKeyBinding({
        keys: ['Accel Z'],
        selector: 'body',
        command: 'edit:undo'
    });

    commands.addKeyBinding({
        keys: ['Accel Shift Z'],
        selector: 'body',
        command: 'edit:redo'
    });

    // Context Menu
    let contextMenu = new ContextMenu({ commands });
    document.addEventListener('contextmenu', (event: MouseEvent) => {
        if (event.shiftKey) return;
        if (contextMenu.open(event)) {
            event.preventDefault();
        }
    });

    contextMenu.addItem({ command: 'edit:undo', selector: '.content' });
    contextMenu.addItem({ command: 'edit:redo', selector: '.content' });
    contextMenu.addItem({ type: 'separator', selector: '.content' });
    contextMenu.addItem({ command: 'edit:cut', selector: '.content' });
    contextMenu.addItem({ command: 'edit:copy', selector: '.content' });
    contextMenu.addItem({ command: 'edit:paste', selector: '.content' });
    contextMenu.addItem({ type: 'separator', selector: '.content' });
    contextMenu.addItem({ command: 'file:save', selector: '.content' });
    contextMenu.addItem({ command: 'file:save-as', selector: '.content' });
    contextMenu.addItem({ command: 'file:close', selector: '.content' });

    // Event Listeners
    document.addEventListener('keydown', (event: KeyboardEvent) => {
        commands.processKeydownEvent(event);
    });

    const homeContent = `Welcome to the Application!
This is the landing page. Use the directory viewer to open files.`;
    let homeWidget = new ContentWidget('Home', homeContent);

    let dock = new DockPanel();
    dock.addWidget(homeWidget);
    dock.id = 'dock';

    dock.addRequested.connect((sender: DockPanel, arg: TabBar<Widget>) => {
        let name = 'untitled.js';
        let content = '';
        let w = new ContentWidget(name, content);
        sender.addWidget(w, { ref: arg.titles[0].owner });
    });

    let doSplit = (mode: DockPanel.InsertMode) => {
        let ref = ContentWidget.menuFocus;
        if (ref) {
            let name = 'untitled.js';
            let content = '';
            let widget = new ContentWidget(name, content);
            dock.addWidget(widget, { mode: mode, ref: ref });
        }
    };

    commands.addCommand('example:split-left', {
        label: 'Split left',
        execute: () => doSplit('split-left')
    });

    commands.addCommand('example:split-right', {
        label: 'Split right',
        execute: () => doSplit('split-right')
    });

    commands.addCommand('example:split-top', {
        label: 'Split top',
        execute: () => doSplit('split-top')
    });

    commands.addCommand('example:split-bottom', {
        label: 'Split bottom',
        execute: () => doSplit('split-bottom')
    });

    let savedLayouts: DockPanel.ILayoutConfig[] = [];

    commands.addCommand('save-dock-layout', {
        label: 'Save Layout',
        caption: 'Save the current dock layout',
        execute: () => {
            savedLayouts.push(dock.saveLayout());
            palette.addItem({
                command: 'restore-dock-layout',
                category: 'Dock Layout',
                args: { index: savedLayouts.length - 1 }
            });
        }
    });

    commands.addCommand('restore-dock-layout', {
        label: (args) => {
            return `Restore Layout ${args.index as number}`;
        },
        execute: (args) => {
            dock.restoreLayout(savedLayouts[args.index as number]);
        }
    });

    commands.addCommand('view:toggle-add-button', {
        label: 'Toggle Add Button',
        mnemonic: 0,
        caption: 'Toggle Add Button',
        execute: () => {
            dock.addButtonEnabled = !dock.addButtonEnabled;
        }
    });

    palette.addItem({
        command: 'file:new',
        category: 'File',
        rank: 1
    });
    palette.addItem({
        command: 'file:open-directory',
        category: 'File',
        rank: 2
    });
    palette.addItem({
        command: 'file:save',
        category: 'File',
        rank: 3
    });
    palette.addItem({
        command: 'file:save-as',
        category: 'File',
        rank: 4
    });
    palette.addItem({
        command: 'save-dock-layout',
        category: 'Dock Layout',
        rank: 0
    });


    BoxPanel.setStretch(dock, 1);

    let leftPanel = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
    leftPanel.id = 'leftPanel';
    leftPanel.addWidget(palette);
    leftPanel.addWidget(directoryViewer);
    BoxPanel.setStretch(palette, 0);
    BoxPanel.setStretch(directoryViewer, 1);

    let statusBar = new Widget();
    statusBar.addClass('status-bar');
    statusBar.node.textContent = 'Ready - Open Source Propulsion Works © 2024';

    let main = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
    main.id = 'main';

    let centralPanel = new BoxPanel({ direction: 'left-to-right', spacing: 0 });
    centralPanel.addWidget(leftPanel);
    centralPanel.addWidget(dock);
    BoxPanel.setStretch(leftPanel, 0);
    BoxPanel.setStretch(dock, 1);

    main.addWidget(centralPanel);
    main.addWidget(statusBar);
    BoxPanel.setStretch(centralPanel, 1);
    BoxPanel.setStretch(statusBar, 0);

    window.onresize = () => {
        MessageLoop.postMessage(menuBar, new Widget.ResizeMessage(-1, -1));
        main.update();
    };

    Widget.attach(menuBar, document.body);
    Widget.attach(main, document.body);

    directoryViewer.fileOpened.connect(async (sender, { path, handle }) => {
        try {
            const file = await handle.getFile();
            const content = await file.text();
            const contentWidget = new ContentWidget(handle.name, content, handle);
            dock.addWidget(contentWidget);
            dock.activateWidget(contentWidget);
        } catch (error) {
            console.error('Error opening file:', error);
        }
    });
}

window.onload = main;
