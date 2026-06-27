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
        var highDemandMatchNumbers, midDemandMatchNumbers, lowDemandMatchNumbers, pricingTiers, updateMatchTickets;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Updating ticket prices based on market tiers...");
                    highDemandMatchNumbers = [86, 81, 76];
                    midDemandMatchNumbers = [75, 77, 74, 79];
                    lowDemandMatchNumbers = [73, 85, 78, 88];
                    pricingTiers = {
                        high: { CAT4: 1800, CAT3: 2700, CAT2: 5500, CAT1: 15500 },
                        mid: { CAT4: 1100, CAT3: 1600, CAT2: 2800, CAT1: 5200 },
                        low: { CAT4: 550, CAT3: 850, CAT2: 1400, CAT1: 2200 }
                    };
                    updateMatchTickets = function (matchNumbers, tier) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, matchNumbers_1, num, match, listings, _a, listings_1, listing, basePrice, variation, newPrice;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _i = 0, matchNumbers_1 = matchNumbers;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < matchNumbers_1.length)) return [3 /*break*/, 10];
                                    num = matchNumbers_1[_i];
                                    return [4 /*yield*/, prisma.match.findFirst({
                                            where: { matchNumber: num }
                                        })];
                                case 2:
                                    match = _b.sent();
                                    if (!match) return [3 /*break*/, 8];
                                    return [4 /*yield*/, prisma.ticketListing.findMany({
                                            where: { matchId: match.id }
                                        })];
                                case 3:
                                    listings = _b.sent();
                                    _a = 0, listings_1 = listings;
                                    _b.label = 4;
                                case 4:
                                    if (!(_a < listings_1.length)) return [3 /*break*/, 7];
                                    listing = listings_1[_a];
                                    basePrice = pricingTiers[tier][listing.category] || 1000;
                                    variation = basePrice * 0.1 * (Math.random() * 2 - 1);
                                    newPrice = Math.round((basePrice + variation) / 10) * 10;
                                    return [4 /*yield*/, prisma.ticketListing.update({
                                            where: { id: listing.id },
                                            data: { pricePerTicket: newPrice }
                                        })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    _a++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    console.log("Updated prices for Match ".concat(num, " (Tier: ").concat(tier, ")"));
                                    return [3 /*break*/, 9];
                                case 8:
                                    console.log("Match ".concat(num, " not found."));
                                    _b.label = 9;
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, updateMatchTickets(highDemandMatchNumbers, 'high')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateMatchTickets(midDemandMatchNumbers, 'mid')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateMatchTickets(lowDemandMatchNumbers, 'low')];
                case 3:
                    _a.sent();
                    console.log("All ticket prices updated.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
