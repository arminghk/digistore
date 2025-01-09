import { registerAs } from "@nestjs/config";

export enum ConfigKeys {
    App = 'App',
    Db = 'Db',
    Jwt = "Jwt",
}


const AppConfig = registerAs(ConfigKeys.App , ()=>({
    port:3000,
    cors:{
        origin: '*', 
        methods: 'GET,POST,PUT',     
        allowedHeaders: 'Content-Type, Authorization', 
        credentials: true,           
      }
    
}))
const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
    accessTokenSecret: "86990241c691c00c02fc8383d3ed75117857fbec",
    refreshTokenSecret: "111e8805762331d2b72eeaadea3be3eae513a337",
  }));

const DbConfig = registerAs(ConfigKeys.Db , ()=>({
    MONGODB_URI:'mongodb://127.0.0.1:27017/digistore'
}))




export const configurations = [AppConfig,DbConfig,JwtConfig]