import { useState } from 'react';

const extractDataURLs = (htmlContent: string) => {
  const srcArray: string[] = [];
  const imgTagRegex = /<img[^>]*src=["'](data:[^"']+)["'][^>]*>/g;
  let match;

  while ((match = imgTagRegex.exec(htmlContent)) !== null) {
    srcArray.push(match[1]); // dataURL만 추출하여 배열에 저장
  }

  return srcArray;
};

export default function ImageExtractor({ content }: { content: string }) {
  const [images, setImages] = useState<string[]>([]);

  const extractedImages = extractDataURLs(content);
  setImages(extractedImages);
  // console.log('Extracted Data URLs:', extractedImages);

  return images;
}
