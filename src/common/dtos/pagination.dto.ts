import { IsInt, IsPositive, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @IsOptional()          
  @IsInt()               
  @IsPositive()          
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value)) 
  page?: number;  

  @IsOptional()     
  @IsInt()              
  @IsPositive()          
  @Max(100)              
  @Transform(({ value }) => (typeof value === 'string' ? parseInt(value, 10) : value))
  limit?: number;        
}
