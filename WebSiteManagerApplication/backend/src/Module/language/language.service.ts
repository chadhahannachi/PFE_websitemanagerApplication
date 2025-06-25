import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language, LanguageDocument } from './schemas/language.schema';

@Injectable()
export class LanguageService {
  constructor(@InjectModel(Language.name) private languageModel: Model<LanguageDocument>) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const language = new this.languageModel(createLanguageDto);
    return language.save();
  }

  async findAll(): Promise<Language[]> {
    return this.languageModel.find().exec();
  }

  async findOne(id: string): Promise<Language> {
    const language = await this.languageModel.findById(id).exec();
    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return language;
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto): Promise<Language> {
    const updatedLanguage = await this.languageModel.findByIdAndUpdate(id, updateLanguageDto, { new: true }).exec();
    if (!updatedLanguage) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return updatedLanguage;
  }

  async remove(id: string): Promise<Language> {
    const deletedLanguage = await this.languageModel.findByIdAndDelete(id).exec();
    if (!deletedLanguage) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }
    return deletedLanguage;
  }
  
  async findLanguageByEntreprise(entrepriseId: string): Promise<Language[]> {
        try {
          const languages = await this.languageModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
          return languages;
        } catch (error) {
          throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
        }
      }
  
      
}
