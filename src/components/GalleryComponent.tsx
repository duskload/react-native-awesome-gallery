import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  ViewToken,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

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

const defaultRenderImage = ({
  item,
  setImageDimensions,
}: RenderItemInfo<any>) => (
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
  const flatListRef = useRef<FlatList<T>>(null);
  const refs = useRef<ItemRef[]>([]);

  const [index, setIndex] = useState(initialIndex);

  const setRef = useCallback((itemIndex: number, value: ItemRef) => {
    refs.current[itemIndex] = value;
  }, []);

  const translateX = useSharedValue(0); // <- always pass a valid shared value

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const newIndex = viewableItems[0].index ?? 0;
        if (newIndex !== index) {
          refs.current[index]?.reset?.(false);
          setIndex(newIndex);
          onIndexChange?.(newIndex);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    if (index >= data.length) {
      const newIndex = data.length - 1;
      setIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: false });
    }
  }, [data.length, index]);

  useImperativeHandle(
    ref,
    () => ({
      setIndex(newIndex: number, animated?: boolean) {
        refs.current?.[index]?.reset?.(false);
        setIndex(newIndex);
        onIndexChange?.(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated });
      },
      reset(animated = false) {
        refs.current?.forEach((itemRef) => itemRef.reset(animated));
      },
    }),
    [index, onIndexChange]
  );

  const renderGalleryItem = useCallback(
    ({ item, index: i }: { item: T; index: number }) => (
      // @ts-expect-error tss
      <ResizableImage
        {...{
          translateX, // <-- valid shared value (even if unused in FlatList)
          item,
          currentIndex: { value: index }, // simulate shared value
          index: i,
          isFirst: i === 0,
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
          loop,
          onScaleChange,
          onScaleChangeRange,
          setRef,
          ...eventsCallbacks,
          ...dimensions,
        }}
      />
    ),
    [
      translateX,
      index,
      renderItem,
      data.length,
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
      loop,
      onScaleChange,
      onScaleChangeRange,
      setRef,
      eventsCallbacks,
      dimensions,
    ]
  );

  return (
    <GestureHandlerRootView style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        initialScrollIndex={initialIndex}
        windowSize={numToRender}
        maxToRenderPerBatch={numToRender}
        removeClippedSubviews
        inverted={rtl}
        // @ts-expect-error ts
        keyExtractor={(item, i) =>
          keyExtractor ? keyExtractor(item, i) : String(i)
        }
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({
          length: dimensions.width,
          offset: dimensions.width * i,
          index: i,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderGalleryItem}
        initialNumToRender={numToRender}
        extraData={dimensions}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
