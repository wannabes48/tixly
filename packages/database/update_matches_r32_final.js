"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        var getTeam, getStadium, pricingTiers, matchUpdates, _i, matchUpdates_1, update, homeTeam, awayTeam, stadium, matchToUpdate, tier, getPrice, listingsToCreate, _a, listingsToCreate_1, listing;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Updating final Round of 32 Matches (79, 80, 82, 83, 84, 85, 87)...");
                    getTeam = function (slug) { return __awaiter(_this, void 0, void 0, function () {
                        var team;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.team.findUnique({ where: { slug: slug } })];
                                case 1:
                                    team = _a.sent();
                                    if (!team)
                                        throw new Error("Team ".concat(slug, " not found"));
                                    return [2 /*return*/, team];
                            }
                        });
                    }); };
                    getStadium = function (search) { return __awaiter(_this, void 0, void 0, function () {
                        var st, anySt;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.stadium.findFirst({
                                        where: { city: { contains: search, mode: 'insensitive' } }
                                    })];
                                case 1:
                                    st = _a.sent();
                                    if (!!st) return [3 /*break*/, 3];
                                    console.log("Could not find stadium for city: ".concat(search));
                                    return [4 /*yield*/, prisma.stadium.findFirst()];
                                case 2:
                                    anySt = _a.sent();
                                    return [2 /*return*/, anySt];
                                case 3: return [2 /*return*/, st];
                            }
                        });
                    }); };
                    pricingTiers = {
                        high: { CAT4: 1800, CAT3: 2700, CAT2: 5500, CAT1: 15500 },
                        mid: { CAT4: 1100, CAT3: 1600, CAT2: 2800, CAT1: 5200 },
                        low: { CAT4: 550, CAT3: 850, CAT2: 1400, CAT1: 2200 }
                    };
                    matchUpdates = [
                        { num: 79, home: "mexico", away: "ecuador", citySearch: "Mexico City", tier: 'mid' },
                        { num: 80, home: "england", away: "dr-congo", citySearch: "Atlanta", tier: 'mid' },
                        { num: 82, home: "belgium", away: "senegal", citySearch: "Seattle", tier: 'low' },
                        { num: 83, home: "portugal", away: "croatia", citySearch: "Toronto", tier: 'mid' },
                        { num: 84, home: "spain", away: "austria", citySearch: "Los Angeles", tier: 'mid' },
                        { num: 85, home: "switzerland", away: "algeria", citySearch: "Vancouver", tier: 'low' },
                        { num: 87, home: "colombia", away: "ghana", citySearch: "Kansas City", tier: 'low' }
                    ];
                    _i = 0, matchUpdates_1 = matchUpdates;
                    _b.label = 1;
                case 1:
                    if (!(_i < matchUpdates_1.length)) return [3 /*break*/, 14];
                    update = matchUpdates_1[_i];
                    return [4 /*yield*/, getTeam(update.home)];
                case 2:
                    homeTeam = _b.sent();
                    return [4 /*yield*/, getTeam(update.away)];
                case 3:
                    awayTeam = _b.sent();
                    return [4 /*yield*/, getStadium(update.citySearch)];
                case 4:
                    stadium = _b.sent();
                    return [4 /*yield*/, prisma.match.findFirst({
                            where: { matchNumber: update.num }
                        })];
                case 5:
                    matchToUpdate = _b.sent();
                    if (!matchToUpdate) return [3 /*break*/, 12];
                    return [4 /*yield*/, prisma.match.update({
                            where: { id: matchToUpdate.id },
                            data: {
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                stadiumId: stadium.id,
                                slug: "".concat(homeTeam.slug, "-vs-").concat(awayTeam.slug, "-jul-05-").concat(update.num) // Unique slug
                            }
                        })];
                case 6:
                    _b.sent();
                    console.log("Updated Match ".concat(update.num, ": ").concat(homeTeam.name, " vs ").concat(awayTeam.name, " at ").concat(stadium.name));
                    // Delete old listings for this match
                    return [4 /*yield*/, prisma.ticketListing.deleteMany({ where: { matchId: matchToUpdate.id } })];
                case 7:
                    // Delete old listings for this match
                    _b.sent();
                    tier = pricingTiers[update.tier];
                    getPrice = function (base) {
                        var variation = base * 0.1 * (Math.random() * 2 - 1);
                        return Math.round((base + variation) / 10) * 10;
                    };
                    listingsToCreate = [
                        { category: 'CAT1', section: '102', row: 'A', quantity: 4, pricePerTicket: getPrice(tier.CAT1), deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT2', section: '205', row: 'F', quantity: 2, pricePerTicket: getPrice(tier.CAT2), deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT3', section: '315', row: 'K', quantity: 6, pricePerTicket: getPrice(tier.CAT3), deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT4', section: '422', row: 'Z', quantity: 3, pricePerTicket: getPrice(tier.CAT4), deliveryMethod: 'MOBILE_TRANSFER' }
                    ];
                    _a = 0, listingsToCreate_1 = listingsToCreate;
                    _b.label = 8;
                case 8:
                    if (!(_a < listingsToCreate_1.length)) return [3 /*break*/, 11];
                    listing = listingsToCreate_1[_a];
                    return [4 /*yield*/, prisma.ticketListing.create({
                            data: __assign({ matchId: matchToUpdate.id }, listing)
                        })];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log("Seeded tickets for Match ".concat(update.num, " with ").concat(update.tier, " tier pricing"));
                    return [3 /*break*/, 13];
                case 12:
                    console.log("Match ".concat(update.num, " not found in DB!"));
                    _b.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 1];
                case 14:
                    console.log("All done.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
