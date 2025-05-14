import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  DOUBLE_TAP_SCALE,
  MAX_SCALE,
  rtl,
  SPACE_BETWEEN_IMAGES,
} from '../constants';
import type {
  GalleryProps,
  GalleryReactRef,
  ItemRef,
  RenderItemInfo,
} from '../types';

import { ResizableImage } from './ResizableImage';

import { springConfig } from '../constants';

const defaultRenderImage = ({
  item,
  setImageDimensions,
}: RenderItemInfo<any>) => {
  return (
    <Image
      onLoad={(e) => {
        const { height: h, width: w } = e.nativeEvent.source;
        setImageDimensions({ height: h, width: w });
      }}
      source={{ uri: item }}
      resizeMode="contain"
      style={StyleSheet.absoluteFillObject}
    />
  );
};

export const GalleryComponent = <T extends any>(
  {
    data,
    renderItem = defaultRenderImage,
    initialIndex = 0,
    numToRender = 5,
    emptySpaceWidth = SPACE_BETWEEN_IMAGES,
    doubleTapScale = DOUBLE_TAP_SCALE,
    doubleTapInterval = 500,
    maxScale = MAX_SCALE,
    pinchEnabled = true,
    swipeEnabled = true,
    doubleTapEnabled = true,
    disableTransitionOnScaledImage = false,
    disableSwipeToCloseOnScaledImage = false,
    hideAdjacentImagesOnScaledImage = false,
    onIndexChange,
    style,
    keyExtractor,
    containerDimensions,
    disableVerticalSwipe,
    disableSwipeUp = false,
    loop = false,
    onScaleChange,
    onScaleChangeRange,
    ...eventsCallbacks
  }: GalleryProps<T>,
  ref: GalleryReactRef
) => {
  const windowDimensions = useWindowDimensions();
  const dimensions = containerDimensions || windowDimensions;

  const isLoop = loop && data?.length > 1;

  const [index, setIndex] = useState(initialIndex);

  const refs = useRef<ItemRef[]>([]);

  const setRef = useCallback((itemIndex: number, value: ItemRef) => {
    refs.current[itemIndex] = value;
  }, []);

  const translateX = useSharedValue(
    initialIndex * -(dimensions.width + emptySpaceWidth)
  );

  const currentIndex = useSharedValue(initialIndex);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rtl ? -translateX.value : translateX.value }],
  }));

  const changeIndex = useCallback(
    (newIndex) => {
      onIndexChange?.(newIndex);
      setIndex(newIndex);
    },
    [onIndexChange, setIndex]
  );

  useAnimatedReaction(
    () => currentIndex.value,
    (newIndex) => runOnJS(changeIndex)(newIndex),
    [currentIndex, changeIndex]
  );

  useEffect(() => {
    translateX.value = index * -(dimensions.width + emptySpaceWidth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width]);

  useImperativeHandle(ref, () => ({
    setIndex(newIndex: number, animated?: boolean) {
      refs.current?.[index].reset(false);
      setIndex(newIndex);
      currentIndex.value = newIndex;
      if (animated) {
        translateX.value = withSpring(
          newIndex * -(dimensions.width + emptySpaceWidth),
          springConfig
        );
      } else {
        translateX.value = newIndex * -(dimensions.width + emptySpaceWidth);
      }
    },
    reset(animated = false) {
      refs.current?.forEach((itemRef) => itemRef.reset(animated));
    },
  }));

  useEffect(() => {
    if (index >= data.length) {
      const newIndex = data.length - 1;
      setIndex(newIndex);
      currentIndex.value = newIndex;
      translateX.value = newIndex * -(dimensions.width + emptySpaceWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length, dimensions.width]);

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <Animated.View style={[styles.rowContainer, animatedStyle]}>
        {data.map((item: any, i) => {
          const isFirst = i === 0;

          const outOfLoopRenderRange =
            !isLoop ||
            (Math.abs(i - index) < data.length - (numToRender - 1) / 2 &&
              Math.abs(i - index) > (numToRender - 1) / 2);

          const hidden =
            Math.abs(i - index) > (numToRender - 1) / 2 && outOfLoopRenderRange;

          if (hidden) {
            return null;
          }

          return (
            // @ts-ignore
            <ResizableImage
              key={
                keyExtractor
                  ? keyExtractor(item, i)
                  : item.id || item.key || item._id || item
              }
              {...{
                translateX,
                item,
                currentIndex,
                index: i,
                isFirst,
                isLast: i === data.length - 1,
                length: data.length,
                renderItem,
                emptySpaceWidth,
                doubleTapScale,
                doubleTapInterval,
                maxScale,
                pinchEnabled,
                swipeEnabled,
                doubleTapEnabled,
                disableTransitionOnScaledImage,
                disableSwipeToCloseOnScaledImage,
                hideAdjacentImagesOnScaledImage,
                disableVerticalSwipe,
                disableSwipeUp,
                loop: isLoop,
                onScaleChange,
                onScaleChangeRange,
                setRef,
                ...eventsCallbacks,
                ...dimensions,
              }}
            />
          );
        })}
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  rowContainer: { flex: 1 },
});
