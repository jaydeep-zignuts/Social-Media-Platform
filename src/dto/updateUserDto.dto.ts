import { PartialType } from "@nestjs/swagger";
import { UserSocialMediaDto } from "./user_socialmedia.dto";

export class UpdateUserSocialMedia extends PartialType(UserSocialMediaDto) {}
