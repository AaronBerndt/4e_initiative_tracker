export type Card = {
  _id: string;
  id: string;
  name: string;
  class: string;
  level: string;
  type: string;
  action: string;
  keywords: string;
  sourceBook: string;
};

export type Cards = Card[];

export type Character = {
  _id: string;
  name: string;
  level: number;
  ancestry: string;
  class: string;
  paragonPath: string;
  epicDestiny: string;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    speed: number;
    initiative: number;
  };
  defeneses: {
    armorClass: number;
    fortitude: number;
    reflex: number;
    will: number;
  };
  feats: string[];
  powers: string[];
  inventory: Item[];
  skills: string[];
  gear: Gear;
  characterState: CharacterState;
};

export type CharacterState = {
  actionPoints: number;
  secondWind: number;
  deathSaves: number;
  temporaryHitpoints: number;
  damage: number;
  expendedSurges: number;
  expendedPowers: string[];
  effects: string[];
};

export type Item = {
  _id: string;
  amount: number;
};

export type Filter = {
  name: string;
  value: string;
};

export type Feat = {
  _id: string;
  id: string;
  name: string;
  tier: string;
  prerequisite: string;
  sourceBook: string;
};

export type Power = {
  _id: string;
  id: string;
  name: string;
  level: string;
  type: string;
  action: string;
  keywords: string;
  sourceBook: string;
};

export type SelectedPower = {
  name: string;
  type: string;
};

export type Gear = {
  weapons: string[];
  armor: string;
  shield: string;
  implement: string;
  arms: string;
  feet: string;
  hands: string;
  head: string;
  neck: string;
  rings: string[];
  waist: string;
};

export type Armor = {
  name: string;
  enhancement: string[];
  magicArmor: string;
};

export type Skill = {
  name: string;
  modifier: string;
  hasArmorPenality: boolean;
};

export type EffectProperty = {
  name:
    | "Dazed"
    | "Dominated"
    | "Dying"
    | "Buff"
    | "Debuff"
    | "Grabbed"
    | "Hidden"
    | "Immobilized"
    | "Deafened"
    | "Helpless"
    | "Blinded"
    | "Petrified"
    | "Removed from play"
    | "Restrained"
    | "Unconscious"
    | "Weakened"
    | "Prone"
    | "Stunned"
    | "Surprised"
    | "Slowed"
    | "Combat Advantage"
    | "Ongoing Damage";

  effectedAttribute?:
    | "strength"
    | "dexterity"
    | "constitution"
    | "intelligence"
    | "wisdom"
    | "charisma"
    | "ac"
    | "fortitude"
    | "reflex"
    | "attackRoll"
    | "damage"
    | "vulnerable"
    | "resist"
    | "immune"
    | "savingThrows"
    | "deathSaves"
    | "skillCheck"
    | "abilityCheck"
    | "speed";
  value?: number;
  damageType?: string;
  duration?: Duration;
};

export type Duration =
  | "saveEnds"
  | "endOfEncounter"
  | "trigger"
  | "enterZone"
  | "leaveZone"
  | "startOfEffectersTurn"
  | "endOfEffectersTurn"
  | "startOfEffectedTurn"
  | "endOfEffectedTurn"
  | "nextAttack"
  | "permanent";
