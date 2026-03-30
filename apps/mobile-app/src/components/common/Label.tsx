import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { COLORS } from '@/theme';

export type LabelProps = TextProps & {
  text: string;
};

export function Label({ text, style, ...rest }: LabelProps) {
  return (
    <Text style={[styles.text, style]} {...rest}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.text,
  },
});
