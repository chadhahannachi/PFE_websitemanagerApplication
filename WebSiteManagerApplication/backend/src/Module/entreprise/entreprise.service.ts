import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntrepriseDto } from './dto/create-entreprise.dto';
import { UpdateEntrepriseDto } from './dto/update-entreprise.dto';
import { Entreprise, EntrepriseDocument } from './schemas/entreprise.schema';

@Injectable()
export class EntrepriseService {
  constructor(@InjectModel(Entreprise.name) private entrepriseModel: Model<EntrepriseDocument>) {}

  async create(createEntrepriseDto: CreateEntrepriseDto): Promise<Entreprise> {
    const entreprise = new this.entrepriseModel(createEntrepriseDto);
    return entreprise.save();
  }

  async findAll(): Promise<Entreprise[]> {
    return this.entrepriseModel.find().exec();
  }

  async findOne(id: string): Promise<Entreprise> {
    const entreprise = await this.entrepriseModel.findById(id).exec();
    if (!entreprise) {
      throw new NotFoundException(`Entreprise with ID ${id} not found`);
    }
    return entreprise;
  }

  async update(id: string, updateEntrepriseDto: UpdateEntrepriseDto): Promise<Entreprise> {
    const updatedEntreprise = await this.entrepriseModel.findByIdAndUpdate(id, updateEntrepriseDto, { new: true }).exec();
    if (!updatedEntreprise) {
      throw new NotFoundException(`Entreprise with ID ${id} not found`);
    }
    return updatedEntreprise;
  }

  async remove(id: string): Promise<Entreprise> {
    const deletedEntreprise = await this.entrepriseModel.findByIdAndDelete(id).exec();
    if (!deletedEntreprise) {
      throw new NotFoundException(`Entreprise with ID ${id} not found`);
    }
    return deletedEntreprise;
  }

  
}
