export const countItems = (number: number = 0) => {
  if (number >= 5) {
    return `${number} elementów`;
  } else if ([2, 3, 4].includes(number)) {
    return `${number} elementy`;
  } else if (number === 1) {
    return `${number} element`;
  } else {
    return 'Brak elementów';
  }
};
