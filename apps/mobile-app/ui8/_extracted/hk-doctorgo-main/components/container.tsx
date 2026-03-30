import React from 'react';
import { Edges, SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  bottom?: boolean;
  className?: string;
  rest?: any;
};

export default function Container({ children, bottom = true, className, ...rest }: ContainerProps) {
  const edges = ['top', bottom ? 'bottom' : ''] as Edges;

  return (
    <SafeAreaView
      edges={edges}
      className={`flex-1 px-6 bg-white dark:bg-slate-900 ${className}`}
      {...rest}>
      {children}
    </SafeAreaView>
  );
}
