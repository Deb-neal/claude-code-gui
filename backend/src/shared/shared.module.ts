import { Global, Module } from '@nestjs/common';

/**
 * Shared Module
 * 모든 모듈에서 공통으로 사용하는 기능 제공
 * @Global 데코레이터로 전역 모듈로 설정
 */
@Global()
@Module({
  providers: [],
  exports: [],
})
export class SharedModule {}
