import { fireEvent, render, screen } from '@testing-library/react-native';

import type { RestStep as RestStepModel } from '../model/step';
import { RestStep } from './rest-step';

jest.mock('./rest-ring', () => ({
  RestRing: ({ children }: { children: React.ReactNode }) => children,
}));

const restStep: RestStepModel = { kind: 'rest', sectionKey: 'powerSet', durationSeconds: 60 };

const renderRestStep = async () => {
  const onNext = jest.fn();
  const onAdjustRest = jest.fn();
  await render(
    <RestStep
      step={restStep}
      timer={{ kind: 'paused', remainingMs: 60_000 }}
      onNext={onNext}
      onAdjustRest={onAdjustRest}
    />,
  );
  return { onNext, onAdjustRest };
};

describe('RestStep', () => {
  it('adds 15 seconds', async () => {
    const { onAdjustRest } = await renderRestStep();

    await fireEvent.press(screen.getByRole('button', { name: 'Add 15 seconds' }));

    expect(onAdjustRest).toHaveBeenCalledWith(15_000);
  });

  it('removes 15 seconds', async () => {
    const { onAdjustRest } = await renderRestStep();

    await fireEvent.press(screen.getByRole('button', { name: 'Remove 15 seconds' }));

    expect(onAdjustRest).toHaveBeenCalledWith(-15_000);
  });

  it('calls next when skipping the rest', async () => {
    const { onNext } = await renderRestStep();

    await fireEvent.press(screen.getByRole('button', { name: 'Skip rest' }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
