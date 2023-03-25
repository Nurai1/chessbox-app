export const getWeightCategoryForUnder11YearsOld = (weightKg: number) => {
  if (weightKg < 25) {
    return '-25';
  }
  if (weightKg < 28) {
    return '-28';
  }
  if (weightKg < 31) {
    return '-31';
  }
  if (weightKg < 35) {
    return '-35';
  }
  if (weightKg < 40) {
    return '-40';
  }
  if (weightKg < 45) {
    return '-45';
  }
  if (weightKg < 50) {
    return '-50';
  }
  if (weightKg < 55) {
    return '-55';
  }
  return '+55';
};

export const getWeightCategoryFor12And13YearsOld = (weightKg: number) => {
  if (weightKg < 30) {
    return '-30';
  }
  if (weightKg < 33) {
    return '-33';
  }
  if (weightKg < 37) {
    return '-37';
  }
  if (weightKg < 41) {
    return '-41';
  }
  if (weightKg < 45) {
    return '-45';
  }
  if (weightKg < 50) {
    return '-50';
  }
  if (weightKg < 55) {
    return '-55';
  }
  if (weightKg < 60) {
    return '-60';
  }
  if (weightKg < 65) {
    return '-65';
  }
  return '+65';
};

export const getWeightCategoryFor14And15YearsOldWoman = (weightKg: number) => {
  if (weightKg < 39) {
    return '-39';
  }
  if (weightKg < 42) {
    return '-42';
  }
  if (weightKg < 46) {
    return '-46';
  }
  if (weightKg < 50) {
    return '-50';
  }
  if (weightKg < 55) {
    return '-55';
  }
  if (weightKg < 62) {
    return '-62';
  }
  if (weightKg < 69) {
    return '-69';
  }
  return '+69';
};

export const getWeightCategoryFor14And15YearsOldMan = (weightKg: number) => {
  if (weightKg < 39) {
    return '-39';
  }
  if (weightKg < 42) {
    return '-42';
  }
  if (weightKg < 46) {
    return '-46';
  }
  if (weightKg < 50) {
    return '-50';
  }
  if (weightKg < 55) {
    return '-55';
  }
  if (weightKg < 60) {
    return '-60';
  }
  if (weightKg < 65) {
    return '-65';
  }
  if (weightKg < 71) {
    return '-71';
  }
  if (weightKg < 78) {
    return '-78';
  }
  return '+78';
};

export const getWeightCategoryFor16And17YearsOld = (weightKg: number) => {
  if (weightKg < 49) {
    return '-49';
  }
  if (weightKg < 52) {
    return '-52';
  }
  if (weightKg < 56) {
    return '-56';
  }
  if (weightKg < 60) {
    return '-60';
  }
  if (weightKg < 64) {
    return '-64';
  }
  if (weightKg < 69) {
    return '-69';
  }
  if (weightKg < 75) {
    return '-75';
  }
  if (weightKg < 81) {
    return '-81';
  }
  return '+81';
};

export const getWeightCategoryFor18To40YearsOldWoman =
  getWeightCategoryFor16And17YearsOld;

export const getWeightCategoryFor18To40YearsOldMan = (weightKg: number) => {
  if (weightKg < 52) {
    return '-52';
  }
  if (weightKg < 56) {
    return '-56';
  }
  if (weightKg < 60) {
    return '-60';
  }
  if (weightKg < 64) {
    return '-64';
  }
  if (weightKg < 69) {
    return '-69';
  }
  if (weightKg < 75) {
    return '-75';
  }
  if (weightKg < 81) {
    return '-81';
  }
  if (weightKg < 91) {
    return '-91';
  }
  return '+91';
};

export const getWeightCategoryForAbove40YearsOldWoman = (weightKg: number) => {
  if (weightKg < 55) {
    return '-55';
  }
  if (weightKg < 65) {
    return '-65';
  }
  if (weightKg < 75) {
    return '-75';
  }
  if (weightKg < 85) {
    return '-85';
  }
  return '+85';
};

export const getWeightCategoryForAbove40YearsOldMan = (weightKg: number) => {
  if (weightKg < 64) {
    return '-64';
  }
  if (weightKg < 70) {
    return '-70';
  }
  if (weightKg < 80) {
    return '-80';
  }
  if (weightKg < 90) {
    return '-90';
  }
  return '+90';
};
