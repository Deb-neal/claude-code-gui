"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`🚀 백엔드 서버가 http://localhost:${port}에서 실행 중입니다`);
}
bootstrap();
//# sourceMappingURL=main.js.map