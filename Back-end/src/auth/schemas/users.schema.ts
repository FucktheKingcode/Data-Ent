import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export class iKeySecret {
  X: string[];
  Y: string[];
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongoose.Schema.Types.String })
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ type: mongoose.Schema.Types.String })
  password: string;

  @Prop({
    type: iKeySecret,
  })
  keySecret: iKeySecret;

  @Prop({ type: mongoose.Schema.Types.String })
  dateOfBirth: string;

  @Prop({ type: mongoose.Schema.Types.String })
  phoneNumber: string;

  @Prop({ type: Object })
  files: string;

  @Prop({ type: mongoose.Schema.Types.String })
  gender: string;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
