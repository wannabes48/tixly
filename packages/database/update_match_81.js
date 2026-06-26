"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var bosnia, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Updating Match 81...");
                    return [4 /*yield*/, prisma.team.upsert({
                            where: { slug: 'bosnia-and-herzegovina' },
                            update: {},
                            create: {
                                name: "Bosnia and Herzegovina",
                                slug: "bosnia-and-herzegovina",
                                countryCode: "BA", // Correct ISO code
                                confederation: "UEFA",
                                flagUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Flag_of_Bosnia_and_Herzegovina.svg"
                            }
                        })];
                case 1:
                    bosnia = _a.sent();
                    console.log("Ensured team exists: ".concat(bosnia.name));
                    return [4 /*yield*/, prisma.match.findFirst({
                            where: { matchNumber: 81 }
                        })];
                case 2:
                    match = _a.sent();
                    if (!match) {
                        console.log("Match 81 not found.");
                        return [2 /*return*/];
                    }
                    // Update Match 81
                    return [4 /*yield*/, prisma.match.update({
                            where: { id: match.id },
                            data: {
                                awayTeamId: bosnia.id,
                                // Re-generate the slug to match the real teams? 
                                // It's probably better to update the slug so the URL makes sense.
                                slug: 'usa-vs-bosnia-and-herzegovina-jul-02'
                            }
                        })];
                case 3:
                    // Update Match 81
                    _a.sent();
                    console.log("Successfully updated Match 81 to USA vs Bosnia and Herzegovina.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
