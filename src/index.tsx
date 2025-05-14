import React from 'react';

import { GalleryComponent } from './components/GalleryComponent';

import type { GalleryReactRef, GalleryProps } from './types';

const Gallery = React.forwardRef(GalleryComponent) as <T extends any>(
  p: GalleryProps<T> & { ref?: GalleryReactRef }
) => React.ReactElement;

export default Gallery;
