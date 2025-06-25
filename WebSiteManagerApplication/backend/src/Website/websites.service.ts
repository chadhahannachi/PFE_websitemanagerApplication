import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Website } from './schemas/website.schema';
import { CreateWebsiteDto } from './dto/create-website.dto';

@Injectable()
export class WebsiteService {
  constructor(@InjectModel(Website.name) private model: Model<Website>) {}

  async create(dto: CreateWebsiteDto): Promise<Website> {
    return this.model.create(dto);
  }

  async findByUser(userId: string): Promise<Website[]> {
    return this.model.find({ userId });
  }

  async findOne(id: string): Promise<Website> {
    return this.model.findById(id);
  }
}
