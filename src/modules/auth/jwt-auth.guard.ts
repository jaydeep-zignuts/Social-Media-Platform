import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}