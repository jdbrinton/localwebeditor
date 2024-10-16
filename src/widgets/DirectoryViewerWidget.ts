import { Widget } from '@lumino/widgets';
import { ISignal, Signal } from '@lumino/signaling';
import { CommandRegistry } from '@lumino/commands';

interface FileNode {
    name: string;
    kind: 'file';
    handle: FileSystemFileHandle;
}

interface DirectoryNode {
    name: string;
    kind: 'directory';
    handle: FileSystemDirectoryHandle;
    children: Map<string, DirectoryNode | FileNode>;
    loaded: boolean;
}

type Node = FileNode | DirectoryNode;

export class DirectoryViewerWidget extends Widget {
    private container: HTMLElement;
    private directoryHandle: FileSystemDirectoryHandle | null;
    private directoryTree: DirectoryNode | null = null;
    private expandedPaths: Set<string> = new Set();
    private selectedItem: HTMLElement | null = null;
    private _fileOpened = new Signal<this, { path: string; handle: FileSystemFileHandle; preview: boolean }>(this);
    private commands: CommandRegistry;

    constructor(commands: CommandRegistry) {
        super();
        this.commands = commands;
        this.addClass('directory-viewer-widget');
        this.container = document.createElement('div');
        this.container.className = 'directory-viewer-container';
        this.node.appendChild(this.container);
        this.directoryHandle = null;
        const openDirButton = document.createElement('button');
        openDirButton.textContent = 'Open Directory';
        openDirButton.classList.add('lm-Button');
        openDirButton.addEventListener('click', () => {
            this.commands.execute('file:open-directory');
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
            children: new Map<string, DirectoryNode | FileNode>(),
        };

        this.expandedPaths.clear();
        this.expandedPaths.add(this.directoryTree.name);

        // Load the root directory's children
        this.directoryTree.loaded = true;
        this.directoryTree.children = new Map<string, DirectoryNode | FileNode>();
        for await (const [name, childHandle] of handle.entries()) {
            if (childHandle.kind === 'file') {
                const childNode: FileNode = {
                    name: childHandle.name,
                    kind: 'file',
                    handle: childHandle as FileSystemFileHandle,
                };
                this.directoryTree.children.set(name, childNode);
            } else {
                const childNode: DirectoryNode = {
                    name: childHandle.name,
                    kind: 'directory',
                    handle: childHandle as FileSystemDirectoryHandle,
                    loaded: false,
                    children: new Map(),
                };
                this.directoryTree.children.set(name, childNode);
            }
        }

        const rootLi = await this.createDomNode(this.directoryTree);
        const rootUl = document.createElement('ul');
        rootUl.className = 'directory-tree';
        rootUl.appendChild(rootLi);

        this.container.innerHTML = '';
        this.container.appendChild(rootUl);
    }

    async createDomNode(node: Node, path: string = ''): Promise<HTMLLIElement> {
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
            // TypeScript now knows node is DirectoryNode
            const childUl = document.createElement('ul');
            childUl.className = 'nested';
            li.appendChild(childUl);

            if (this.expandedPaths.has(currentPath)) {
                li.classList.add('expanded');
                icon.classList.add('fa', 'fa-folder-open');

                if (node.loaded) {
                    for (const childNode of node.children.values()) {
                        const childLi = await this.createDomNode(childNode, currentPath);
                        childUl.appendChild(childLi);
                    }
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

                    if (!node.loaded) {
                        node.loaded = true;
                        node.children = new Map<string, DirectoryNode | FileNode>();

                        for await (const [name, childHandle] of node.handle.entries()) {
                            if (childHandle.kind === 'file') {
                                const childNode: FileNode = {
                                    name: childHandle.name,
                                    kind: 'file',
                                    handle: childHandle as FileSystemFileHandle,
                                };
                                node.children.set(name, childNode);
                            } else {
                                const childNode: DirectoryNode = {
                                    name: childHandle.name,
                                    kind: 'directory',
                                    handle: childHandle as FileSystemDirectoryHandle,
                                    loaded: false,
                                    children: new Map(),
                                };
                                node.children.set(name, childNode);
                            }
                        }
                    }

                    childUl.innerHTML = '';
                    for (const childNode of node.children.values()) {
                        const childLi = await this.createDomNode(childNode, currentPath);
                        childUl.appendChild(childLi);
                    }
                } else {
                    li.classList.remove('expanded');
                    li.classList.add('collapsed');
                    icon.classList.remove('fa-folder-open');
                    icon.classList.add('fa-folder');
                    this.expandedPaths.delete(currentPath);
                    childUl.innerHTML = '';
                }
            });
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
                    this._fileOpened.emit({ path: currentPath, handle: node.handle, preview: false });
                } else {
                    clickTimer = window.setTimeout(() => {
                        this._fileOpened.emit({ path: currentPath, handle: node.handle, preview: true });
                        clickTimer = null;
                    }, 250);
                }
            });
        }

        return li;
    }
}
