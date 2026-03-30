import Modal from './modal';
import { IconInfoCircleFilled } from '@tabler/icons-react-native';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

type ModalComingSoonProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function ModalComingSoon({ isVisible, onClose }: ModalComingSoonProps) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      icon={
        <IconInfoCircleFilled
          strokeWidth={0}
          size={64}
          stroke={colorScheme === 'light' ? '#514DDF' : colors.indigo[600]}
          fill={colorScheme === 'light' ? '#514DDF' : colors.indigo[600]}
        />
      }
      title={t('coming_soon')}
      primaryButtonText={t('close')}
      onPrimaryButtonPress={onClose}
      secondaryButton={false}
      description={t('available_soon')}
    />
  );
}
