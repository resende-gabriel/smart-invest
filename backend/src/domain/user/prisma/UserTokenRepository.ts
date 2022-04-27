import { PrismaClient, UserToken } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import IUserTokenRepository from "../repositories/IUserTokenRepository";

@injectable()
class UserTokenRepository implements IUserTokenRepository {
    
    constructor(
        @inject('PrismaClient')
        private readonly prisma: PrismaClient
    ) {}
  
    public async findByToken(token: string): Promise<UserToken | null> {
      const userToken = await this.prisma.userToken.findFirst({ where: { token } });
  
      return userToken;
    }
  
    public async generate(user_id: string): Promise<UserToken> {
      const existUserToken = await this.prisma.userToken.findFirst({
        where: { user_id },
      });
  
      if (existUserToken) {
        await this.prisma.userToken.delete({
            where: {
                id: existUserToken.id
            }
        });
      }
  
      const userToken = this.prisma.userToken.create({
          data: {
              user_id
          }
      });
  
      return userToken;
    }
  }
  
  export default UserTokenRepository;