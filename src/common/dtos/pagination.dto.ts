import { IsInt, IsPositive, Max, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsOptional()          
  @IsInt()               
  @IsPositive()          
  page?: number;     

  @IsOptional()     
  @IsInt()              
  @IsPositive()          
  @Max(100)              
  limit?: number;        
}