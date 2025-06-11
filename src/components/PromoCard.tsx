import React, { useRef, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const { width } = Dimensions.get("window");

// Banners simulados (substitua pelos seus próprios arquivos ou URLs)
const banners = [
  require("../assets/pexels-photo-1216589.webp"),
  require("../assets/pexels-photo-1216589.webp"),
  require("../assets/pexels-photo-1216589.webp"),
];

export const BannerCarousel = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  // Auto play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <Image
            key={index}
            source={banner}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Indicadores (bolinhas) */}
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 230,
    marginBottom: 16,
  },
  bannerImage: {
    width,
    height: 180,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    margin: 4,
  },
  activeDot: {
    backgroundColor: "#FF8C00",
    width: 10,
    height: 10,
  },
});
