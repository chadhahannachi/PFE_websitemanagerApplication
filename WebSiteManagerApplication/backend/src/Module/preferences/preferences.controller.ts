// import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
// import { CreatePreferenceDto } from './dto/create-preference.dto';
// import { UpdatePreferenceDto } from './dto/update-preference.dto';
// import { PreferenceService } from './preferences.service';
// import { Preference } from './schemas/preference.schema';

// @Controller('preferences')
// export class PreferenceController {
//   constructor(private readonly preferenceService: PreferenceService) {}

//   @Post()
//   create(@Body() createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
//     return this.preferenceService.create(createPreferenceDto);
//   }

//   @Post('entreprise')
//   async createOrUpdate(@Body() body: { entreprise: string; preferences: Record<string, number> }): Promise<Preference> {
//     try {
//       const { entreprise, preferences } = body;
//       return await this.preferenceService.createOrUpdate(entreprise, preferences);
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get()
//   findAll(): Promise<Preference[]> {
//     return this.preferenceService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string): Promise<Preference> {
//     return this.preferenceService.findOne(id);
//   }

//   @Get('entreprise/:entrepriseId/preferences')
//   async getPreferencesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Preference | { preferences: Record<string, number> }> {
//     try {
//       const preference = await this.preferenceService.findPreferenceByEntreprise(entrepriseId);
//       if (!preference) {
//         // Retourner des préférences par défaut si aucune n'est trouvée
//         return { preferences: { solutionsStyle: 0, eventsStyle: 0, newsStyle: 0, faqStyle: 0 } };
//       }
//       return preference;
//     } catch (error) {
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updatePreferenceDto: UpdatePreferenceDto): Promise<Preference> {
//     return this.preferenceService.update(id, updatePreferenceDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string): Promise<Preference> {
//     return this.preferenceService.remove(id);
//   }
// }


import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { PreferenceService } from './preferences.service';
import { Preference } from './schemas/preference.schema';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  @Post()
  create(@Body() createPreferenceDto: CreatePreferenceDto): Promise<Preference> {
    return this.preferenceService.create(createPreferenceDto);
  }

  @Post('entreprise')
  async createOrUpdate(@Body() body: { entreprise: string; preferences: Record<string, any> }): Promise<Preference> {
    try {
      const { entreprise, preferences } = body;
      if (!entreprise || !preferences) {
        throw new HttpException('Entreprise ID and preferences are required', HttpStatus.BAD_REQUEST);
      }
      return await this.preferenceService.createOrUpdate(entreprise, preferences);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  findAll(): Promise<Preference[]> {
    return this.preferenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Preference> {
    return this.preferenceService.findOne(id);
  }

  @Get('entreprise/:entrepriseId/preferences')
  async getPreferencesByEntreprise(@Param('entrepriseId') entrepriseId: string): Promise<Preference | { preferences: Record<string, any> }> {
    try {
      const preference = await this.preferenceService.findPreferenceByEntreprise(entrepriseId);
      if (!preference) {
        // Retourner des préférences par défaut si aucune n'est trouvée
        return { preferences: { solutionsStyle: 0, eventsStyle: 0, newsStyle: 0, faqStyle: 0 } };
      }
      return preference;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenceDto: UpdatePreferenceDto): Promise<Preference> {
    return this.preferenceService.update(id, updatePreferenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Preference> {
    return this.preferenceService.remove(id);
  }
}