import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { UpdateKeywordDto } from './dto/update-keyword.dto';
import { Keyword, KeywordDocument } from './schemas/keyword.schema';

@Injectable()
export class KeywordService {
  constructor(@InjectModel(Keyword.name) private keywordModel: Model<KeywordDocument>) {}

  async create(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    const keyword = new this.keywordModel(createKeywordDto);
    return keyword.save();
  }

  async findAll(): Promise<Keyword[]> {
    return this.keywordModel.find().exec();
  }

  async findOne(id: string): Promise<Keyword> {
    const keyword = await this.keywordModel.findById(id).exec();
    if (!keyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }
    return keyword;
  }

  async update(id: string, updateKeywordDto: UpdateKeywordDto): Promise<Keyword> {
    const updatedKeyword = await this.keywordModel.findByIdAndUpdate(id, updateKeywordDto, { new: true }).exec();
    if (!updatedKeyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }
    return updatedKeyword;
  }

  async remove(id: string): Promise<Keyword> {
    const deletedKeyword = await this.keywordModel.findByIdAndDelete(id).exec();
    if (!deletedKeyword) {
      throw new NotFoundException(`Keyword with ID ${id} not found`);
    }
    return deletedKeyword;
  }

  async findKeywordsByEntreprise(entrepriseId: string): Promise<Keyword[]> {
      try {
        const keywords = await this.keywordModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return keywords;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }

      
}
