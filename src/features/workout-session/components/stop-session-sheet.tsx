import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Icon } from '@/components/icon';

import { STOP_REASONS, type StopReason } from '../model/stop-reasons';

type StopSessionSheetProps = {
  onEnd: () => void;
  onContinueLater: () => void;
  onClose: () => void;
};

type ReasonRowProps = {
  reason: StopReason;
  isSelected: boolean;
  onSelect: (reason: StopReason) => void;
};

const ReasonRow = ({ reason, isSelected, onSelect }: ReasonRowProps) => {
  const handlePress = () => onSelect(reason);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={reason}
      accessibilityState={{ checked: isSelected }}
      onPress={handlePress}
      className="flex-row items-center gap-3 py-3 active:opacity-80"
    >
      <View
        className={`h-5 w-5 items-center justify-center rounded-full border ${isSelected ? 'border-primary' : 'border-track'}`}
      >
        {isSelected ? <View className="h-2.5 w-2.5 rounded-full bg-primary" /> : null}
      </View>
      <Text className="font-body text-sm text-ink">{reason}</Text>
    </Pressable>
  );
};

export const StopSessionSheet = ({ onEnd, onContinueLater, onClose }: StopSessionSheetProps) => {
  const [reason, setReason] = useState<StopReason | null>(null);
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="gap-4 bg-background px-4 pt-6" style={{ paddingBottom: bottom + 16 }}>
      <View className="flex-row items-center justify-between">
        <Text accessibilityRole="header" className="font-heading text-base text-ink">
          What stopped you?
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={12}
          onPress={onClose}
          className="active:opacity-80"
        >
          <Icon name="xmark" tone="ink" />
        </Pressable>
      </View>
      <View accessibilityRole="radiogroup">
        {STOP_REASONS.map((stopReason) => (
          <ReasonRow
            key={stopReason}
            reason={stopReason}
            isSelected={reason === stopReason}
            onSelect={setReason}
          />
        ))}
      </View>
      <View className="gap-2">
        <Button label="End workout" onPress={onEnd} disabled={reason === null} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue later"
          onPress={onContinueLater}
          className="items-center px-6 py-3 active:opacity-80"
        >
          <Text className="font-heading text-sm uppercase tracking-wide text-primary">
            Continue later
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
