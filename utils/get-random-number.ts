const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export default getRandomNumber;
