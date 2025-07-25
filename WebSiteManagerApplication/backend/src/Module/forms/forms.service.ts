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
import { ReponseFormulaire, ReponseFormulaireSchema } from './schemas/ReponseFormulaire.schema';
import { NotificationGateway } from '../notification/notification.gateway';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FormulaireService {
  constructor(
    @InjectModel(Formulaire.name) private formulaireModel: Model<FormulaireDocument>,
    @InjectModel(ReponseFormulaire.name) private reponseFormulaireModel: Model<ReponseFormulaire>,
    private readonly notificationGateway: NotificationGateway,
    private readonly authService: AuthService,
  ) {}

  async create(createFormulaireDto: CreateFormulaireDto): Promise<Formulaire> {
    // champs est maintenant un objet générique, on le stocke tel quel
    const formulaire = new this.formulaireModel({
      ...createFormulaireDto,
      champs: createFormulaireDto.champs,
    });
    return formulaire.save();
  }

  async findAll(): Promise<Formulaire[]> {
    // Plus de populate sur champs
    return this.formulaireModel.find().exec();
  }

  async findOne(id: string): Promise<Formulaire> {
    const formulaire = await this.formulaireModel.findById(id).exec();
    if (!formulaire) {
      throw new NotFoundException(`Formulaire with ID ${id} not found`);
    }
    return formulaire;
  }

  async update(id: string, updateFormulaireDto: UpdateFormulaireDto): Promise<Formulaire> {
    // champs est un objet générique
    const updatedFormulaire = await this.formulaireModel.findByIdAndUpdate(
      id,
      { ...updateFormulaireDto, champs: updateFormulaireDto.champs },
      { new: true }
    ).exec();
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
  
  async findFormulairesByEntreprise(entrepriseId: string): Promise<Formulaire[]> {
    console.log('Recherche formulaires pour entreprise', entrepriseId);
    const formulaires = await this.formulaireModel
      .find({ entreprise: entrepriseId })
      .exec();
    console.log('Formulaires trouvés :', formulaires);
    return formulaires;
  }

  // CRUD pour ReponseFormulaire
  async createReponseFormulaire(dto: { values: Record<string, any>, formulaire: string }): Promise<ReponseFormulaire> {
    const reponse = new this.reponseFormulaireModel(dto);
    const savedReponse = await reponse.save();
    
    try {
      // Récupérer le formulaire pour obtenir l'entreprise
      const formulaire = await this.formulaireModel.findById(dto.formulaire).exec();
      if (formulaire && formulaire.entreprise) {
        // Récupérer les utilisateurs de cette entreprise
        const users = await this.authService.findUsersByEntreprise(formulaire.entreprise.toString());
        
        // Filtrer seulement les superadminentreprise
        const superAdminEntreprise = users.filter(user => user.role === 'superadminentreprise');
        
        // Envoyer la notification seulement aux superadminentreprise de cette entreprise
        if (superAdminEntreprise.length > 0) {
          this.notificationGateway.sendNotificationToUsers(
            'newFormResponse', 
            `Nouvelle réponse de formulaire reçue (ID: ${savedReponse._id})`,
            superAdminEntreprise.map(user => user._id.toString())
          );
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
    
    return savedReponse;
  }

  async findAllReponseFormulaire(): Promise<ReponseFormulaire[]> {
    return this.reponseFormulaireModel.find().exec();
  }

  async findOneReponseFormulaire(id: string): Promise<ReponseFormulaire> {
    const reponse = await this.reponseFormulaireModel.findById(id).exec();
    if (!reponse) {
      throw new NotFoundException(`ReponseFormulaire with ID ${id} not found`);
    }
    return reponse;
  }

  async updateReponseFormulaire(id: string, dto: { values?: Record<string, any>, formulaire?: string }): Promise<ReponseFormulaire> {
    const updated = await this.reponseFormulaireModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException(`ReponseFormulaire with ID ${id} not found`);
    }
    return updated;
  }

  async removeReponseFormulaire(id: string): Promise<ReponseFormulaire> {
    const deleted = await this.reponseFormulaireModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`ReponseFormulaire with ID ${id} not found`);
    }
    return deleted;
  }

  async findReponsesByFormulaire(formulaireId: string): Promise<ReponseFormulaire[]> {
    return this.reponseFormulaireModel.find({ formulaire: formulaireId }).exec();
  }


}