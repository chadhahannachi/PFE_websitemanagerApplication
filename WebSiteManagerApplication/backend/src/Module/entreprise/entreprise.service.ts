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
    const entreprise = new this.entrepriseModel({
      ...createEntrepriseDto,
      isDeleted: false,
    });
    return entreprise.save();
  }

  async findAll(): Promise<Entreprise[]> {
    return this.entrepriseModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findOne(id: string): Promise<Entreprise> {
    const entreprise = await this.entrepriseModel.findOne({ _id: id, isDeleted: { $ne: true } }).exec();
    if (!entreprise) {
      throw new NotFoundException(`Entreprise with ID ${id} not found`);
    }
    return entreprise;
  }

  async update(id: string, updateEntrepriseDto: UpdateEntrepriseDto): Promise<Entreprise> {
    const updatedEntreprise = await this.entrepriseModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      updateEntrepriseDto,
      { new: true }
    ).exec();
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

  async archiveEntreprise(id: string): Promise<Entreprise> {
    const archived = await this.entrepriseModel.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { isDeleted: true },
      { new: true }
    ).exec();
    if (!archived) {
      throw new NotFoundException(`Entreprise with ID ${id} not found or already archived`);
    }
    return archived;
  }

  async findArchived(): Promise<Entreprise[]> {
    return this.entrepriseModel.find({ isDeleted: true }).exec();
  }

  async restoreEntreprise(id: string): Promise<Entreprise> {
    const restored = await this.entrepriseModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false },
      { new: true }
    ).exec();
    if (!restored) {
      throw new NotFoundException(`Entreprise with ID ${id} not found or not archived`);
    }
    return restored;
  }
}
