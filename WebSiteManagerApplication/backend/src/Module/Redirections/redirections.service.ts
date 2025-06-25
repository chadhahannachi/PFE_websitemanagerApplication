import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateRedirectionDto } from './dto/create-redirection.dto';
import { UpdateRedirectionDto } from './dto/update-redirection.dto';
import { Redirection, RedirectionDocument } from './schemas/redirection.schema';

@Injectable()
export class RedirectionService {
  constructor(@InjectModel(Redirection.name) private redirectionModel: Model<RedirectionDocument>) {}

  async create(createRedirectionDto: CreateRedirectionDto): Promise<Redirection> {
    const redirection = new this.redirectionModel(createRedirectionDto);
    return redirection.save();
  }

  async findAll(): Promise<Redirection[]> {
    return this.redirectionModel.find().exec();
  }

  async findOne(id: string): Promise<Redirection> {
    const redirection = await this.redirectionModel.findById(id).exec();
    if (!redirection) {
      throw new NotFoundException(`Redirection with ID ${id} not found`);
    }
    return redirection;
  }

  async update(id: string, updateRedirectionDto: UpdateRedirectionDto): Promise<Redirection> {
    const updatedRedirection = await this.redirectionModel.findByIdAndUpdate(id, updateRedirectionDto, { new: true }).exec();
    if (!updatedRedirection) {
      throw new NotFoundException(`Redirection with ID ${id} not found`);
    }
    return updatedRedirection;
  }

  async remove(id: string): Promise<Redirection> {
    const deletedRedirection = await this.redirectionModel.findByIdAndDelete(id).exec();
    if (!deletedRedirection) {
      throw new NotFoundException(`Redirection with ID ${id} not found`);
    }
    return deletedRedirection;
  }

  async findRedirectionsByEntreprise(entrepriseId: string): Promise<Redirection[]> {
      try {
        const redirections = await this.redirectionModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return redirections;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }
}
