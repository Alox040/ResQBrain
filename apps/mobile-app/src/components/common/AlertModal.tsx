import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { COLORS, SPACING } from '@/theme';
import { ButtonPrimary } from '@/components/common/ButtonPrimary';
import { ButtonSecondary } from '@/components/common/ButtonSecondary';

export type AlertModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  /** Fallback: help icon */
  icon?: React.ReactNode;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  onRequestClose?: () => void;
  contentStyle?: ViewStyle;
};

export function AlertModal({
  visible,
  title,
  message,
  icon,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  onRequestClose,
  contentStyle,
}: AlertModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.sheet, contentStyle]}>
          <View style={styles.inner}>
            {icon ?? (
              <Ionicons name="help-circle" size={56} color={COLORS.primary} />
            )}
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <View style={styles.actions}>
              <ButtonPrimary label={primaryLabel} onPress={onPrimaryPress} />
              {secondaryLabel ? (
                <ButtonSecondary
                  label={secondaryLabel}
                  onPress={
                    onSecondaryPress ??
                    onRequestClose ??
                    (() => undefined)
                  }
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: SPACING.screenPadding,
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.radius,
    overflow: 'hidden',
  },
  inner: {
    alignItems: 'center',
    padding: SPACING.screenPadding,
    gap: SPACING.gapMd,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: COLORS.text,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text,
    lineHeight: 22,
  },
  actions: {
    gap: SPACING.gapSm,
    width: '100%',
    marginTop: SPACING.gapMd,
  },
});
