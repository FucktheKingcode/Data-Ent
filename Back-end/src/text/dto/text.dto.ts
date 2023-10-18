import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TextDto {
  @IsString()
  readonly Text: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
