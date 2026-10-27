export const DEFAULT_WORKOUT_ID = '1qxS37UJepjiXhLPVqM8tX';

export const WORKOUTS_QUERY = /* GraphQL */ `
  query Workouts {
    workoutCollection(limit: 50) {
      items {
        sys {
          id
        }
        name
        description
        levelIndex
        picture {
          url
        }
        warmUp
        powerSet
        coolDown
      }
    }
  }
`;

export const WORKOUT_QUERY = /* GraphQL */ `
  query Workout($id: String!) {
    workoutCollection(where: { sys: { id_in: [$id] } }, limit: 1) {
      items {
        sys {
          id
        }
        name
        description
        levelIndex
        picture {
          url
        }
        warmUp
        powerSet
        coolDown
      }
    }
  }
`;
