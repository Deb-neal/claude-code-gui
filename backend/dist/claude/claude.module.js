"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeModule = void 0;
const common_1 = require("@nestjs/common");
const claude_cli_service_1 = require("./infrastructure/claude-cli.service");
const claude_cli_service_interface_1 = require("./domain/interfaces/claude-cli.service.interface");
let ClaudeModule = class ClaudeModule {
};
exports.ClaudeModule = ClaudeModule;
exports.ClaudeModule = ClaudeModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: claude_cli_service_interface_1.CLAUDE_CLI_SERVICE,
                useClass: claude_cli_service_1.ClaudeCliService,
            },
        ],
        exports: [claude_cli_service_interface_1.CLAUDE_CLI_SERVICE],
    })
], ClaudeModule);
//# sourceMappingURL=claude.module.js.map