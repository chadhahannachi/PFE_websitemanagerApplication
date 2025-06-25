import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu, MenuDocument } from './schemas/menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<MenuDocument>) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = new this.menuModel(createMenuDto);
    return menu.save();
  }

  async findAll(): Promise<Menu[]> {
    return this.menuModel.find().exec();
  }

  async findOne(id: string): Promise<Menu> {
    const menu = await this.menuModel.findById(id).exec();
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return menu;
  }

  async update(id: string, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const updatedMenu = await this.menuModel.findByIdAndUpdate(id, updateMenuDto, { new: true }).exec();
    if (!updatedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return updatedMenu;
  }

  async remove(id: string): Promise<Menu> {
    const deletedMenu = await this.menuModel.findByIdAndDelete(id).exec();
    if (!deletedMenu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }
    return deletedMenu;
  }

  async findMenusByEntreprise(entrepriseId: string): Promise<Menu[]> {
      try {
        const menus = await this.menuModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return menus;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }

      
}
