// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { CreateFormulaireDto } from './dto/create-formulaire.dto';
// import { UpdateFormulaireDto } from './dto/update-formulaire.dto';
// import { Formulaire, FormulaireDocument } from './schemas/formulaire.schema';
// import { Champ, ChampDocument } from './schemas/champ.schema';
// import { InputChamp, InputChampDocument } from './schemas/inputChamp.schema';
// import { CreateChampDto } from './dto/create-champ.dto';
// import { UpdateChampDto } from './dto/update-champ.dto';
// import { CreateInputChampDto } from './dto/create-inputChamp.dto';
// import { UpdateInputChampDto } from './dto/update-inputChamp.dto';

// @Injectable()
// export class FormulaireService {
//   constructor(
//             @InjectModel(Formulaire.name) private formulaireModel: Model<FormulaireDocument>,
//             @InjectModel(Champ.name) private champModel: Model<ChampDocument>,
//             @InjectModel(InputChamp.name) private inputChampModel: Model<InputChampDocument>
//         ) {}

//   async create(createFormulaireDto: CreateFormulaireDto): Promise<Formulaire> {
//     const formulaire = new this.formulaireModel(createFormulaireDto);
//     return formulaire.save();
//   }

//   async findAll(): Promise<Formulaire[]> {
//     return this.formulaireModel.find().exec();
//   }

//   async findOne(id: string): Promise<Formulaire> {
//     const formulaire = await this.formulaireModel.findById(id).exec();
//     if (!formulaire) {
//       throw new NotFoundException(`Formulaire with ID ${id} not found`);
//     }
//     return formulaire;
//   }

//   async update(id: string, updateFormulaireDto: UpdateFormulaireDto): Promise<Formulaire> {
//     const updatedFormulaire = await this.formulaireModel.findByIdAndUpdate(id, updateFormulaireDto, { new: true }).exec();
//     if (!updatedFormulaire) {
//       throw new NotFoundException(`Formulaire with ID ${id} not found`);
//     }
//     return updatedFormulaire;
//   }

//   async remove(id: string): Promise<Formulaire> {
//     const deletedFormulaire = await this.formulaireModel.findByIdAndDelete(id).exec();
//     if (!deletedFormulaire) {
//       throw new NotFoundException(`Formulaire with ID ${id} not found`);
//     }
//     return deletedFormulaire;
//   }

//   async findFormulairesByEntreprise(entrepriseId: string): Promise<Formulaire[]> {
//       try {
//         const formulaires = await this.formulaireModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
//         return formulaires;
//       } catch (error) {
//         throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
//       }
//     }





//     async createChamp(createChampDto: CreateChampDto): Promise<Champ> {
//         const champ = new this.champModel(createChampDto);
//         return champ.save();
//       }
    
//       async findAllChamps(): Promise<Champ[]> {
//         return this.champModel.find().exec();
//       }
    
//       async findOneChamp(id: string): Promise<Champ> {
//         const champ = await this.champModel.findById(id).exec();
//         if (!champ) {
//           throw new NotFoundException(`Champ with ID ${id} not found`);
//         }
//         return champ;
//       }
    
//       async updateChamp(id: string, updateChampDto: UpdateChampDto): Promise<Champ> {
//         const updatedChamp = await this.champModel.findByIdAndUpdate(id, updateChampDto, { new: true }).exec();
//         if (!updatedChamp) {
//           throw new NotFoundException(`Champ with ID ${id} not found`);
//         }
//         return updatedChamp;
//       }
    
//       async removeChamp(id: string): Promise<Champ> {
//         const deletedChamp = await this.champModel.findByIdAndDelete(id).exec();
//         if (!deletedChamp) {
//           throw new NotFoundException(`Champ with ID ${id} not found`);
//         }
//         return deletedChamp;
//       }




//       async createInputChamp(createInputChampDto: CreateInputChampDto): Promise<InputChamp> {
//         const inputChamp = new this.inputChampModel(createInputChampDto);
//         return inputChamp.save();
//       }
    
//       async findAllInputChamps(): Promise<InputChamp[]> {
//         return this.inputChampModel.find().exec();
//       }
    
//       async findOneInputChamp(id: string): Promise<InputChamp> {
//         const inputChamp = await this.inputChampModel.findById(id).exec();
//         if (!inputChamp) {
//           throw new NotFoundException(`inputChamp with ID ${id} not found`);
//         }
//         return inputChamp;
//       }
    
//       async updateInputChamp(id: string, updateInputChampDto: UpdateInputChampDto): Promise<InputChamp> {
//         const updatedInputChamp = await this.inputChampModel.findByIdAndUpdate(id, updateInputChampDto, { new: true }).exec();
//         if (!updatedInputChamp) {
//           throw new NotFoundException(`inputChamp with ID ${id} not found`);
//         }
//         return updatedInputChamp;
//       }
    
//       async removeInputChamp(id: string): Promise<InputChamp> {
//         const deletedInputChamp = await this.inputChampModel.findByIdAndDelete(id).exec();
//         if (!deletedInputChamp) {
//           throw new NotFoundException(`inputChamp with ID ${id} not found`);
//         }
//         return deletedInputChamp;
//       }


// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateFormulaireDto } from './dto/create-formulaire.dto';
import { UpdateFormulaireDto } from './dto/update-formulaire.dto';
import { Formulaire, FormulaireDocument } from './schemas/formulaire.schema';
import { Champ, ChampDocument } from './schemas/champ.schema';
import { CreateChampDto } from './dto/create-champ.dto';
import { UpdateChampDto } from './dto/update-champ.dto';
import { CreateInputChampDto } from './dto/create-inputChamp.dto';
import { UpdateInputChampDto } from './dto/update-inputChamp.dto';
import { InputChamp, InputChampDocument } from './schemas/inputChamp.schema';

@Injectable()
export class FormulaireService {
  constructor(
    @InjectModel(Formulaire.name) private formulaireModel: Model<FormulaireDocument>,
    @InjectModel(Champ.name) private champModel: Model<ChampDocument>,
    @InjectModel(InputChamp.name) private inputChampModel: Model<InputChampDocument>
  ) {}

  async create(createFormulaireDto: CreateFormulaireDto): Promise<Formulaire> {
    // 1. Create the champs first
    const createdChamps = await Promise.all(
      createFormulaireDto.champs.map(champDto => this.champModel.create(champDto))
    );

    // 2. Extract the IDs of the created champs
    const champIds = createdChamps.map(champ => champ._id);

    // 3. Create the formulaire with the champ IDs
    const formulaire = new this.formulaireModel({
      ...createFormulaireDto,
      champs: champIds,
    });
    return formulaire.save();
  }

  async findAll(): Promise<Formulaire[]> {
    return this.formulaireModel.find().populate('champs').exec();
  }

  async findOne(id: string): Promise<Formulaire> {
    const formulaire = await this.formulaireModel.findById(id).populate('champs').exec();
    if (!formulaire) {
      throw new NotFoundException(`Formulaire with ID ${id} not found`);
    }
    return formulaire;
  }

  async update(id: string, updateFormulaireDto: UpdateFormulaireDto): Promise<Formulaire> {
    const updatedFormulaire = await this.formulaireModel.findByIdAndUpdate(id, updateFormulaireDto, { new: true }).populate('champs').exec();
    if (!updatedFormulaire) {
      throw new NotFoundException(`Formulaire with ID ${id} not found`);
    }
    return updatedFormulaire;
  }

  async remove(id: string): Promise<Formulaire> {
    const deletedFormulaire = await this.formulaireModel.findByIdAndDelete(id).exec();
    if (!deletedFormulaire) {
      throw new NotFoundException(`Formulaire with ID ${id} not found`);
    }
    return deletedFormulaire;
  }

  // async findFormulairesByEntreprise(entrepriseId: string): Promise<Formulaire[]> {
  //   try {
  //     const formulaires = await this.formulaireModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).populate('champs').exec();
  //     return formulaires;
  //   } catch (error) {
  //     throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
  //   }
  // }
  
  async findFormulairesByEntreprise(entrepriseId: string): Promise<Formulaire[]> {
    console.log('Recherche formulaires pour entreprise', entrepriseId);
    const formulaires = await this.formulaireModel
      // .find({ entreprise: new Types.ObjectId(entrepriseId) })
      .find({ entreprise: entrepriseId })
      .populate('champs')
      .exec();
    console.log('Formulaires trouvés :', formulaires);
    return formulaires;
  }


  async createChamp(createChampDto: CreateChampDto): Promise<Champ> {
    const champ = new this.champModel(createChampDto);
    return champ.save();
  }

  async findAllChamps(): Promise<Champ[]> {
    return this.champModel.find().exec();
  }

  async findOneChamp(id: string): Promise<Champ> {
    const champ = await this.champModel.findById(id).exec();
    if (!champ) {
      throw new NotFoundException(`Champ with ID ${id} not found`);
    }
    return champ;
  }

  async updateChamp(id: string, updateChampDto: UpdateChampDto): Promise<Champ> {
    const updatedChamp = await this.champModel.findByIdAndUpdate(id, updateChampDto, { new: true }).exec();
    if (!updatedChamp) {
      throw new NotFoundException(`Champ with ID ${id} not found`);
    }
    return updatedChamp;
  }

  async removeChamp(id: string): Promise<Champ> {
    const deletedChamp = await this.champModel.findByIdAndDelete(id).exec();
    if (!deletedChamp) {
      throw new NotFoundException(`Champ with ID ${id} not found`);
    }
    return deletedChamp;
  }

  async createInputChamp(createInputChampDto: CreateInputChampDto): Promise<InputChamp> {
    const inputChamp = new this.inputChampModel(createInputChampDto);
    return inputChamp.save();
  }

  async findAllInputChamps(): Promise<InputChamp[]> {
    return this.inputChampModel.find().exec();
  }

  async findOneInputChamp(id: string): Promise<InputChamp> {
    const inputChamp = await this.inputChampModel.findById(id).exec();
    if (!inputChamp) {
      throw new NotFoundException(`inputChamp with ID ${id} not found`);
    }
    return inputChamp;
  }

  async updateInputChamp(id: string, updateInputChampDto: UpdateInputChampDto): Promise<InputChamp> {
    const updatedInputChamp = await this.inputChampModel.findByIdAndUpdate(id, updateInputChampDto, { new: true }).exec();
    if (!updatedInputChamp) {
      throw new NotFoundException(`inputChamp with ID ${id} not found`);
    }
    return updatedInputChamp;
  }

  async removeInputChamp(id: string): Promise<InputChamp> {
    const deletedInputChamp = await this.inputChampModel.findByIdAndDelete(id).exec();
    if (!deletedInputChamp) {
      throw new NotFoundException(`inputChamp with ID ${id} not found`);
    }
    return deletedInputChamp;
  }
}