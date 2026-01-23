export interface DriveFile {
    id: string;
    name: string;
    mimeType: string;
}

export const extractFolderId = (url: string): string | null => {
    // 1. Standard Folder Link: .../folders/12345...
    const folderMatch = url.match(/folders\/([-a-zA-Z0-9_]+)/);
    if (folderMatch) return folderMatch[1];

    // 2. ID Parameter: ?id=12345... (used in "Get Link")
    const idMatch = url.match(/[?&]id=([-a-zA-Z0-9_]+)/);
    if (idMatch) return idMatch[1];

    // 3. Open ID: .../open?id=12345...
    const openMatch = url.match(/open\?id=([-a-zA-Z0-9_]+)/);
    if (openMatch) return openMatch[1];

    // 4. File Link (Warning: This is a file, not a folder, but we extract the ID anyway)
    // .../file/d/12345.../view
    const fileMatch = url.match(/file\/d\/([-a-zA-Z0-9_]+)/);
    if (fileMatch) {
        console.warn("Detected File ID, not Folder ID. List/Search might fail if used as parent.");
        return fileMatch[1];
    }

    // 5. Raw ID check (if user pasted just the ID)
    if (!url.includes('/') && url.length > 15) return url.trim();

    return null;
};

export const fetchDriveFiles = async (folderId: string, apiKey: string): Promise<DriveFile[]> => {
    if (!apiKey) throw new Error("API Key is required");

    // Query: Inside folder, is not trashed, is an image
    const q = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&key=${apiKey}&fields=files(id,name,mimeType)`;

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Drive API Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.files || [];
};

export const downloadDriveFile = async (fileId: string, apiKey: string): Promise<Blob> => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to download file");
    }
    return await response.blob();
};
