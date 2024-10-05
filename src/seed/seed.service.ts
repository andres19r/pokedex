import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  execute() {
    return 'Seed executed';
  }
}
