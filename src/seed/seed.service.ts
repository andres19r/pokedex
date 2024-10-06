import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly httpService: HttpService,
  ) {}

  async execute(): Promise<string> {
    await this.pokemonModel.deleteMany();

    const { data } = await firstValueFrom(
      this.httpService.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      ),
    );
    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments.at(-2);
      return { name, no };
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return 'Seed Executed';
  }
}
