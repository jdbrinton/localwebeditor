import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';

export class PDFViewerWidget extends Widget {
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
