// Species are divided into 1 or more forms, including a default form
// Some things are defined on the species and others on the form
// In the JSON, all of the default form info is in the same object as the species
// However alternate forms are stored elsewhere

import { z } from "zod";
import addToWindow from "../../../globalModules";
import GrowthRate from "../hardcoded/growthRate";
import { Form } from "./form";

/**
 * This is the data of a Species PLUS a form
 * Each species + form combo will generate one of these
 */
export class Species {
  // Core Species data
  id: string;
  name: string;
  egg: {
    groups: string[];
    stepsToHatch: number;
  };
  growthRate: GrowthRate;
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  shape: string;
  color: string;
  genderRate: number; // Chance in 8ths of being female. -1 for genderless
  baseEXP: number;
  catchRate: number;
  baseHappiness: number;
  height: number;
  weight: number;
  genus: string;
  flavor: string;
  generation: number;

  // Info forms
  defaultForm: Form;
  variantForms: Form[];
  variantFormsByName: Map<string, Form>;

  constructor(
    species: ValidatedSpecies,
    defaultForm: Form,
    variantForms: Form[]
  ) {
    // Find growth rate
    const growthRate = GrowthRate.dataById.get(species.growthRate);
    if (!growthRate) {
      throw Error(
        `Invalid Growth Rate when creating species ${species.id}: ${species.growthRate}`
      );
    }
    // Species shit
    this.id = species.id;
    this.name = species.name;
    this.egg = species.egg;
    this.growthRate = growthRate;
    this.isBaby = species.isBaby ?? false;
    this.isLegendary = species.isLegendary ?? false;
    this.isMythical = species.isMythical ?? false;
    this.shape = species.shape;
    this.color = species.color;
    this.genderRate = species.genderRate;
    this.baseEXP = species.baseEXP;
    this.catchRate = species.catchRate;
    this.baseHappiness = species.baseHappiness;
    this.height = species.height;
    this.weight = species.weight;
    this.genus = species.genus;
    this.flavor = species.flavor;
    this.generation = species.generation || 0;

    this.defaultForm = defaultForm;
    this.variantForms = variantForms;
    this.variantFormsByName = new Map(
      variantForms.map((form) => [form.formName, form])
    );
  }

  // Static stuff

  static data: Species[] = [];
  static dataById = new Map<string, Species>();

  static register(Species: Species) {
    if (this.dataById.has(Species.id)) {
      throw Error(`Duplicate Species ${Species.id}`);
    }
    this.data.push(Species);
    this.dataById.set(Species.id, Species);
  }

  static processData(speciesVal: unknown, formVal: unknown) {
      console.log({ speciesVal, formVal })
    // First parse all the extra forms
    const allFormVariants = Form.parseForms(formVal);

    if (Array.isArray(speciesVal)) {
      speciesVal.forEach((item) => {
        // Parse the species itself
        const parsedSpecies = coreSpeciesValidator.parse(item);
        // Parse the species default form
        const parsedDefaultForm = Form.parseCoreForm(item);
        // Find all the species additional forms
        const parsedFormVariants = allFormVariants.filter(
          (form) => form.speciesId === parsedSpecies.id
        );

        // Create the actual forms
        const defaultForm = new Form(parsedSpecies.id, parsedDefaultForm);
        const formVariants = parsedFormVariants.map(
          (variant) => new Form(parsedSpecies.id, parsedDefaultForm, variant)
        );

        const species = new Species(parsedSpecies, defaultForm, formVariants);

        this.register(species);
      });
    } else {
      throw Error("Species data must be an array");
    }
  }
}

export type ValidatedSpecies = z.infer<typeof coreSpeciesValidator>;

const coreSpeciesValidator = z.object({
  id: z.string(),
  name: z.string(),
  egg: z.object({
    groups: z.array(z.string()),
    stepsToHatch: z.number(),
  }),
  growthRate: z.string(),
  isBaby: z.boolean().optional(),
  isLegendary: z.boolean().optional(),
  isMythical: z.boolean().optional(),
  shape: z.string(),
  color: z.string(),
  genderRate: z.number().min(-1).max(8).int(), // Chance in 8ths of being female. -1 for genderless
  baseEXP: z.number().min(0).max(999).int(),
  catchRate: z.number().min(0).max(255).int(),
  baseHappiness: z.number().min(0).max(255).int(),
  height: z.number(),
  weight: z.number(),
  genus: z.string(),
  flavor: z.string(),
  generation: z.number().int().optional(),
});

addToWindow("Species", Species);
