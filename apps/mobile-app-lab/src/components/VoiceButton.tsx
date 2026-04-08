import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { colors, radius } from "../theme/tokens";

export type VoiceButtonProps = {
  /** Drives listening visual state externally — no internal toggle. */
  isListening?: boolean;
  onPress?: PressableProps["onPress"];
  style?: ViewStyle;
};

export function VoiceButton({
  isListening = false,
  onPress,
  style,
}: VoiceButtonProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [isListening, pulseAnim]);

  const micOpacity = isListening
    ? pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] })
    : 1;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isListening && styles.buttonListening,
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* Pulse ring — only when listening */}
      {isListening && (
        <Animated.View
          style={[styles.pulseRing, { opacity: pulseAnim }]}
        />
      )}

      {/*
       * Mic icon — replace with:
       * <Mic size={20} color={isListening ? colors.brand.primary : colors.text.subtle} />
       * from lucide-react-native
       */}
      <Animated.View
        style={[
          styles.micShape,
          isListening && styles.micShapeListening,
          { opacity: micOpacity },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  buttonListening: {
    backgroundColor: "rgba(220, 38, 38, 0.18)",
  },
  pressed: {
    transform: [{ scale: 0.88 }],
  },
  pulseRing: {
    borderColor: "rgba(220, 38, 38, 0.50)",
    borderRadius: radius.md,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  // Symbolic mic shape — replaced by icon library in implementation
  micShape: {
    backgroundColor: colors.text.subtle,
    borderRadius: 3,
    height: 18,
    width: 10,
  },
  micShapeListening: {
    backgroundColor: colors.brand.primary,
  },
});
