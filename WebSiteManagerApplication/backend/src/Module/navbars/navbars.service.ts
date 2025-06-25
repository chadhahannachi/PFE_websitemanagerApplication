import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNavbarDto } from './dto/create-navbar.dto';
import { UpdateNavbarDto } from './dto/update-navbar.dto';
import { Navbar, NavbarDocument } from './schemas/navbar.schema';

@Injectable()
export class NavbarService {
  constructor(@InjectModel(Navbar.name) private navbarModel: Model<NavbarDocument>) {}

  async create(createNavbarDto: CreateNavbarDto): Promise<Navbar> {
    const navbar = new this.navbarModel(createNavbarDto);
    return navbar.save();
  }

  async findAll(): Promise<Navbar[]> {
    return this.navbarModel.find().exec();
  }

  async findOne(id: string): Promise<Navbar> {
    const navbar = await this.navbarModel.findById(id).exec();
    if (!navbar) {
      throw new NotFoundException(`Navbar with ID ${id} not found`);
    }
    return navbar;
  }

  async update(id: string, updateNavbarDto: UpdateNavbarDto): Promise<Navbar> {
    const updatedNavbar = await this.navbarModel.findByIdAndUpdate(id, updateNavbarDto, { new: true }).exec();
    if (!updatedNavbar) {
      throw new NotFoundException(`Navbar with ID ${id} not found`);
    }
    return updatedNavbar;
  }

  async remove(id: string): Promise<Navbar> {
    const deletedNavbar = await this.navbarModel.findByIdAndDelete(id).exec();
    if (!deletedNavbar) {
      throw new NotFoundException(`Navbar with ID ${id} not found`);
    }
    return deletedNavbar;
  }

  async findNavbarsByEntreprise(entrepriseId: string): Promise<Navbar[]> {
      try {
        const navbars = await this.navbarModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
        return navbars;
      } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
      }
    }

      
}
