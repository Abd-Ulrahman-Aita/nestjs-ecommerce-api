import { Module } from '@nestjs/common';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname), // the current directory
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['accept-language'] },
      ],
    }),
  ],
  controllers: [],
})
export class AppI18nModule {}
