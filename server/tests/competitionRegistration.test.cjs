const assert = require('node:assert/strict');
const { beforeEach, describe, test } = require('node:test');
const {
  fitsCompetitionRequirements,
} = require('../utils/competitionRegistration');

// The function compares local calendar dates, so fixtures use local dates too.
const participant = (overrides = {}) => ({
  birthDate: new Date(2000, 10, 4),
  weight: 70,
  gender: 'man',
  ...overrides,
});

const fits = (requirements, overrides) =>
  fitsCompetitionRequirements({ requirements }, participant(overrides));

describe('fitsCompetitionRequirements', () => {
  beforeEach((context) => {
    context.mock.timers.enable({
      apis: ['Date'],
      now: new Date(2026, 10, 4, 12).getTime(),
    });
  });

  test('accepts a participant when there are no requirements', () => {
    assert.equal(fits(undefined), true);
  });

  test('accepts a participant satisfying age, weight and gender together', () => {
    assert.equal(
      fits({
        ageCategory: { from: 18, to: 30 },
        weightCategory: { from: 60, to: 80 },
        gender: 'man',
      }),
      true
    );
  });

  for (const { name, birthDate, age, expected } of [
    {
      name: 'accepts the minimum age on the birthday',
      birthDate: new Date(2008, 10, 4),
      age: { from: 18, to: 30 },
      expected: true,
    },
    {
      name: 'rejects a participant one day short of the minimum age',
      birthDate: new Date(2008, 10, 5),
      age: { from: 18, to: 30 },
      expected: false,
    },
    {
      name: 'accepts the maximum age',
      birthDate: new Date(1996, 10, 4),
      age: { from: 18, to: 30 },
      expected: true,
    },
    {
      name: 'rejects a participant above the maximum age',
      birthDate: new Date(1995, 10, 4),
      age: { from: 18, to: 30 },
      expected: false,
    },
    {
      name: 'does not increment age before the birthday month',
      birthDate: new Date(2000, 11, 1),
      age: { from: 25, to: 25 },
      expected: true,
    },
    {
      name: 'increments age after the birthday month',
      birthDate: new Date(2000, 9, 30),
      age: { from: 26, to: 26 },
      expected: true,
    },
  ]) {
    test(name, () => {
      assert.equal(fits({ ageCategory: age }, { birthDate }), expected);
    });
  }

  for (const [weight, expected] of [
    [60, true],
    [80, true],
    [59.99, false],
    [80.01, false],
  ]) {
    test(`weight ${weight}: ${
      expected ? 'accepts inclusive boundary' : 'rejects outside range'
    }`, () => {
      assert.equal(
        fits({ weightCategory: { from: 60, to: 80 } }, { weight }),
        expected
      );
    });
  }

  test('checks gender even when age and weight match', () => {
    const requirements = {
      ageCategory: { from: 18, to: 30 },
      weightCategory: { from: 60, to: 80 },
      gender: 'woman',
    };
    assert.equal(fits(requirements, { gender: 'woman' }), true);
    assert.equal(fits(requirements, { gender: 'man' }), false);
  });

  test('allows either gender when no gender is specified', () => {
    assert.equal(fits({}, { gender: 'woman' }), true);
    assert.equal(fits({}, { gender: 'man' }), true);
  });

  test('uses inclusive default weight bounds of 0 and 1000', () => {
    assert.equal(fits({}, { weight: 0 }), true);
    assert.equal(fits({}, { weight: 1000 }), true);
    assert.equal(fits({}, { weight: -1 }), false);
    assert.equal(fits({}, { weight: 1000.01 }), false);
  });

  test('uses inclusive default age bounds of 0 and 119', () => {
    assert.equal(fits({}, { birthDate: new Date(2026, 10, 4) }), true);
    assert.equal(fits({}, { birthDate: new Date(1907, 10, 4) }), true);
    assert.equal(fits({}, { birthDate: new Date(1906, 10, 4) }), false);
    assert.equal(fits({}, { birthDate: new Date(2026, 10, 5) }), false);
  });

  test('uses defaults only for missing bounds, preserving an explicit zero', () => {
    assert.equal(
      fits({ weightCategory: { from: 60 } }, { weight: 1000 }),
      true
    );
    assert.equal(fits({ weightCategory: { to: 80 } }, { weight: 0 }), true);
    assert.equal(fits({ weightCategory: { to: 0 } }, { weight: 1 }), false);
    assert.equal(fits({ ageCategory: { from: 18 } }), true);
    assert.equal(fits({ ageCategory: { to: 0 } }), false);
  });

  test('rejects invalid or missing birth dates when requirements are checked', () => {
    assert.equal(fits({}, { birthDate: new Date('invalid') }), false);
    assert.equal(fits({}, { birthDate: undefined }), false);
  });

  test('rejects non-finite, missing or non-numeric weights', () => {
    for (const weight of [NaN, Infinity, -Infinity, undefined, '70']) {
      assert.equal(fits({}, { weight }), false);
    }
  });
});
