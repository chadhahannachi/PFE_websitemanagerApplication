import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide, SlideDocument } from './schemas/slide.schema';

@Injectable()
export class SlideService {
  constructor(@InjectModel(Slide.name) private slideModel: Model<SlideDocument>) {}

  async create(createSlideDto: CreateSlideDto): Promise<Slide> {
    const slide = new this.slideModel(createSlideDto);
    return slide.save();
  }

  async findAll(): Promise<Slide[]> {
    return this.slideModel.find().exec();
  }

  async findOne(id: string): Promise<Slide> {
    const slide = await this.slideModel.findById(id).exec();
    if (!slide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return slide;
  }

  async update(id: string, updateSlideDto: UpdateSlideDto): Promise<Slide> {
    const updatedSlide = await this.slideModel.findByIdAndUpdate(id, updateSlideDto, { new: true }).exec();
    if (!updatedSlide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return updatedSlide;
  }

  async remove(id: string): Promise<Slide> {
    const deletedSlide = await this.slideModel.findByIdAndDelete(id).exec();
    if (!deletedSlide) {
      throw new NotFoundException(`Slide with ID ${id} not found`);
    }
    return deletedSlide;
  }
  
      
  // async findSlideByEntreprise(entrepriseId: string): Promise<Slide[]> {
  //       try {
  //         const slides = await this.slideModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
  //         return slides;
  //       } catch (error) {
  //         throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
  //       }
  //     }


  
      async findSlideByEntreprise(entrepriseId: string): Promise<Slide[]> {
          try {
            // const preference = await this.preferenceModel.findOne({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
            const slides = await this.slideModel.find({ entreprise: entrepriseId }).exec();
            return slides; // Retourne null si aucune préférence n'est trouvée
          } catch (error) {
            throw new Error(`Erreur lors de la récupération des préférences par entreprise : ${error.message}`);
          }
        }
}
