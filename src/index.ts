import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

import { CommandRegistry } from '@lumino/commands';
import { Message, MessageLoop } from '@lumino/messaging';
import {
    BoxPanel,
    CommandPalette,
    DockPanel,
    MenuBar,
    SplitPanel,
    Widget,
} from '@lumino/widgets';
import * as monaco from 'monaco-editor';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';

import { ContentWidget } from './widgets/ContentWidget';
import { DirectoryViewerWidget } from './widgets/DirectoryViewerWidget';
import { PDFViewerWidget } from './widgets/PDFViewerWidget';

import { registerCommands } from './commands';
import { applyTheme } from './utils';
import { createFileMenu, createEditMenu, createViewMenu, createThemeToggleButton, setButtonIcon } from './menus';

const commands = new CommandRegistry();

function main(): void {
    let directoryViewer = new DirectoryViewerWidget(commands);
    let menuBar = new MenuBar();
    menuBar.addMenu(createFileMenu(commands));
    menuBar.addMenu(createEditMenu(commands));
    menuBar.addMenu(createViewMenu(commands));
    menuBar.id = 'menuBar';
    let themeToggleButton = createThemeToggleButton(applyTheme);
    menuBar.node.appendChild(themeToggleButton);
    let palette = new CommandPalette({ commands });
    palette.id = 'palette';

    let homeContent = `Welcome to the Application!
This is the landing page. Use the directory viewer to open files.`;
    let homeWidget = new ContentWidget('Home', homeContent);

    let dock = new DockPanel();
    dock.addWidget(homeWidget);
    dock.id = 'dock';

    let leftPanel = new BoxPanel({ direction: 'top-to-bottom', spacing: 0 });
    leftPanel.id = 'leftPanel';
    leftPanel.addWidget(palette);
    leftPanel.addWidget(directoryViewer);

    // **Set stretch factors**
    BoxPanel.setStretch(palette, 0);         // Palette takes minimal space
    BoxPanel.setStretch(directoryViewer, 1); // DirectoryViewer fills remaining space

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

    const keydownHandler = (event: KeyboardEvent) => {
        commands.processKeydownEvent(event);
    };
    document.addEventListener('keydown', keydownHandler);

    registerCommands(commands, palette, dock, directoryViewer, leftPanel, statusBar, themeToggleButton);

    (window as any).MonacoEnvironment = {
        getWorker: function (workerId: string, label: string) {
            switch (label) {
                case 'json':
                    return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
                case 'css':
                case 'scss':
                case 'less':
                    return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
                case 'html':
                case 'handlebars':
                case 'razor':
                    return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
                case 'typescript':
                case 'javascript':
                    return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
                default:
                    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
            }
        },
    };

    window.addEventListener('error', (event) => {
        console.error('Global error handler caught an error:', event.error || event);
    });
}

window.onload = main;
