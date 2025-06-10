import React, { useMemo } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';

export default function HomeCategoryPills({
  isSticky,
  headerScale,
  theme,
  categoryTree,
  renderCategoryPill,
  setCategoryPillY
}) {
  // Memoize the category pills to prevent unnecessary re-renders
  const categoryPills = useMemo(() => {
    return categoryTree.map(cat => (
      <React.Fragment key={cat.name}>
        {renderCategoryPill(cat.name)}
        {cat.subs.map(sub => renderCategoryPill(sub, true))}
      </React.Fragment>
    ));
  }, [categoryTree, renderCategoryPill]);

  const stickyStyle = useMemo(() => ({
    backgroundColor: theme.background,
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,58,68,0.2)',
    transform: [
      {
        translateY: headerScale.interpolate({
          inputRange: [0.9, 1],
          outputRange: [-5, 0],
          extrapolate: 'clamp'
        })
      }
    ],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  }), [theme, headerScale]);

  const normalStyle = useMemo(() => ({
    backgroundColor: 'transparent',
    marginBottom: 20,
    minHeight: 50 // Ensure there's height to display content
  }), []);

  return isSticky ? (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={stickyStyle}
      contentContainerStyle={styles.stickyContent}
    >
      {categoryPills}
    </Animated.ScrollView>
  ) : (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={normalStyle}
      contentContainerStyle={styles.normalContent}
      onLayout={e => setCategoryPillY(e.nativeEvent.layout.y)}
    >
      {categoryPills}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stickyContent: {
    paddingHorizontal: 15,
    paddingRight: 30 // Extra padding for better scroll
  },
  normalContent: {
    paddingHorizontal: 15,
    alignItems: 'center', // Helps center vertically
    flexDirection: 'row'   // Ensure pills line up horizontally
  }
});
