import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  constructor(private readonly httpService: HttpService) {}

  async execute() {
    const { data } = await firstValueFrom(
      this.httpService.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=10',
      ),
    );
    const newPokemons = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments.at(-2);
      return { name, no };
    });
    console.log(newPokemons);
    return data.results[0];
  }
}
