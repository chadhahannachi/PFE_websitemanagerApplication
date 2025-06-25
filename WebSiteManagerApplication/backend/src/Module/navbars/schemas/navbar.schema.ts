import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Entreprise } from 'src/Module/entreprise/schemas/entreprise.schema';
import { Menu } from 'src/Module/menus/schemas/menu.schema';


export type NavbarDocument = Navbar & Document;


@Schema()
export class Navbar extends Document {
  
  @Prop()
  titre: string;
 
  @Prop()
  logo: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Menu' }] }) // Relation 1..* avec Menu
  menus: Menu[];

  
   @Prop({ type: Types.ObjectId, ref: 'Entreprise' })
    entreprise: Entreprise;
}

export const NavbarSchema = SchemaFactory.createForClass(Navbar);