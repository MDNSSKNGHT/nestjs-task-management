import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // Passwords will contain at least one upper case letter.
  // Passwords will contain at least one lower case letter.
  // Passwords will contain at least one number or special character.
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must have at least one upper case letter, one lower case letter and one number or special character',
  })
  password: string;
}
