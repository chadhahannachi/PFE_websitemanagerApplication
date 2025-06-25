import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Layout } from "./layout.schema";

@Injectable()
export class LayoutService {
  constructor(@InjectModel(Layout.name) private layoutModel: Model<Layout>) {}

  async getLayout(): Promise<Layout> {
    return this.layoutModel.findOne() || new this.layoutModel({ sections: [] });
  }

  async updateLayout(sections: { id: number; type: string }[]): Promise<Layout> {
    return this.layoutModel.findOneAndUpdate({}, { sections }, { new: true, upsert: true });
  }
}
