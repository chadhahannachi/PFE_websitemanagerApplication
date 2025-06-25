// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { CreatePreferenceDto } from './dto/create-preference.dto';
// import { UpdatePreferenceDto } from './dto/update-preference.dto';
// import { Preference, PreferenceDocument } from './schemas/preference.schema';

// @Injectable()
// export class PreferenceService {
//   constructor(@InjectModel(Preference.name) private preferenceModel: Model<PreferenceDocument>) {}

//   async create(createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
//     const preference = new this.preferenceModel(createPreferenceDto);
//     return preference.save();
//   }

//   // async createOrUpdate(entreprise: string, preferencesData: Record<string, number>): Promise<Preference> {
//   //   const existingPreferences = await this.preferenceModel.findOne({ entreprise }).exec();

//   //   if (existingPreferences) {
//   //     existingPreferences.preferences = preferencesData;
//   //     return existingPreferences.save();
//   //   } else {
//   //     const newPreferences = new this.preferenceModel({
//   //       entreprise,
//   //       preferences: preferencesData,
//   //     });
//   //     return newPreferences.save();
//   //   }
//   // }

//   async createOrUpdate(entreprise: string, preferencesData: Record<string, any>): Promise<Preference> {
//     const existingPreferences = await this.preferenceModel.findOne({ entreprise }).exec();

//     if (existingPreferences) {
//       existingPreferences.preferences = { ...existingPreferences.preferences, ...preferencesData };
//       return existingPreferences.save();
//     } else {
//       const newPreferences = new this.preferenceModel({
//         entreprise,
//         preferences: preferencesData,
//       });
//       return newPreferences.save();
//     }
//   }

//   async findAll(): Promise<Preference[]> {
//     return this.preferenceModel.find().exec();
//   }

//   async findOne(id: string): Promise<Preference> {
//     const preference = await this.preferenceModel.findById(id).exec();
//     if (!preference) {
//       throw new NotFoundException(`Preference with ID ${id} not found`);
//     }
//     return preference;
//   }

//   async findPreferenceByEntreprise(entrepriseId: string): Promise<Preference | null> {
//     try {
//       // const preference = await this.preferenceModel.findOne({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
//       const preference = await this.preferenceModel.findOne({ entreprise: entrepriseId }).exec();
//       return preference; // Retourne null si aucune préférence n'est trouvée
//     } catch (error) {
//       throw new Error(`Erreur lors de la récupération des préférences par entreprise : ${error.message}`);
//     }
//   }

//   async update(id: string, updatePreferenceDto: UpdatePreferenceDto): Promise<Preference> {
//     const updatedPreference = await this.preferenceModel.findByIdAndUpdate(id, updatePreferenceDto, { new: true }).exec();
//     if (!updatedPreference) {
//       throw new NotFoundException(`Preference with ID ${id} not found`);
//     }
//     return updatedPreference;
//   }

//   async remove(id: string): Promise<Preference> {
//     const deletedPreference = await this.preferenceModel.findByIdAndDelete(id).exec();
//     if (!deletedPreference) {
//       throw new NotFoundException(`Preference with ID ${id} not found`);
//     }
//     return deletedPreference;
//   }
// }


import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { Preference, PreferenceDocument } from './schemas/preference.schema';

// Fonction de fusion profonde
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

// Validation des styles et positions
function isValidPosition(pos: any): boolean {
  return pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
}

function isValidStyle(style: any): boolean {
  return style && typeof style === 'object' && Object.keys(style).length > 0;
}

function validatePreferences(preferences: any): void {
  if (!preferences || typeof preferences !== 'object') {
    throw new BadRequestException('Préférences invalides');
  }

  for (const contentType of Object.keys(preferences)) {
    const styles = preferences[contentType];
    for (const styleKey of Object.keys(styles)) {
      const config = styles[styleKey];
      if (config.positions) {
        for (const element of Object.keys(config.positions)) {
          if (!isValidPosition(config.positions[element])) {
            throw new BadRequestException(`Position invalide pour ${contentType}.${styleKey}.${element}`);
          }
        }
      }
      if (config.styles) {
        for (const element of Object.keys(config.styles)) {
          if (!isValidStyle(config.styles[element])) {
            throw new BadRequestException(`Style invalide pour ${contentType}.${styleKey}.${element}`);
          }
        }
      }
    }
  }
}

@Injectable()
export class PreferenceService {
  constructor(@InjectModel(Preference.name) private preferenceModel: Model<PreferenceDocument>) {}

  async create(createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
    validatePreferences(createPreferenceDto.preferences);
    const preference = new this.preferenceModel(createPreferenceDto);
    return preference.save();
  }

  async createOrUpdate(entreprise: string, preferencesData: Record<string, any>): Promise<Preference> {
    validatePreferences(preferencesData);
    const existingPreferences = await this.preferenceModel.findOne({ entreprise }).exec();
    if (existingPreferences) {
      existingPreferences.preferences = deepMerge(existingPreferences.preferences, preferencesData);
      return existingPreferences.save();
    } else {
      const newPreferences = new this.preferenceModel({
        entreprise,
        preferences: preferencesData,
      });
      return newPreferences.save();
    }
  }

  async findAll(): Promise<Preference[]> {
    return this.preferenceModel.find().exec();
  }

  async findOne(id: string): Promise<Preference> {
    const preference = await this.preferenceModel.findById(id).exec();
    if (!preference) {
      throw new NotFoundException(`Preference with ID ${id} not found`);
    }
    return preference;
  }

  async findPreferenceByEntreprise(entrepriseId: string): Promise<Preference | null> {
    try {
      const preference = await this.preferenceModel.findOne({ entreprise: entrepriseId }).exec();
      return preference;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des préférences par entreprise : ${error.message}`);
    }
  }

  async update(id: string, updatePreferenceDto: UpdatePreferenceDto): Promise<Preference> {
    validatePreferences(updatePreferenceDto.preferences);
    const updatedPreference = await this.preferenceModel.findByIdAndUpdate(id, updatePreferenceDto, { new: true }).exec();
    if (!updatedPreference) {
      throw new NotFoundException(`Preference with ID ${id} not found`);
    }
    return updatedPreference;
  }

  async remove(id: string): Promise<Preference> {
    const deletedPreference = await this.preferenceModel.findByIdAndDelete(id).exec();
    if (!deletedPreference) {
      throw new NotFoundException(`Preference with ID ${id} not found`);
    }
    return deletedPreference;
  }
}