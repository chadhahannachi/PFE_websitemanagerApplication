import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page, PageDocument } from './schemas/page.schema';

@Injectable()
export class PageService {
  constructor(@InjectModel(Page.name) private pageModel: Model<PageDocument>) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    const page = new this.pageModel(createPageDto);
    return page.save();
  }

  async findAll(): Promise<Page[]> {
    return this.pageModel.find().exec();
  }

  async findOne(id: string): Promise<Page> {
    const page = await this.pageModel.findById(id).exec();
    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const updatedPage = await this.pageModel.findByIdAndUpdate(id, updatePageDto, { new: true }).exec();
    if (!updatedPage) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return updatedPage;
  }

  async remove(id: string): Promise<Page> {
    const deletedPage = await this.pageModel.findByIdAndDelete(id).exec();
    if (!deletedPage) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }
    return deletedPage;
  }

  async findPagesByEntreprise(entrepriseId: string): Promise<Page[]> {
      try {
        const pages = await this.pageModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return pages;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }

    // async linkRedirectionToPage(pageId: string, redirectionId: string): Promise<Page> {
    //     return this.pageModel.findByIdAndUpdate(
    //       pageId,
    //       { redirection: redirectionId },
    //       { new: true, runValidators: true }
    //     );
    //   }
      
}
