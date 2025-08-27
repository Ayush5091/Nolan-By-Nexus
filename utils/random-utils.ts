// Utility functions for generating random data

// Generate a random ID string
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Generate a random integer between min and max (inclusive)
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate a random item from an array
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random boolean with a given probability of being true
export const getRandomBoolean = (probabilityOfTrue: number = 0.5): boolean => {
  return Math.random() < probabilityOfTrue;
};

// Generate a random date between two dates
export const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Format a date as a string (YYYY-MM-DD)
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

