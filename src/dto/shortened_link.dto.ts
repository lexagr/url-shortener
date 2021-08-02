import { ApiProperty } from '@nestjs/swagger';

export class ShortenedLinkDTO {
  @ApiProperty({ example: '0343203', description: 'Ready short code' })
  short: string;

  @ApiProperty({
    example:
      'https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding',
    description: 'Full link to short',
  })
  full: string;
}
