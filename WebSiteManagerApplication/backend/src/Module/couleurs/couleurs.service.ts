import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCouleurDto } from './dto/create-couleur.dto';
import { UpdateCouleurDto } from './dto/update-couleur.dto';
import { Couleur, CouleurDocument } from './schemas/couleur.schema';

@Injectable()
export class CouleurService {
  constructor(@InjectModel(Couleur.name) private couleurModel: Model<CouleurDocument>) {}

  async create(createCouleurDto: CreateCouleurDto): Promise<Couleur> {
    const couleur = new this.couleurModel(createCouleurDto);
    return couleur.save();
  }

  async findAll(): Promise<Couleur[]> {
    return this.couleurModel.find().exec();
  }

  async findOne(id: string): Promise<Couleur> {
    const couleur = await this.couleurModel.findById(id).exec();
    if (!couleur) {
      throw new NotFoundException(`Couleur with ID ${id} not found`);
    }
    return couleur;
  }

  async update(id: string, updateCouleurDto: UpdateCouleurDto): Promise<Couleur> {
    const updatedCouleur = await this.couleurModel.findByIdAndUpdate(id, updateCouleurDto, { new: true }).exec();
    if (!updatedCouleur) {
      throw new NotFoundException(`Couleur with ID ${id} not found`);
    }
    return updatedCouleur;
  }

  async remove(id: string): Promise<Couleur> {
    const deletedCouleur = await this.couleurModel.findByIdAndDelete(id).exec();
    if (!deletedCouleur) {
      throw new NotFoundException(`Couleur with ID ${id} not found`);
    }
    return deletedCouleur;
  }

  async findCouleurByEntreprise(entrepriseId: string): Promise<Couleur[]> {
            try {
              // const preference = await this.preferenceModel.findOne({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
              const couleurs = await this.couleurModel.find({ entreprise: entrepriseId }).exec();
              return couleurs; // Retourne null si aucune préférence n'est trouvée
            } catch (error) {
              throw new Error(`Erreur lors de la récupération des préférences par entreprise : ${error.message}`);
            }
          }
}
