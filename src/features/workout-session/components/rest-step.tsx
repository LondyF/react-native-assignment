import { Pressable, Text, View } from 'react-native';

import { useCountdown } from '../hooks/use-countdown';
import { formatClock } from '../model/format-clock';
import type { RestStep as RestStepModel } from '../model/step';
import type { Timer } from '../model/timer';
import { RestRing } from './rest-ring';

const ADJUST_SECONDS = 15;
const MS_PER_SECOND = 1000;

// Hardcoded form tips for now.
const FORM_TIPS = [
  { title: 'Posture Check', body: 'Keep your chest up and drive through your feet.' },
  { title: 'Breathing Cadence', body: 'Inhale on the way down, exhale as you push up.' },
];

type RestStepProps = {
  step: RestStepModel;
  timer: Timer | null;
  onNext: () => void;
  onAdjustRest: (deltaMs: number) => void;
};

type AdjustButtonProps = {
  seconds: number;
  onPress: () => void;
};

const AdjustButton = ({ seconds, onPress }: AdjustButtonProps) => {
  const label = `${seconds > 0 ? 'Add' : 'Remove'} ${Math.abs(seconds)} seconds`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="rounded-md border border-primary px-4 py-2 active:opacity-80"
    >
      <Text className="font-label text-xs text-primary">
        {seconds > 0 ? '+' : '-'}
        {Math.abs(seconds)}&quot;
      </Text>
    </Pressable>
  );
};

export const RestStep = ({ step, timer, onNext, onAdjustRest }: RestStepProps) => {
  const remainingMs = useCountdown(timer, onNext);

  const handleAdd = () => onAdjustRest(ADJUST_SECONDS * MS_PER_SECOND);

  const handleRemove = () => onAdjustRest(-ADJUST_SECONDS * MS_PER_SECOND);

  return (
    <View className="flex-1 gap-4 px-4 pt-4">
      {timer ? (
        <RestRing timer={timer} totalMs={step.durationSeconds * MS_PER_SECOND}>
          <Text
            accessibilityRole="timer"
            accessibilityLabel={`${formatClock(remainingMs)} remaining`}
            className="font-heading text-6xl text-ink"
          >
            {formatClock(remainingMs)}
          </Text>
        </RestRing>
      ) : null}
      <View className="flex-row justify-center gap-4">
        <AdjustButton seconds={-ADJUST_SECONDS} onPress={handleRemove} />
        <AdjustButton seconds={ADJUST_SECONDS} onPress={handleAdd} />
      </View>
      <View className="gap-2">
        <Text className="font-label text-xs uppercase tracking-wide text-ink">Quick form tips</Text>
        {FORM_TIPS.map((tip) => (
          <View key={tip.title} className="rounded-md border border-border bg-surface p-3">
            <Text className="font-label text-xs text-ink">{tip.title}</Text>
            <Text className="font-body text-xs text-ink-muted">{tip.body}</Text>
          </View>
        ))}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Skip rest"
        onPress={onNext}
        className="mt-auto items-center pb-4 active:opacity-80"
      >
        <Text className="font-heading text-sm uppercase tracking-wide text-primary">Skip rest</Text>
      </Pressable>
    </View>
  );
};
