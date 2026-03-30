import { View, Text } from 'react-native';
import { IconGenderFemale, IconGenderMale } from '@tabler/icons-react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputText from './input-text';
import RadioGroup from './radio-group';
import ButtonPrimary from './button-primary';
import Dropdown from './dropdown';
import { getRelationshipData } from '@/data/common';
import { RelationshipItem } from '@/types/common';
import { useUserStore } from '@/store/user';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'nativewind';

type ModalDependantProps = {
  isVisible: boolean;
  onClose: () => void;
  onPress?: () => void;
  title: string;
};

export default function ModalDependant({
  isVisible,
  onClose,
  onPress,
  title,
}: ModalDependantProps) {
  const { t } = useTranslation();
  const addDependant = useUserStore((state) => state.addDependant);
  const { colorScheme } = useColorScheme();

  const dependantSchema = z.object({
    firstName: z.string().min(1, t('first_name_required')),
    lastName: z.string().min(1, t('last_name_required')),
    gender: z.string().min(1, t('gender_required')),
    relationship: z.string().min(1, t('relationship_required')),
  });

  type DependantFormData = z.infer<typeof dependantSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DependantFormData>({
    resolver: zodResolver(dependantSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      relationship: '',
    },
  });

  const onSubmit = (data: DependantFormData) => {
    addDependant(data);

    handleResetValue();
  };

  const handleResetValue = () => {
    reset({
      firstName: '',
      lastName: '',
      gender: '',
      relationship: '',
    });

    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleResetValue}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}>
      <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 gap-4">
        <Text className="text-slate-800 dark:text-slate-100 text-xl font-semibold">{title}</Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('first_name')}
              placeholder={t('enter_first_name')}
              onChangeText={onChange}
              value={value}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <InputText
              label={t('last_name')}
              placeholder={t('enter_last_name')}
              onChangeText={onChange}
              value={value}
              error={errors.lastName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View className="gap-3">
              <Text className="font-semibold text-slate-800 dark:text-slate-300">
                {t('gender')}
              </Text>

              <RadioGroup
                options={[
                  {
                    value: 'male',
                    label: t('male'),
                    icon: (
                      <IconGenderMale
                        color={colorScheme === 'light' ? '#514DDF' : colors.white}
                        size={32}
                      />
                    ),
                  },
                  {
                    value: 'female',
                    label: t('female'),
                    icon: (
                      <IconGenderFemale
                        color={colorScheme === 'light' ? '#514DDF' : colors.white}
                        size={32}
                      />
                    ),
                  },
                ]}
                selectedValue={value}
                onValueChange={onChange}
                error={errors.gender?.message}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="relationship"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              label={t('relationship')}
              placeholder={t('relationship_placeholder')}
              value={value}
              data={getRelationshipData(t)}
              onChange={(item: RelationshipItem) => onChange(item.value)}
              error={errors.relationship?.message}
            />
          )}
        />

        <ButtonPrimary
          text={t('save')}
          className="bg-primary rounded-2xl py-4 mt-4"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </Modal>
  );
}
