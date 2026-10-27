import { useRouter } from 'expo-router';

import { WorkoutList } from '@/features/workout';

const WorkoutListScreen = () => {
  const router = useRouter();

  const handleSelectWorkout = (workoutId: string) => {
    router.push({ pathname: '/workout/[id]', params: { id: workoutId } });
  };

  return <WorkoutList onSelectWorkout={handleSelectWorkout} />;
};

export default WorkoutListScreen;
