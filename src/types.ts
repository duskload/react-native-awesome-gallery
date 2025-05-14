import type Animated from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

export type Dimensions = {
  height: number;
  width: number;
};

export type RenderItemInfo<T> = {
  index: number;
  item: T;
  setImageDimensions: (imageDimensions: Dimensions) => void;
};

export type ItemRef = { reset: (animated: boolean) => void };

export type EventsCallbacks = {
  onSwipeToClose?: () => void;
  onTap?: () => void;
  onDoubleTap?: (toScale: number) => void;
  onLongPress?: () => void;
  onScaleStart?: (scale: number) => void;
  onScaleEnd?: (scale: number) => void;
  onPanStart?: () => void;
  onTranslationYChange?: (translationY: number, shouldClose: boolean) => void;
};

export type RenderItem<T> = (
  imageInfo: RenderItemInfo<T>
) => React.ReactElement | null;

export type Props<T> = EventsCallbacks & {
  item: T;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  translateX: Animated.SharedValue<number>;
  currentIndex: Animated.SharedValue<number>;
  renderItem: RenderItem<T>;
  width: number;
  height: number;
  length: number;

  emptySpaceWidth: number;
  doubleTapInterval: number;
  doubleTapScale: number;
  maxScale: number;
  pinchEnabled: boolean;
  swipeEnabled: boolean;
  doubleTapEnabled: boolean;
  disableTransitionOnScaledImage: boolean;
  disableSwipeToCloseOnScaledImage: boolean;
  hideAdjacentImagesOnScaledImage: boolean;
  disableVerticalSwipe: boolean;
  disableSwipeUp?: boolean;
  loop: boolean;
  onScaleChange?: (scale: number) => void;
  onScaleChangeRange?: { start: number; end: number };

  setRef: (index: number, value: ItemRef) => void;
};

export type GalleryRef = {
  setIndex: (newIndex: number, animated?: boolean) => void;
  reset: (animated?: boolean) => void;
};

export type GalleryReactRef = React.Ref<GalleryRef>;

export type GalleryProps<T> = EventsCallbacks & {
  ref?: GalleryReactRef;
  data: T[];

  renderItem?: RenderItem<T>;
  keyExtractor?: (item: T, index: number) => string | number;
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  numToRender?: number;
  emptySpaceWidth?: number;
  doubleTapScale?: number;
  doubleTapInterval?: number;
  maxScale?: number;
  style?: ViewStyle;
  containerDimensions?: { width: number; height: number };
  pinchEnabled?: boolean;
  swipeEnabled?: boolean;
  doubleTapEnabled?: boolean;
  disableTransitionOnScaledImage?: boolean;
  disableSwipeToCloseOnScaledImage?: boolean;
  hideAdjacentImagesOnScaledImage?: boolean;
  disableVerticalSwipe?: boolean;
  disableSwipeUp?: boolean;
  loop?: boolean;
  onScaleChange?: (scale: number) => void;
  onScaleChangeRange?: { start: number; end: number };
};
