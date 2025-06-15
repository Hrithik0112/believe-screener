import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');
const MODAL_HEIGHT = height * 0.8; // 80% of screen height

// Mock notification data
const notifications = [
  {
    id: '1',
    type: 'price_alert',
    title: 'BTC Price Alert',
    message: 'Bitcoin just crossed $65,000!',
    time: '2 min ago',
    icon: 'trending-up',
    color: '#4CAF50',
  },
  {
    id: '2',
    type: 'volume_alert',
    title: 'High Volume Alert',
    message: 'Unusual trading volume detected for ETH',
    time: '15 min ago',
    icon: 'chart-bar',
    color: '#FF6B35',
  },
  {
    id: '3',
    type: 'news',
    title: 'Breaking News',
    message: 'Major crypto exchange announces new token listing',
    time: '1 hour ago',
    icon: 'newspaper',
    color: '#2196F3',
  },
  {
    id: '4',
    type: 'news',
    title: 'Breaking News',
    message: 'Major crypto exchange announces new token listing',
    time: '1 hour ago',
    icon: 'newspaper',
    color: '#2196F3',
  },
  {
    id: '5',
    type: 'news',
    title: 'Breaking News',
    message: 'Major crypto exchange announces new token listing',
    time: '1 hour ago',
    icon: 'newspaper',
    color: '#2196F3',
  },
  
];

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const translateY = useSharedValue(MODAL_HEIGHT);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withSpring(MODAL_HEIGHT, {
        damping: 20,
        stiffness: 90,
      });
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleBackdropPress = () => {
    onClose();
  };

  const renderNotification = (item: typeof notifications[0]) => (
    <Animated.View
      key={item.id}
      entering={FadeInRight.delay(300).springify()}
      style={[
        styles.notificationItem,
        { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
        <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
      </View>
      
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
            {item.title}
          </Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={[styles.notificationMessage, { color: isDark ? '#8E8E93' : '#666666' }]}>
          {item.message}
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <>
      {visible && (
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <BlurView intensity={30} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
            <TouchableOpacity 
              style={styles.backdropTouchable} 
              onPress={handleBackdropPress} 
              activeOpacity={1}
            />
          </BlurView>
        </Animated.View>
      )}
      
      <Animated.View style={[
        styles.modalContainer,
        modalStyle,
        { backgroundColor: isDark ? '#1C1C1E' : '#F8F8F8' },
      ]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <View style={styles.handle} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
              Notifications
            </Text>
            <TouchableOpacity
              style={[styles.clearButton, { backgroundColor: isDark ? '#2C2C2E' : '#FFFFFF' }]}
              onPress={() => console.log('Clear all')}
            >
              <Text style={[styles.clearButtonText, { color: isDark ? '#FFFFFF' : '#1a1a1a' }]}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.notificationList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {notifications.map(renderNotification)}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DEDEDE',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  notificationList: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 