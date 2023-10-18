import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  fileUserId: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileSize: string;

  @Prop({ required: true })
  fileBuffer: string;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);
