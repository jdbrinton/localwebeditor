// src/types.ts
declare global {
    interface Window {
        showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
        showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    }
}

// Augment the built-in FileSystemDirectoryHandle interface
declare global {
    interface FileSystemDirectoryHandle {
        entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
        keys(): AsyncIterableIterator<string>;
        values(): AsyncIterableIterator<FileSystemHandle>;
        [Symbol.asyncIterator](): AsyncIterableIterator<FileSystemHandle>;
    }
}

// export interface FileSystemFileHandle {
//     kind: 'file';
//     name: string;
//     getFile(): Promise<File>;
//     createWritable(options?: FileSystemCreateWritableOptions): Promise<FileSystemWritableFileStream>;
//     queryPermission(options?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
//     requestPermission(options?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>;
// }

export interface FileSystemWritableFileStream extends WritableStream {
    write(data: BufferSource | Blob | string): Promise<void>;
    close(): Promise<void>;
    abort(): Promise<void>;
}

export interface FileSystemCreateWritableOptions {
    keepExistingData?: boolean;
}

export interface SaveFilePickerOptions {
    types?: FilePickerAcceptType[];
    excludeAcceptAllOption?: boolean;
    suggestedName?: string;
    startIn?: FileSystemHandle | string;
}

export interface FilePickerAcceptType {
    description?: string;
    accept: Record<string, string[]>;
}

export interface GetFileHandleOptions {
    create?: boolean;
}

export interface GetDirectoryHandleOptions {
    create?: boolean;
}

export interface FileSystemHandlePermissionDescriptor {
    mode?: 'read' | 'readwrite';
}

export type PermissionState = 'granted' | 'denied' | 'prompt';
