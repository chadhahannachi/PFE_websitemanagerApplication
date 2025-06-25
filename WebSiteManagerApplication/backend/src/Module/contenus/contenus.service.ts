import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ContactUs, ContactUsDocument, Contenu, ContenuDocument, Unite, UniteDocument } from './schemas/contenu.schema';
import { ContenuSpecifique, ContenuSpecifiqueDocument } from './schemas/contenu.schema';  // Import the other models
import { Partenaire, PartenaireDocument } from './schemas/contenu.schema'; 
import { Temoignage, TemoignageDocument } from './schemas/contenu.schema';
import { FAQ, FAQDocument } from './schemas/contenu.schema';
import { Evenement, EvenementDocument } from './schemas/contenu.schema';
import { APropos, AProposDocument } from './schemas/contenu.schema';
// import { Article, ArticleDocument } from './schemas/contenu.schema';
import { Actualite, ActualiteDocument } from './schemas/contenu.schema';
import { Service, ServiceDocument } from './schemas/contenu.schema';
import { Solution, SolutionDocument } from './schemas/contenu.schema';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';
import { GeminiService } from './services/gemini.service';
import { GenerateContenuDto } from './dto/generate-contenu.dto';

@Injectable()
export class ContenuService {
  private readonly logger = new Logger(ContenuService.name);

  constructor(
    @InjectModel(Contenu.name) private contenuModel: Model<ContenuDocument>,
    @InjectModel(ContenuSpecifique.name) private contenuSpecifiqueModel: Model<ContenuSpecifiqueDocument>,
    @InjectModel(Partenaire.name) private partenaireModel: Model<PartenaireDocument>,
    @InjectModel(Temoignage.name) private temoignageModel: Model<TemoignageDocument>,
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(Evenement.name) private evenementModel: Model<EvenementDocument>,
    @InjectModel(APropos.name) private aProposModel: Model<AProposDocument>,
    // @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Actualite.name) private actualiteModel: Model<ActualiteDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
    @InjectModel(Solution.name) private solutionModel: Model<SolutionDocument>,
    @InjectModel(Unite.name) private uniteModel: Model<UniteDocument>,
    @InjectModel(ContactUs.name) private contactUsModel: Model<ContactUsDocument>,
    private geminiService: GeminiService
  ) {}

  async create(createContenuDto: CreateContenuDto, type: string): Promise<any> {
    let contenu;
    switch (type) {
      case 'ContenuSpecifique':
        contenu = new this.contenuSpecifiqueModel(createContenuDto);
        break;
      case 'Partenaire':
        contenu = new this.partenaireModel(createContenuDto);
        break;
      case 'Temoignage':
        contenu = new this.temoignageModel(createContenuDto);
        break;
      case 'FAQ':
        contenu = new this.faqModel(createContenuDto);
        break;
      case 'Evenement':
        contenu = new this.evenementModel(createContenuDto);
        break;
      case 'APropos':
        contenu = new this.aProposModel(createContenuDto);
        break;
      // case 'Article':
      //   contenu = new this.articleModel(createContenuDto);
      //   break;
      case 'Actualite':
        contenu = new this.actualiteModel(createContenuDto);
        break;
      case 'Service':
        contenu = new this.serviceModel(createContenuDto);
        break;
      case 'Solution':
        contenu = new this.solutionModel(createContenuDto);
        break;
      case 'Unite':
        contenu = new this.uniteModel(createContenuDto);
        break;
      case 'ContactUs':
          contenu = new this.contactUsModel(createContenuDto);
          break;
      default:
        contenu = new this.contenuModel(createContenuDto);
    }
    return contenu.save();
  }

  async findAll(type: string): Promise<any[]> {
    switch (type) {
      case 'ContenuSpecifique':
        return this.contenuSpecifiqueModel.find().exec();
      case 'Partenaire':
        return this.partenaireModel.find().exec();
      case 'Temoignage':
        return this.temoignageModel.find().exec();
      case 'FAQ':
        return this.faqModel.find().exec();   
      case 'Evenement':
        return this.evenementModel.find().exec();  
      case 'APropos':
        return this.aProposModel.find().exec();       
      // case 'Article':
      //   return this.articleModel.find().exec();        
      case 'Actualite':
        return this.actualiteModel.find().exec();       
      case 'Service':
        return this.serviceModel.find().exec();       
      case 'Solution':
        return this.solutionModel.find().exec();
      case 'Unite':
        return this.uniteModel.find().exec();
      case 'ContactUs':
          return this.contactUsModel.find().exec();
      default:
        return this.contenuModel.find().exec();
    }
  }

  async findOne(id: string, type: string): Promise<any> {
    switch (type) {
      case 'ContenuSpecifique':
        return this.contenuSpecifiqueModel.findById(id).exec();
      case 'Partenaire':
        return this.partenaireModel.findById(id).exec();
      case 'Temoignage':
        return this.temoignageModel.findById(id).exec();
      case 'FAQ':
        return this.faqModel.findById(id).exec();
      case 'Evenement':
        return this.evenementModel.findById(id).exec(); 
      case 'APropos':
        return this.aProposModel.findById(id).exec();      
      // case 'Article':
      //   return this.articleModel.findById(id).exec();        
      case 'Actualite':
        return this.actualiteModel.findById(id).exec();      
      case 'Service':
        return this.serviceModel.findById(id).exec();     
      case 'Solution':
        return this.solutionModel.findById(id).exec();
      case 'Unite':
        return this.uniteModel.findById(id).exec();
      case 'ContactUs':
          return this.contactUsModel.findById(id).exec();
            
      default:
        return this.contenuModel.findById(id).exec();
    }
  }

  async update(id: string, updateContenuDto: UpdateContenuDto, type: string): Promise<any> {
    let updatedContenu;
    switch (type) {
      case 'ContenuSpecifique':
        updatedContenu = await this.contenuSpecifiqueModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Partenaire':
        updatedContenu = await this.partenaireModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Temoignage':
        updatedContenu = await this.temoignageModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'FAQ':
        updatedContenu = await this.faqModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Evenement':
        updatedContenu = await this.evenementModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'APropos':
        updatedContenu = await this.aProposModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      // case 'Article':
      //   updatedContenu = await this.articleModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
      //   break;
      case 'Actualite':
        updatedContenu = await this.actualiteModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Service':
        updatedContenu = await this.serviceModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Solution':
        updatedContenu = await this.solutionModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'Unite':
        updatedContenu = await this.uniteModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
        break;
      case 'ContactUs':
          updatedContenu = await this.contactUsModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
          break;
      default:
        updatedContenu = await this.contenuModel.findByIdAndUpdate(id, updateContenuDto, { new: true }).exec();
    }

    if (!updatedContenu) {
      throw new NotFoundException(`Contenu with ID ${id} not found`);
    }
    return updatedContenu;
  }

  async remove(id: string, type: string): Promise<any> {
    let deletedContenu;
    switch (type) {
      case 'ContenuSpecifique':
        deletedContenu = await this.contenuSpecifiqueModel.findByIdAndDelete(id).exec();
        break;
      case 'Partenaire':
        deletedContenu = await this.partenaireModel.findByIdAndDelete(id).exec();
        break;
      case 'Temoignage':
        deletedContenu = await this.temoignageModel.findByIdAndDelete(id).exec();
        break;
      case 'FAQ':
        deletedContenu = await this.faqModel.findByIdAndDelete(id).exec();
        break;
      case 'Evenement':
        deletedContenu = await this.evenementModel.findByIdAndDelete(id).exec();
        break;
      case 'APropos':
        deletedContenu = await this.aProposModel.findByIdAndDelete(id).exec();
        break;
      // case 'Article':
      //   deletedContenu = await this.articleModel.findByIdAndDelete(id).exec();
      //   break;
      case 'Actualite':
        deletedContenu = await this.actualiteModel.findByIdAndDelete(id).exec();
        break;
      case 'Service':
        deletedContenu = await this.serviceModel.findByIdAndDelete(id).exec();
        break;
      case 'Solution':
        deletedContenu = await this.solutionModel.findByIdAndDelete(id).exec();
        break;
      case 'Unite':
        deletedContenu = await this.uniteModel.findByIdAndDelete(id).exec();
        break;
      case 'ContactUs':
          deletedContenu = await this.contactUsModel.findByIdAndDelete(id).exec();
          break;
      default:
        deletedContenu = await this.contenuModel.findByIdAndDelete(id).exec();
    }

    if (!deletedContenu) {
      throw new NotFoundException(`Contenu with ID ${id} not found`);
    }
    return deletedContenu;
  }



    async findContenuByEntreprise(type: string, entrepriseId: string): Promise<any[]> {
      try {
        // Pas de conversion en ObjectId car le champ entreprise est stocké comme une chaîne
        console.log(`Fetching ${type} for entrepriseId: ${entrepriseId}`);
  
        let result;
        switch (type) {
          case 'ContenuSpecifique':
            result = await this.contenuSpecifiqueModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Partenaire':
            result = await this.partenaireModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Temoignage':
            result = await this.temoignageModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'FAQ':
            result = await this.faqModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Evenement':
            result = await this.evenementModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'APropos':
            result = await this.aProposModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          // case 'Article':
          //   result = await this.articleModel
          //     .find({ entreprise: entrepriseId, isPublished: true })
          //     .exec();
          //   break;
          case 'Actualite':
            result = await this.actualiteModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Service':
            result = await this.serviceModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Solution':
            result = await this.solutionModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'Unite':
            result = await this.uniteModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          case 'ContactUs':
            result = await this.contactUsModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
            break;
          default:
            result = await this.contenuModel
              .find({ entreprise: entrepriseId, isPublished: true })
              .exec();
        }
  
        console.log(`Found ${result.length} ${type}(s) for entrepriseId: ${entrepriseId}`);
        return result;             
      } catch (error) {
        console.error(`Error in findContenuByEntreprise for type ${type}:`, error);
        throw new BadRequestException(`Error fetching contenu for entrepriseId ${entrepriseId}: ${error.message}`);
      }
    }



    async updateFaqStyles(id: string, styles: Record<string, any>): Promise<FAQ> {
      const updatedFaq = await this.faqModel.findByIdAndUpdate(
        id,
        { $set: { styles } },
        { new: true }
      ).exec();
  
      if (!updatedFaq) {
        throw new NotFoundException(`FAQ with ID ${id} not found`);
      }
      return updatedFaq;
    }


async updateUniteStyles(id: string, styles: Record<string, any>) {
  try {
    const updatedUnite = await this.uniteModel.findByIdAndUpdate(
      id,
      { $set: { styles } },
      { new: true }
    );
    if (!updatedUnite) {
      throw new NotFoundException(`Unite with ID ${id} not found`);
    }
    return updatedUnite;
  } catch (error) {
    throw new BadRequestException('Error updating unite styles');
  }
}

async updateServiceStyles(id: string, styles: Record<string, any>) {
  try {
    const updatedService = await this.serviceModel.findByIdAndUpdate(
      id,
      { $set: { styles } },
      { new: true }
    );
    if (!updatedService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return updatedService;
  } catch (error) {
    throw new BadRequestException('Error updating Service styles');
  }
}

  async updateSolutionStyles(id: string, styles: Record<string, any>): Promise<Solution> {
    try {
      const updatedSolution = await this.solutionModel.findByIdAndUpdate(
        id,
        { $set: { styles } },
        { new: true }
      );
      if (!updatedSolution) {
        throw new NotFoundException(`Solution with ID ${id} not found`);
      }
      return updatedSolution;
    } catch (error) {
      throw new BadRequestException('Error updating Solution styles');
    }
  }

  async updateEvenementStyles(id: string, styles: Record<string, any>): Promise<Evenement> {
    try {
      const updatedEvenement = await this.evenementModel.findByIdAndUpdate(
        id,
        { $set: { styles } },
        { new: true }
      );
      if (!updatedEvenement) {
        throw new NotFoundException(`Evenement with ID ${id} not found`);
      }
      return updatedEvenement;
    } catch (error) {
      throw new BadRequestException('Error updating Evenement styles');
    }
  }

  async generateContent(entrepriseId: string, generateDto: GenerateContenuDto): Promise<ContenuSpecifiqueDocument> {
    try {
      this.logger.log(`Generating content for entreprise ${entrepriseId}`);
      this.logger.debug('Generate DTO:', generateDto);

      // Generate content using Gemini
      const geminiResponse = await this.geminiService.generateContent(generateDto);
      this.logger.debug(`Generated content from Gemini: ${JSON.stringify(geminiResponse)}`);

      // No need to parse items here as Gemini now returns HTML and CSS directly

      const newContenu = new this.contenuSpecifiqueModel({
        titre: generateDto.title,
        description: generateDto.description,
        html_component: geminiResponse.html_component, // New field
        css_style: geminiResponse.css_style, // New field
        datePublication: new Date(),
        isPublished: false,
        entreprise: entrepriseId,
      });

      this.logger.debug(`Object to be saved: ${JSON.stringify(newContenu)}`); 

      const savedContenu = await newContenu.save();
      this.logger.debug(`Saved content: ${JSON.stringify(savedContenu)}`);
      return savedContenu;
    } catch (error) {
      this.logger.error('Error in generateContent:', error);
      this.logger.error('Error stack:', error.stack);
      throw error;
    }
  }
}
