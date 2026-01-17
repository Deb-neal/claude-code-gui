"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./presentation/gateways/chat.gateway");
const session_repository_1 = require("./infrastructure/session.repository");
const session_repository_interface_1 = require("./domain/interfaces/session.repository.interface");
const claude_module_1 = require("../claude/claude.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [claude_module_1.ClaudeModule],
        providers: [
            chat_gateway_1.ChatGateway,
            {
                provide: session_repository_interface_1.SESSION_REPOSITORY,
                useClass: session_repository_1.SessionRepository,
            },
        ],
        exports: [session_repository_interface_1.SESSION_REPOSITORY],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map