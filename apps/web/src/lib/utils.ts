import AvatarEditor from 'react-avatar-editor';

import { OutputSizingMode, Size } from './types';

const ASPECT_RATIO_EDITOR_LONG_EDGE = 400;

export const getEditorSize = (outputSize: Size, sizingMode: OutputSizingMode): Size => {
  if (sizingMode === 'fixed_size') {
    return outputSize;
  }

  const longestEdge = Math.max(outputSize.width, outputSize.height);
  const scale = ASPECT_RATIO_EDITOR_LONG_EDGE / longestEdge;

  return {
    width: Math.max(1, Math.round(outputSize.width * scale)),
    height: Math.max(1, Math.round(outputSize.height * scale)),
  };
};

export const getImageBlobFromEditor = (editor: AvatarEditor, type: string, sizingMode: OutputSizingMode) => {
  return new Promise<Blob>((resolve, reject) => {
    (sizingMode === 'fixed_size' ? editor.getImageScaledToCanvas() : editor.getImage()).toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Error converting image to blob'));
      }
    }, type);
  });
};
