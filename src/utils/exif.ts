interface ExifOrientationResult {
  file: File;
  orientation: number;
}

export interface  {
  dataUrl: string | null;
  orientation: number;
}

/**
 * Extracts EXIF orientation from a JPEG image file
 */
const handleExifOrientation = (file: File): Promise<ExifOrientationResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (!event.target || !event.target.result) {
        resolve({ file, orientation: 1 });
        return;
      }

      const buffer = new Uint8Array(event.target.result as ArrayBuffer);

      if (buffer.byteLength < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        resolve({ file, orientation: 1 });
        return;
      }

      try {
        let offset = 2;
        while (offset < buffer.byteLength) {
          if (buffer[offset] === 0xff && buffer[offset + 1] === 0xe1) {
            const exifOffset = offset + 4;
            if (
              buffer[exifOffset] === 0x45 &&
              buffer[exifOffset + 1] === 0x78 &&
              buffer[exifOffset + 2] === 0x69 &&
              buffer[exifOffset + 3] === 0x66
            ) {
              const tiffOffset = exifOffset + 6;
              const littleEndian = buffer[tiffOffset] === 0x49;
              const ifd0Offset = littleEndian
                ? buffer[tiffOffset + 4] +
                  (buffer[tiffOffset + 5] << 8) +
                  (buffer[tiffOffset + 6] << 16) +
                  (buffer[tiffOffset + 7] << 24)
                : (buffer[tiffOffset + 4] << 24) +
                  (buffer[tiffOffset + 5] << 16) +
                  (buffer[tiffOffset + 6] << 8) +
                  buffer[tiffOffset + 7];

              const numEntries = littleEndian
                ? buffer[tiffOffset + ifd0Offset] +
                  (buffer[tiffOffset + ifd0Offset + 1] << 8)
                : (buffer[tiffOffset + ifd0Offset] << 8) +
                  buffer[tiffOffset + ifd0Offset + 1];

              for (let i = 0; i < numEntries; i++) {
                const entryOffset = tiffOffset + ifd0Offset + 2 + i * 12;
                const tag = littleEndian
                  ? buffer[entryOffset] + (buffer[entryOffset + 1] << 8)
                  : (buffer[entryOffset] << 8) + buffer[entryOffset + 1];

                if (tag === 0x0112) {
                  const orientation = littleEndian
                    ? buffer[entryOffset + 8] + (buffer[entryOffset + 9] << 8)
                    : (buffer[entryOffset + 8] << 8) + buffer[entryOffset + 9];

                  console.log(`📸 Original Orientation: ${orientation}`);
                  resolve({ file, orientation });
                  return;
                }
              }
            }
          }

          offset += 2;
          const markerSize = (buffer[offset] << 8) + buffer[offset + 1];
          if (markerSize <= 0 || offset + markerSize >= buffer.byteLength)
            break;
          offset += markerSize;
        }

        resolve({ file, orientation: 1 });
      } catch (error) {
        console.error('Error parsing EXIF data:', error);
        resolve({ file, orientation: 1 });
      }
    };

    reader.onerror = () => {
      console.error('Error reading file for EXIF data');
      resolve({ file, orientation: 1 });
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Corrects image orientation based on EXIF data
 */
const correctImageOrientation = (
  file: File
): Promise<> => {
  return new Promise((resolve) => {
    handleExifOrientation(file).then(({ orientation }) => {
      console.log(`🛠️ Original Orientation: ${orientation}`);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          resolve({ dataUrl: null, orientation: 1 });
          return;
        }

        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({ dataUrl: null, orientation: 1 });
            return;
          }

          // Set canvas to the original image dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image as-is without rotation
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Convert to data URL (this strips all EXIF data automatically)
          const dataUrl = canvas.toDataURL('image/jpeg');

          console.log(`✅ Image resaved with orientation value 1`);
          resolve({ dataUrl, orientation: 1 }); // Return the converted image with orientation 1
        };

        img.src = e.target.result as string;
      };

      reader.readAsDataURL(file);
    });
  });
};

export { handleExifOrientation, correctImageOrientation };
