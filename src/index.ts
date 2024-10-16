import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

import { CommandRegistry } from '@lumino/commands';
import { ISignal, Signal } from '@lumino/signaling';
import { Message, MessageLoop } from '@lumino/messaging';
import {
    BoxPanel,
    CommandPalette,
    DockPanel,
    Menu,
    MenuBar,
    SplitPanel,
    TabBar,
    Widget,
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
    let appearanceMenu = new Menu({ commands });
    appearanceMenu.title.label = 'Appearance';
    appearanceMenu.addItem({ command: 'theme:light' });
    appearanceMenu.addItem({ command: 'theme:dark' });
    appearanceMenu.addItem({ command: 'theme:high-contrast' });
    viewMenu.addItem({ type: 'submenu', submenu: appearanceMenu });
    return viewMenu;
}

function createThemeToggleButton(): HTMLElement {
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

function setButtonIcon(button: HTMLElement, theme: string): void {
    button.classList.remove('light-theme-icon', 'dark-theme-icon', 'high-contrast-theme-icon');
    if (theme === 'light') {
        button.classList.add('light-theme-icon');
    } else if (theme === 'dark') {
        button.classList.add('dark-theme-icon');
    } else if (theme === 'high-contrast') {
        button.classList.add('high-contrast-theme-icon');
    }
}

function applyTheme(theme: string): void {
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

class PDFViewerWidget extends Widget {
    private fileHandle: FileSystemFileHandle;
    private pdfDoc: PDFDocumentProxy | null = null;
    private currentPage: number = 1;
    private totalPages: number = 0;
    private scale: number = 1.0;
    private canvas: HTMLCanvasElement;
    private pageNumberDisplay: HTMLElement;
    constructor(fileHandle: FileSystemFileHandle) {
        super();
        this.fileHandle = fileHandle;
        this.setFlag(Widget.Flag.DisallowLayout);
        this.title.label = fileHandle.name;
        this.title.closable = true;
        this.title.caption = `Viewing: ${fileHandle.name}`;
        this.title.iconClass = 'fa fa-file-pdf-o';
        this.addClass('pdf-viewer-widget');

        const container = document.createElement('div');
        container.className = 'pdf-viewer-container';
        this.node.appendChild(container);

        const controls = document.createElement('div');
        controls.className = 'pdf-viewer-controls';

        const zoomOutButton = document.createElement('button');
        zoomOutButton.textContent = '-';
        zoomOutButton.title = 'Zoom Out';
        zoomOutButton.addEventListener('click', () => {
            this.zoomOut();
        });

        const zoomInButton = document.createElement('button');
        zoomInButton.textContent = '+';
        zoomInButton.title = 'Zoom In';
        zoomInButton.addEventListener('click', () => {
            this.zoomIn();
        });

        const prevPageButton = document.createElement('button');
        prevPageButton.textContent = 'Prev';
        prevPageButton.title = 'Previous Page';
        prevPageButton.addEventListener('click', () => {
            this.goToPreviousPage();
        });

        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'Next';
        nextPageButton.title = 'Next Page';
        nextPageButton.addEventListener('click', () => {
            this.goToNextPage();
        });

        const pageNumberDisplay = document.createElement('span');
        pageNumberDisplay.textContent = `${this.currentPage} / ${this.totalPages}`;
        this.pageNumberDisplay = pageNumberDisplay;

        controls.appendChild(zoomOutButton);
        controls.appendChild(zoomInButton);
        controls.appendChild(prevPageButton);
        controls.appendChild(nextPageButton);
        controls.appendChild(pageNumberDisplay);

        container.appendChild(controls);

        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'pdf-canvas-container';
        container.appendChild(canvasContainer);

        this.canvas = document.createElement('canvas');
        canvasContainer.appendChild(this.canvas);
    }

    async onAfterAttach(msg: Message): Promise<void> {
        super.onAfterAttach(msg);
        await this.loadPDF();
    }

    async loadPDF(): Promise<void> {
        const file = await this.fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        this.pdfDoc = await getDocument({ data: arrayBuffer }).promise;
        this.totalPages = this.pdfDoc.numPages;
        this.updatePageNumberDisplay();
        await this.renderPage(this.currentPage);
    }

    async renderPage(num: number): Promise<void> {
        if (!this.pdfDoc) return;
        const page = await this.pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: this.scale });
        const context = this.canvas.getContext('2d');
        if (!context) return;
        this.canvas.height = viewport.height;
        this.canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;
    }

    zoomIn(): void {
        this.scale += 0.1;
        this.renderPage(this.currentPage);
    }

    zoomOut(): void {
        if (this.scale > 0.2) {
            this.scale -= 0.1;
            this.renderPage(this.currentPage);
        }
    }

    goToPreviousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage -= 1;
            this.updatePageNumberDisplay();
            this.renderPage(this.currentPage);
        }
    }

    goToNextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage += 1;
            this.updatePageNumberDisplay();
            this.renderPage(this.currentPage);
        }
    }

    updatePageNumberDisplay(): void {
        if (this.pageNumberDisplay) {
            this.pageNumberDisplay.textContent = `${this.currentPage} / ${this.totalPages}`;
        }
    }
}

class ContentWidget extends Widget {
    static menuFocus: ContentWidget | null;
    static currentWidget: ContentWidget | null = null;
    static previewWidget: ContentWidget | null = null;
    private editor: monaco.editor.IStandaloneCodeEditor | null = null;
    private initialContent: string;
    private fileHandle: FileSystemFileHandle | null = null;
    private contextMenuHandler: ((event: MouseEvent) => void) | null = null;
    private isPreview: boolean = false;

    constructor(
        name: string,
        initialContent: string = '',
        fileHandle: FileSystemFileHandle | null = null,
        isPreview: boolean = false
    ) {
        super();
        this.setFlag(Widget.Flag.DisallowLayout);
        this.addClass('content');
        this.title.label = name;
        this.title.closable = true;
        this.title.caption = `Editing: ${name}`;
        this.title.iconClass = 'fa fa-file';
        this.initialContent = initialContent;
        this.fileHandle = fileHandle;
        this.isPreview = isPreview;
        this.node.style.width = '100%';
        this.node.style.height = '100%';
        this.contextMenuHandler = (event: MouseEvent) => {
            ContentWidget.menuFocus = this;
        };
        this.node.addEventListener('contextmenu', this.contextMenuHandler);
        if (this.isPreview) {
            this.title.className += ' preview-tab';
        }
    }

    protected onAfterAttach(msg: Message): void {
        super.onAfterAttach(msg);
        let model: monaco.editor.ITextModel | null = null;
        const uri = monaco.Uri.parse('file:///' + (this.fileHandle ? this.fileHandle.name : this.title.label));
        if (monaco.editor.getModel(uri)) {
            model = monaco.editor.getModel(uri)!;
        } else {
            monaco.editor.createModel(this.initialContent, undefined, uri);
            model = monaco.editor.getModel(uri);
        }
        this.editor = monaco.editor.create(this.node, {
            model: model,
            automaticLayout: true,
        });
        if (this.isPreview && this.editor) {
            this.editor.onDidChangeModelContent(() => {
                this.convertToPermanent();
            });
        }
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
        ContentWidget.currentWidget = this;
    }

    protected onBeforeDetach(msg: Message): void {
        super.onBeforeDetach(msg);
    }

    dispose(): void {
        if (ContentWidget.menuFocus === this) {
            ContentWidget.menuFocus = null;
        }
        if (ContentWidget.currentWidget === this) {
            ContentWidget.currentWidget = null;
        }
        if (ContentWidget.previewWidget === this) {
            ContentWidget.previewWidget = null;
        }
        if (this.contextMenuHandler) {
            this.node.removeEventListener('contextmenu', this.contextMenuHandler);
            this.contextMenuHandler = null;
        }
        if (this.editor) {
            const model = this.editor.getModel();
            if (model && !model.isDisposed()) {
                model.dispose();
            }
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

    getEditor(): monaco.editor.IStandaloneCodeEditor | null {
        return this.editor;
    }

    isPreviewMode(): boolean {
        return this.isPreview;
    }

    convertToPermanent(): void {
        if (this.isPreview) {
            this.isPreview = false;
            this.title.className = this.title.className.replace(' preview-tab', '');
            if (ContentWidget.previewWidget === this) {
                ContentWidget.previewWidget = null;
            }
        }
    }
}

interface DirectoryNode {
    name: string;
    kind: 'file' | 'directory';
    handle: FileSystemDirectoryHandle | FileSystemFileHandle;
    children?: Map<string, DirectoryNode>;
    loaded?: boolean;
}

class DirectoryViewerWidget extends Widget {
    private container: HTMLElement;
    private directoryHandle: FileSystemDirectoryHandle | null;
    private directoryTree: DirectoryNode | null = null;
    private expandedPaths: Set<string> = new Set();
    private selectedItem: HTMLElement | null = null;
    private _fileOpened = new Signal<this, { path: string; handle: FileSystemFileHandle; preview: boolean }>(this);

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

    get fileOpened(): ISignal<this, { path: string; handle: FileSystemFileHandle; preview: boolean }> {
        return this._fileOpened;
    }

    async setDirectoryHandle(handle: FileSystemDirectoryHandle) {
        this.directoryHandle = handle;
        this.directoryTree = {
            name: handle.name,
            kind: 'directory',
            handle: handle,
            loaded: false,
            children: new Map<string, DirectoryNode>(),
        };
        this.expandedPaths.clear();
        const rootUl = await this.createDomNode(this.directoryTree);
        this.container.innerHTML = '';
        this.container.appendChild(rootUl);
    }

    async createDomNode(node: DirectoryNode, path: string = ''): Promise<HTMLUListElement> {
        const ul = document.createElement('ul');
        ul.className = 'directory-tree';
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
        ul.appendChild(li);
        if (node.kind === 'directory') {
            const childUl = document.createElement('ul');
            childUl.className = 'nested';
            if (this.expandedPaths.has(currentPath)) {
                li.classList.add('expanded');
                icon.classList.add('fa', 'fa-folder-open');
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
                    if (!node.loaded) {
                        node.loaded = true;
                        node.children = new Map<string, DirectoryNode>();
                        for await (const [name, childHandle] of (node.handle as FileSystemDirectoryHandle).entries()) {
                            const childNode: DirectoryNode = {
                                name: childHandle.name,
                                kind: childHandle.kind,
                                handle: childHandle,
                                loaded: false,
                            };
                            node.children.set(name, childNode);
                            const childLi = await this.createDomNode(childNode, currentPath);
                            childUl.appendChild(childLi);
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
            li.appendChild(childUl);
        } else {
            icon.classList.add('fa', 'fa-file');
            let clickTimer: number | null = null;
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                if (this.selectedItem) {
                    this.selectedItem.classList.remove('file-selected');
                }
                li.classList.add('file-selected');
                this.selectedItem = li;
                if (clickTimer !== null) {
                    clearTimeout(clickTimer);
                    clickTimer = null;
                    this._fileOpened.emit({ path: currentPath, handle: node.handle as FileSystemFileHandle, preview: false });
                } else {
                    clickTimer = window.setTimeout(() => {
                        this._fileOpened.emit({ path: currentPath, handle: node.handle as FileSystemFileHandle, preview: true });
                        clickTimer = null;
                    }, 250);
                }
            });
        }
        return ul;
    }
}

function main(): void {
    let directoryViewer = new DirectoryViewerWidget();
    let menuBar = new MenuBar();
    menuBar.addMenu(createFileMenu());
    menuBar.addMenu(createEditMenu());
    menuBar.addMenu(createViewMenu());
    menuBar.id = 'menuBar';
    let themeToggleButton = createThemeToggleButton();
    menuBar.node.appendChild(themeToggleButton);
    let palette = new CommandPalette({ commands });
    palette.id = 'palette';

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

    const keydownHandler = (event: KeyboardEvent) => {
        commands.processKeydownEvent(event);
    };
    document.addEventListener('keydown', keydownHandler);

    const homeContent = `Welcome to the Application!
This is the landing page. Use the directory viewer to open files.`;
    let homeWidget = new ContentWidget('Home', homeContent);

    let dock = new DockPanel();
    dock.addWidget(homeWidget);
    dock.id = 'dock';

    dock.addRequested.connect((sender: DockPanel, arg: TabBar<Widget>) => {
        let name = 'untitled.txt';
        let content = '';
        let w = new ContentWidget(name, content);
        sender.addWidget(w, { ref: arg.titles[0].owner });
    });

    let doSplit = (mode: DockPanel.InsertMode) => {
        let ref = ContentWidget.menuFocus;
        if (ref) {
            let name = 'untitled.txt';
            let content = '';
            let widget = new ContentWidget(name, content);
            dock.addWidget(widget, { mode: mode, ref: ref });
        }
    };

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

    let savedLayouts: DockPanel.ILayoutConfig[] = [];

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

    BoxPanel.setStretch(palette, 0);
    BoxPanel.setStretch(directoryViewer, 1);

    let leftPanel = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
    leftPanel.id = 'leftPanel';
    leftPanel.addWidget(palette);
    leftPanel.addWidget(directoryViewer);

    let statusBar = new Widget();
    statusBar.addClass('status-bar');
    statusBar.node.textContent = 'Ready - Open Source Propulsion Works © 2024';

    let main = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
    main.id = 'main';

    let centralPanel = new SplitPanel({ orientation: 'horizontal', spacing: 0 });
    centralPanel.addWidget(leftPanel);
    centralPanel.addWidget(dock);
    centralPanel.setRelativeSizes([0.2, 0.8]);

    main.addWidget(centralPanel);
    main.addWidget(statusBar);
    BoxPanel.setStretch(centralPanel, 1);
    BoxPanel.setStretch(statusBar, 0);

    const resizeHandler = () => {
        MessageLoop.postMessage(menuBar, new Widget.ResizeMessage(-1, -1));
        main.update();
    };

    window.addEventListener('resize', resizeHandler);

    Widget.attach(menuBar, document.body);
    Widget.attach(main, document.body);

    directoryViewer.fileOpened.connect(async (sender, { path, handle, preview }) => {
        try {
            const fileExtension = handle.name.split('.').pop()?.toLowerCase();
            if (fileExtension === 'pdf') {
                let pdfWidget = new PDFViewerWidget(handle);
                dock.addWidget(pdfWidget);
                dock.activateWidget(pdfWidget);
            } else {
                const uri = monaco.Uri.parse('file:///' + handle.name);
                let model = monaco.editor.getModel(uri);
                if (!model) {
                    const file = await handle.getFile();
                    const content = await file.text();
                    model = monaco.editor.createModel(content, undefined, uri);
                }
                if (preview) {
                    if (ContentWidget.previewWidget) {
                        if (ContentWidget.previewWidget.getFileHandle() === handle) {
                            dock.activateWidget(ContentWidget.previewWidget);
                            return;
                        }
                        ContentWidget.previewWidget.close();
                    }
                    let contentWidget = new ContentWidget(handle.name, '', handle, true);
                    ContentWidget.previewWidget = contentWidget;
                    dock.addWidget(contentWidget);
                    dock.activateWidget(contentWidget);
                } else {
                    let existingWidget = findWidgetByFileHandle(handle);
                    if (existingWidget) {
                        dock.activateWidget(existingWidget);
                    } else if (ContentWidget.previewWidget && ContentWidget.previewWidget.getFileHandle() === handle) {
                        ContentWidget.previewWidget.convertToPermanent();
                        ContentWidget.previewWidget = null;
                    } else {
                        let contentWidget = new ContentWidget(handle.name, '', handle);
                        dock.addWidget(contentWidget);
                        dock.activateWidget(contentWidget);
                    }
                }
            }
        } catch (error) {
            console.error('Error opening file:', error);
        }
    });

    function findWidgetByFileHandle(handle: FileSystemFileHandle): ContentWidget | null {
        for (let widget of dock.widgets()) {
            if (widget instanceof ContentWidget) {
                if (widget.getFileHandle() === handle && !widget.isPreviewMode()) {
                    return widget;
                }
            }
        }
        return null;
    }

    window.addEventListener('beforeunload', () => {
        document.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('resize', resizeHandler);
    });

    let savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    setButtonIcon(themeToggleButton, savedTheme);
}

window.onload = main;
