import { z } from "zod";
import addToWindow from "../../../globalModules";

export class Form {
  formName: string; // Only unique within a species
  speciesId: string;
  isDefaultForm: boolean;
  abilityIds: string[];
  hiddenAbilityIds: string[];
  types: string[];
  baseStats: Statistics;
  evYields: Statistics;
  wildItems: SpeciesWildItem[];
  moves: {
    levelLearnset: SpeciesLevelMove[];
    tutorMoveIds: string[];
    eggMoveIds: string[];
  };

  constructor(
    speciesId: string,
    coreForm: ValidatedCoreForm,
    formOverrides?: ValidatedVariantForm
  ) {
    this.isDefaultForm = formOverrides === undefined;
    this.formName =
      formOverrides !== undefined ? formOverrides.formName : "default";
    const form = { ...coreForm, ...formOverrides };

    this.speciesId = form.speciesId ?? speciesId;

    this.abilityIds = form.abilityIds;
    this.hiddenAbilityIds = form.hiddenAbilityIds;
    this.types = form.types;
    this.baseStats = form.baseStats;
    this.evYields = form.evYields;
    this.wildItems = form.wildItems ?? [];
    this.moves = {
      levelLearnset: form.levelLearnset,
      tutorMoveIds: form.tutorMoveIds ?? [],
      eggMoveIds: form.eggMoveIds ?? [],
    };
  }

  // No static saved data stuff on the form class as it all gets stored in the species class

  static parseForms(val: unknown) {
    if (Array.isArray(val)) {
      return z.array(variantFormValidator).parse(val);
    }
    throw Error("Forms data must be an array");
  }

  static parseCoreForm(val: unknown) {
    return coreFormValidator.parse(val);
  }
}

const statisticsValidator = z.object({
  mhp: z.number().min(0).max(999).int(),
  atk: z.number().min(0).max(999).int(),
  def: z.number().min(0).max(999).int(),
  spatk: z.number().min(0).max(999).int(),
  spdef: z.number().min(0).max(999).int(),
  spd: z.number().min(0).max(999).int(),
});
type Statistics = z.infer<typeof statisticsValidator>;

const speciesLevelMoveValidator = z.object({
  level: z.number().int(),
  moveId: z.string(),
});
type SpeciesLevelMove = z.infer<typeof speciesLevelMoveValidator>;

const speciesWildItemValidator = z.object({
  itemId: z.string(),
  chance: z.number().min(0).max(1.0),
});
type SpeciesWildItem = z.infer<typeof speciesWildItemValidator>;

const coreFormValidator = z.object({
  abilityIds: z.array(z.string()),
  hiddenAbilityIds: z.array(z.string()),
  types: z.array(z.string()),
  baseStats: statisticsValidator,
  evYields: statisticsValidator,
  wildItems: z.array(speciesWildItemValidator).optional(),
  levelLearnset: z.array(speciesLevelMoveValidator),
  tutorMoveIds: z.array(z.string()).optional(),
  eggMoveIds: z.array(z.string()).optional(),
});

const variantFormValidator = coreFormValidator.partial().extend({
  speciesId: z.string(),
  formName: z
    .string()
    .refine((s) => s !== "default", "Form name can't be 'default'"),
});

// An individual pokemon form, belonging to a species
export type ValidatedVariantForm = z.infer<typeof variantFormValidator>;

export type ValidatedCoreForm = z.infer<typeof coreFormValidator>;

addToWindow("Form", Form);
