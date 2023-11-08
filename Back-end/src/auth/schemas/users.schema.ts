import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document } from 'mongoose';

export class iKeySecret {
  X: string[];
  Y: string[];
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    type: iKeySecret,
  })
  keySecret: iKeySecret;

  @Prop({type: String})
  dateOfBirth: String;

  @Prop()
  phoneNumber: string;

  @Prop({ type: Object })
  files: string;

  @Prop({ type: String })
  gender: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);