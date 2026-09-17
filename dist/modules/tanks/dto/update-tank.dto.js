"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTankDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tank_dto_1 = require("./create-tank.dto");
class UpdateTankDto extends (0, mapped_types_1.PartialType)(create_tank_dto_1.CreateTankDto) {
}
exports.UpdateTankDto = UpdateTankDto;
//# sourceMappingURL=update-tank.dto.js.map