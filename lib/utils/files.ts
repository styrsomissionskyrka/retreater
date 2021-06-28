/**
 * Source: https://github.com/GoogleChromeLabs/text-editor/blob/main/src/inline-scripts/fs-helpers.js
 */

/**
 * Create a handle to a new (text) file on the local file system.
 *
 * @return {Promise<FileSystemFileHandle>} Handle to the new file.
 */
export function getNewFileHandle(): Promise<FileSystemFileHandle> {
  const opts: SaveFilePickerOptions = {
    types: [
      {
        description: '.csv',
        accept: { 'text/csv': ['.csv'] },
      },
    ],
  };

  return window.showSaveFilePicker(opts);
}

/**
 * Writes the contents to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} contents Contents to write.
 */
export async function writeFile(fileHandle: FileSystemFileHandle, contents: string) {
  // For Chrome 83 and later.
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} withWrite True if write permission should be checked.
 * @return {boolean} True if the user has granted read/write permission.
 */
export async function verifyPermission(fileHandle: FileSystemFileHandle, withWrite: boolean) {
  const opts: FileSystemHandlePermissionDescriptor = {};
  if (withWrite) {
    opts.writable = true;
  }
  // Check if we already have permission, if so, return true.
  if ((await fileHandle.queryPermission(opts)) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if ((await fileHandle.requestPermission(opts)) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
}

export function supportsFileSystemAPI(): boolean {
  return typeof window !== 'undefined' && 'showSaveFilePicker' in window;
}
