import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCookieDto } from './dto/create-cookie.dto';
import { UpdateCookieDto } from './dto/update-cookie.dto';
import { Cookie, CookieDocument } from './schemas/cookie.schema';

@Injectable()
export class CookieService {
  constructor(@InjectModel(Cookie.name) private cookieModel: Model<CookieDocument>) {}

  async create(createCookieDto: CreateCookieDto): Promise<Cookie> {
    const cookie = new this.cookieModel(createCookieDto);
    return cookie.save();
  }

  async findAll(): Promise<Cookie[]> {
    return this.cookieModel.find().exec();
  }

  async findOne(id: string): Promise<Cookie> {
    const cookie = await this.cookieModel.findById(id).exec();
    if (!cookie) {
      throw new NotFoundException(`Cookie with ID ${id} not found`);
    }
    return cookie;
  }

  async update(id: string, updateCookieDto: UpdateCookieDto): Promise<Cookie> {
    const updatedCookie = await this.cookieModel.findByIdAndUpdate(id, updateCookieDto, { new: true }).exec();
    if (!updatedCookie) {
      throw new NotFoundException(`Cookie with ID ${id} not found`);
    }
    return updatedCookie;
  }

  async remove(id: string): Promise<Cookie> {
    const deletedCookie = await this.cookieModel.findByIdAndDelete(id).exec();
    if (!deletedCookie) {
      throw new NotFoundException(`Cookie with ID ${id} not found`);
    }
    return deletedCookie;
  }

  async findCookiesByEntreprise(entrepriseId: string): Promise<Cookie[]> {
      try {
        const cookies = await this.cookieModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return cookies;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }

      
}
