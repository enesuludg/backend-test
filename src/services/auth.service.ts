import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData,Verify } from '@interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import userModel from '@models/users.model';
import tokenModel from '@models/token.model';
import { isEmpty, GMailService } from '@utils/util';

class AuthService {
  public users = userModel;
  public token = tokenModel;


  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);
 
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    const rand=Math.floor((Math.random() * 1000000) + 54);
    const host= 'localhost:3000';
    const link="http://"+host+"/verify?id="+createUserData._id+"&token="+rand;
    console.log(link)
    const gmailService = new GMailService();
    gmailService.sendMail(userData.email, 'Hello', "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" );
    const doc = await this.token.create({ _userId: createUserData._id, token: rand });

    return createUserData;
  }

  public async login(userData: CreateUserDto): Promise<{ Token }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);
    if (findUser.isVerified == false)  throw new HttpException(409, `Not verify ${userData.email}`);
    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");
    const tokenData = this.createToken(findUser);
    const Token = tokenData.token;
    await this.users.updateOne({ email: userData.email }, { token: Token });

    return { Token };
  }
  public async verify(id: number, code: string): Promise<any> {

    const doc = await this.token.findOne({ _userId: id });
    if(doc.token === code){
     await this.users.findOne({ _id: id }).then(async(user) => {
      Object.assign(user, {isVerified: true});
      const mail = user.email;
      await this.users.updateOne({ _id: id }, {isVerified: true});
      return mail;
  });
}
  }
  public async code( code: string): Promise<{ newCode }> {
    const word = code.split('')
    // Find non-increasing suffix
    let i = word.length - 1;
    while (i > 0 && word[i - 1] >= word[i])
        i--;

    if (i <= 0)
        ///return 'no answer';
    
    // Find the rightmost successor to pivot in the suffix
    var j = word.length - 1;
    while (word[j] <= word[i - 1])
        j--;

    // Swap the pivot with the rightmost character
    const temp = word[i - 1];
    word[i - 1] = word[j];
    word[j] = temp;
    
    // Reverse suffix
    j = word.length - 1;
    while (i < j) {
        const temp = word[i];
        word[i] = word[j];
        word[j] = temp;
        i++;
        j--;
    }

    const newCode = word.join('');   
    return { newCode }
  }

  public async logout(email:string): Promise<User> {
       if (isEmpty(email)) throw new HttpException(400, "You're not userData");
    console.log(email);
    const findUser: User = await this.users.findOne({ email: email });
    if (!findUser) throw new HttpException(409, `You're email ${email} not found`);
    await this.users.updateOne({ email: email }, { token: '' });
    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id };
    const secretKey: string = config.get('secretKey');
    const expiresIn: number = 60 * 60;
    const token = jwt.sign(dataStoredInToken, secretKey, { expiresIn });
    return { expiresIn, token: token };
  }
  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
