import { useEffect } from "react";
import { StyleSheet, Animated, View, Dimensions } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

 const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const logoScale = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);
  const sloganOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      // Logo animation
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Slogan animation
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Delay before completing
      setTimeout(onComplete, 500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <FontAwesome5 name="asterisk" size={60} color="#FF6B35" />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
          },
        ]}
      >
        <Animated.Text style={styles.believeText}>Believe</Animated.Text>
        <Animated.Text style={styles.screenerText}>Screener</Animated.Text>
      </Animated.View>

      <Animated.Text
        style={[
          styles.sloganText,
          {
            opacity: sloganOpacity,
          },
        ]}
      >
        Screen smarter, invest better
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#fff5f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  believeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  screenerText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FF6B35",
  },
  sloganText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
});

export default SplashScreen;