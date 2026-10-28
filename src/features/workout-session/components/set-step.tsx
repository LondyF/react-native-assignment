import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';

import type { SetStep as SetStepModel } from '../model/step';
import { CurrentExercise } from './current-exercise';
import { PlayerControls } from './player-controls';

const NON_DIGIT = /\D/g;
const NON_DECIMAL = /[^\d.,]/g;

type SetStepProps = {
  step: SetStepModel;
  canGoPrevious: boolean;
  onNext: () => void;
  onSkip: () => void;
  onPrevious: () => void;
};

type NumberFieldProps = {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType: KeyboardTypeOptions;
  disallowed: RegExp;
  onChangeText: (value: string) => void;
};

const NumberField = ({
  label,
  value,
  placeholder,
  keyboardType,
  disallowed,
  onChangeText,
}: NumberFieldProps) => {
  const handleChangeText = (text: string) => onChangeText(text.replace(disallowed, ''));

  return (
    <View className="flex-1 gap-1">
      <Text className="font-label text-xs text-ink">{label}</Text>
      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        className="rounded-md border border-track h-11 bg-surface px-3 pt-0 pb-1 text-center font-body text-sm text-ink"
      />
    </View>
  );
};

export const SetStep = ({ step, canGoPrevious, onNext, onSkip, onPrevious }: SetStepProps) => {
  const [kgs, setKgs] = useState('');
  const [reps, setReps] = useState(String(step.reps));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 py-4"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <CurrentExercise step={step} />
        <View className="flex-row gap-4">
          <NumberField
            label="Kgs"
            value={kgs}
            placeholder="0"
            keyboardType="decimal-pad"
            disallowed={NON_DECIMAL}
            onChangeText={setKgs}
          />
          <NumberField
            label="Reps"
            value={reps}
            keyboardType="number-pad"
            disallowed={NON_DIGIT}
            onChangeText={setReps}
          />
        </View>
      </ScrollView>
      <View className="px-4 pb-4">
        <PlayerControls
          canGoPrevious={canGoPrevious}
          onPrevious={onPrevious}
          onNext={onSkip}
          primaryIcon="checkmark"
          primaryLabel="Complete set"
          onPrimaryPress={onNext}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
