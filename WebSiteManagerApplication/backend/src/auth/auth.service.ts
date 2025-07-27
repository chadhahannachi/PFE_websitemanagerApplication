import { Injectable, BadRequestException, HttpException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { changePassDto } from './dto/changePass.dto';
import { EditProfileDto } from './dto/EditProfile.dto';
// import * as bcrypt from 'bcrypt';
import * as bcrypt from 'bcryptjs';
import {User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { Entreprise, EntrepriseDocument } from 'src/Module/entreprise/schemas/entreprise.schema';
import * as fs from 'fs';
import * as path from 'path';


function loadTemplate(templateName: string): string {
  // const filePath = path.join(__dirname, 'templates', templateName);
  const filePath = path.join(__dirname, '..', '..', 'src', 'auth', 'templates', templateName);
  return fs.readFileSync(filePath, 'utf8');
}

function fillTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
}
@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,

    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    @InjectModel(Entreprise.name) private entrepriseModel: Model<Entreprise>, 

  ) {}


  // async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
  //   const { nom, email, password, role} = signUpDto;

  //   console.log('Password reçu:', password);
  //   console.log('Type de password:', typeof password);

  //   if (!password || typeof password !== 'string') {
  //       throw new Error('Password is missing or not a string');
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   console.log('Nom de l\'entreprise recherché:', signUpDto.nomEntreprise);
  //   const entreprise = await this.entrepriseModel.findOne({ nom: new RegExp(`^${signUpDto.nomEntreprise.trim()}$`, 'i') });
  //   console.log('Entreprise trouvée:', entreprise);

  // if (!entreprise) {
  //   throw new NotFoundException('Entreprise non trouvée');
  // }

  //   const user = await this.userModel.create({
  //     nom,
  //     email,
  //     password: hashedPassword,
  //     entreprise: entreprise._id, // Stocker l'ID de l'entreprise
  //     role

  //   });

  //   const token = this.jwtService.sign({ id: user._id.toString() });

  //   return { token };
  // }

  

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { nom, email, password, role} = signUpDto;
  
    // Vérifier si l'email existe déjà
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Il existe déjà un compte avec cet email');
    }
  
    console.log('Password reçu:', password);
    console.log('Type de password:', typeof password);
  
    if (!password || typeof password !== 'string') {
        throw new Error('Password is missing or not a string');
    }
  
    // Validation du mot de passe
    if (password.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères');
    }
  
    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Le mot de passe doit contenir au moins une majuscule');
    }
  
    if (!/[a-z]/.test(password)) {
      throw new BadRequestException('Le mot de passe doit contenir au moins une minuscule');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    console.log('Nom de l\'entreprise recherché:', signUpDto.nomEntreprise);
    const entreprise = await this.entrepriseModel.findOne({ nom: new RegExp(`^${signUpDto.nomEntreprise.trim()}$`, 'i') });
    console.log('Entreprise trouvée:', entreprise);
  
    if (!entreprise) {
      throw new NotFoundException('Entreprise non trouvée');
    }
  
    const user = await this.userModel.create({
      nom,
      email,
      password: hashedPassword,
      entreprise: entreprise._id,
      role
    });

    // Envoi d'un email de bienvenue avec template
    const loginUrl = 'http://localhost:3000/login';
    
    // try {
    //   // HTML inline en attendant que les templates soient configurés
    //   const htmlContent = `
    //     <!DOCTYPE html>
    //     <html lang="fr">
    //     <head>
    //         <meta charset="UTF-8">
    //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //         <title>Bienvenue sur Abshore WebsiteManager</title>
    //         <style>
    //             body {
    //                 font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    //                 line-height: 1.6;
    //                 color: #333;
    //                 max-width: 600px;
    //                 margin: 0 auto;
    //                 padding: 20px;
    //                 background-color: #f4f4f4;
    //             }
    //             .email-container {
    //                 background-color: #ffffff;
    //                 border-radius: 10px;
    //                 padding: 30px;
    //                 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    //             }
    //             .header {
    //                 text-align: center;
    //                 margin-bottom: 30px;
    //             }
    //             .logo {
    //                 max-width: 200px;
    //                 height: auto;
    //                 margin-bottom: 20px;
    //             }
    //             .welcome-title {
    //                 color: #1976d2;
    //                 font-size: 24px;
    //                 font-weight: bold;
    //                 margin-bottom: 10px;
    //             }
    //             .content {
    //                 margin-bottom: 30px;
    //             }
    //             .credentials-box {
    //                 background-color: #f8f9fa;
    //                 border: 1px solid #e9ecef;
    //                 border-radius: 8px;
    //                 padding: 20px;
    //                 margin: 20px 0;
    //             }
    //             .credentials-title {
    //                 font-weight: bold;
    //                 color: #495057;
    //                 margin-bottom: 10px;
    //             }
    //             .credential-item {
    //                 margin: 8px 0;
    //             }
    //             .credential-label {
    //                 font-weight: 600;
    //                 color: #6c757d;
    //             }
    //             .credential-value {
    //                 color: #495057;
    //                 font-family: 'Courier New', monospace;
    //                 background-color: #e9ecef;
    //                 padding: 4px 8px;
    //                 border-radius: 4px;
    //             }
    //             .login-button {
    //                 display: inline-block;
    //                 background-color: #1976d2;
    //                 color: #ffffff;
    //                 text-decoration: none;
    //                 padding: 12px 30px;
    //                 border-radius: 6px;
    //                 font-weight: 600;
    //                 text-align: center;
    //                 margin: 20px 0;
    //                 transition: background-color 0.3s;
    //             }
    //             .login-button:hover {
    //                 background-color: #1565c0;
    //             }
    //             .footer {
    //                 text-align: center;
    //                 margin-top: 30px;
    //                 padding-top: 20px;
    //                 border-top: 1px solid #e9ecef;
    //                 color: #6c757d;
    //                 font-size: 14px;
    //             }
    //             .security-note {
    //                 background-color: #fff3cd;
    //                 border: 1px solid #ffeaa7;
    //                 border-radius: 6px;
    //                 padding: 15px;
    //                 margin: 20px 0;
    //                 color: #856404;
    //             }
    //         </style>
    //     </head>
    //     <body>
    //         <div class="email-container">
    //             <div class="header">
    //                 <img src="https://res.cloudinary.com/duvcpe6mx/image/upload/v1751908338/kgnqv73cahjes5yhjlsp.png" alt="Abshore Logo" class="logo">
    //                 <div class="welcome-title">Bienvenue sur Abshore WebsiteManager</div>
    //             </div>
                
    //             <div class="content">
    //                 <p>Bonjour <strong>${nom}</strong>,</p>
                    
    //                 <p>Votre compte a été créé avec succès sur <strong>Abshore WebsiteManager Application</strong> !</p>
                    
    //                 <p>Voici vos identifiants de connexion :</p>
                    
    //                 <div class="credentials-box">
    //                     <div class="credentials-title">🔐 Vos identifiants :</div>
    //                     <div class="credential-item">
    //                         <span class="credential-label">Email :</span>
    //                         <span class="credential-value">${email}</span>
    //                     </div>
    //                     <div class="credential-item">
    //                         <span class="credential-label">Mot de passe :</span>
    //                         <span class="credential-value">${password}</span>
    //                     </div>
    //                 </div>
                    
    //                 <div class="security-note">
    //                     <strong>⚠️ Important :</strong> Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.
    //                 </div>
                    
    //                 <p>Cliquez sur le bouton ci-dessous pour accéder à votre espace :</p>
                    
    //                 <div style="text-align: center;">
    //                     <a href="${loginUrl}" class="login-button">Se connecter</a>
    //                 </div>
    //             </div>
                
    //             <div class="footer">
    //                 <p>Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer cet email.</p>
    //                 <p>© 2024 Abshore WebsiteManager. Tous droits réservés.</p>
    //             </div>
    //         </div>
    //     </body>
    //     </html>
    //   `;
      
    //   await this.mailerService.sendMail({
    //     to: email,
    //     subject: 'Bienvenue sur Abshore WebsiteManager Application',
    //     html: htmlContent,
    //   });
    //   console.log('Email de bienvenue envoyé avec succès à:', email);
    // } 
    try {
      const rawTemplate = loadTemplate('welcome-email.html');
      const htmlContent = fillTemplate(rawTemplate, {
        nom,
        email,
        password,
        loginUrl: 'http://localhost:3000/login',
      });
    
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bienvenue sur Abshore WebsiteManager Application',
        html: htmlContent,
      });
    
      console.log('Email de bienvenue envoyé avec succès à:', email);
     
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error.message);
      // Ne pas bloquer le signup si l'email échoue
    }

    const token = this.jwtService.sign({ id: user._id.toString() });
  
    return { token };
  }


  async login(loginDto: LoginDto): Promise<{ id: string, token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.constructor.name };
    const token = this.jwtService.sign(payload);

    return { id: user._id.toString(), token };
  }



  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      throw new Error(`Erreur lors de la recherche de l'utilisateur : ${error.message}`);
    }
  }

  // async update(id: string, body: SignUpDto) {
  //   if (!Types.ObjectId.isValid(id)) {
  //     throw new BadRequestException('Invalid user ID');
  //   }
  //   return this.userModel.findByIdAndUpdate(id, body, { new: true });
  // }

  async update(id: string, body: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }
  
    const updateData: any = {};
  
    // Champs de base
    if (body.nom) updateData.nom = body.nom;
    if (body.image) updateData.image = body.image;
    if (body.email) updateData.email = body.email;
    if (body.tel) updateData.tel = body.tel;
    if (body.role) updateData.role = body.role;
  
    // Traitement de l'entreprise
    if (body.nomEntreprise) {
      const entreprise = await this.entrepriseModel.findOne({ 
        nom: new RegExp(`^${body.nomEntreprise.trim()}$`, 'i') 
      });
      
      if (!entreprise) {
        throw new NotFoundException('Entreprise non trouvée');
      }
      
      updateData.entreprise = entreprise._id;
    }
  
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
    
    // Retourner avec l'entreprise peuplée
    return await this.userModel.findById(id).populate('entreprise', 'nom');
  }


  async delete(id: string) {
    try {
      const result = await this.userModel.deleteOne({ _id: id });
  
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
  
      return { success: true, message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'utilisateur : ${error.message}`);
    }
  }
  

  async findByEmail(email: string): Promise<User> {
    console.log('Recherche d\'utilisateur par email :', email);
    return this.userModel.findOne({ email });
  }

  async updateProfile(id: string, body: EditProfileDto): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }

      if (body.nom) {
        user.nom = body.nom;
      }
      if (body.email) {
        user.email = body.email;
      }
      if (body.password) {
        user.password = body.password;
      }
      if (body.image) {
        user.image = body.image;
      }

      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error.message}`);
    }
  }


  async changePass(changePassDto: changePassDto, user: User) {
    try {
      if (changePassDto.confirmNewPass !== changePassDto.newPass) {
        throw new HttpException(
          'La confirmation du mot de passe ne correspond pas au mot de passe',
          HttpStatus.BAD_REQUEST,
        );
      }
      const currentUser = await this.userModel.findById(user._id);

      if (!currentUser) {
        throw new HttpException(
          'Utilisateur introuvable. Veuillez vous connecter à nouveau.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(changePassDto.newPass, salt);
      const updatedUser = await this.userModel.findByIdAndUpdate(
        user._id,
        { password: hashedPassword, salt: salt },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Erreur lors du changement de mot de passe: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async updateUserValue(id: string, updatedFields: Record<string, any>): Promise<User> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: updatedFields },
        { new: true }
      );

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // async findOneById(id: string): Promise<User> {
  //   if (!id) {
  //     throw new BadRequestException('ID is required');
  //   }

  //   try {
  //     console.log('Trying to find user with ID:', id);
  //     const user = await this.userModel.findById(id).exec();
  //     if (!user) {
  //       throw new NotFoundException(`User with ID ${id} not found`);
  //     }
  //     console.log('User found:', user); 
  //     return user;
  //   } catch (error) {
  //     console.error('Error finding user:', error); 
  //     throw new Error(`Error finding user: ${error.message}`);
  //   }
  // }

  async findOneById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('ID is required');
    }
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  async getProfile(user: User) {
    try {
      const userProfile = await this.userModel.findById(user._id);
      if (!userProfile) {
        throw new HttpException(
          'Utilisateur introuvable. Veuillez vous reconnecter.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return userProfile;
    } catch (error) {
      throw new HttpException(
        `Une erreur s'est produite lors de la récupération du profil : ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async addUser(userData: Partial<User>): Promise<User> {
    try {
      const newUser = new this.userModel(userData);
      return await newUser.save();
    } catch (error) {
      throw new BadRequestException(`Erreur lors de l'ajout du user : ${error.message}`);
    }
  }
  async findUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

async findSuperAdminABshore(): Promise<User[]> {
  return this.userModel.find({ role: Role.SuperAdminABshore }).exec();
}
 
  async findSuperAdminEnt(): Promise<User[]> {
    return this.userModel.find({ role: Role.SuperAdminEntreprise }).exec();
  }

  
  async findModerateur(): Promise<User[]> {
    return this.userModel.find({ role: Role.Moderateur }).populate('entreprise', 'nom').exec();
  }

  async findVisiteur(): Promise<User[]> {
    return this.userModel.find({ role: Role.Visiteur }).exec();
  }


  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const token = this.jwtService.sign({ userId: user._id, role: user.role }, { expiresIn: '1h' });
    const url = `http://localhost:3001/new-password/${token}`;
    const htmlContent = `
      <p>Bonjour ${user.nom},</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <p><a href="${url}">Réinitialiser le mot de passe</a></p>
      <p>Ce lien expire dans une heure.</p>
    `;
    await this.mailerService.sendMail({ 
      to: email,
      subject: 'Password Reset',
      html: htmlContent,
    });
  }
  
  private async findUserByEmail(email: string): Promise<any> {
    let user = await this.userModel.findOne({ email }).exec();
    if (user) return { ...user.toObject(), role: 'user' };
  
    return null;
  }

  
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);
      const { userId, role } = payload;
  
      let user;
      if (role === 'user') {
        user = await this.userModel.findById(userId).exec();
      } 
  
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    } catch (e) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async findUsersByEntreprise(entrepriseId: string): Promise<User[]> {
    try {
      const users = await this.userModel.find({ entreprise: new Types.ObjectId(entrepriseId) }).exec();
      return users;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des utilisateurs par entreprise : ${error.message}`);
    }
  }


}
