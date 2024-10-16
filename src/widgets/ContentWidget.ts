import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import * as monaco from 'monaco-editor';

export class ContentWidget extends Widget {
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
