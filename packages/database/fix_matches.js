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
        var i, slug, match, matchUpdates, getTeam, getStadium, _i, matchUpdates_1, update, homeTeam, awayTeam, stadium, kickoffUtc, matchToUpdate, listingsToCreate, _a, listingsToCreate_1, listing;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("Starting match fix...");
                    // 1. Delete 1 dollar test tickets across the board
                    return [4 /*yield*/, prisma.ticketListing.deleteMany({
                            where: { pricePerTicket: 1.00 }
                        })];
                case 1:
                    // 1. Delete 1 dollar test tickets across the board
                    _b.sent();
                    console.log("Deleted $1 test tickets.");
                    i = 1;
                    _b.label = 2;
                case 2:
                    if (!(i <= 8)) return [3 /*break*/, 7];
                    slug = "match-r32-".concat(i);
                    return [4 /*yield*/, prisma.match.findUnique({ where: { slug: slug } })];
                case 3:
                    match = _b.sent();
                    if (!match) return [3 /*break*/, 6];
                    return [4 /*yield*/, prisma.ticketListing.deleteMany({ where: { matchId: match.id } })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, prisma.match.delete({ where: { id: match.id } })];
                case 5:
                    _b.sent();
                    console.log("Deleted incorrect match: ".concat(slug));
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 2];
                case 7:
                    matchUpdates = [
                        { num: 73, home: "south-africa", away: "canada", citySearch: "Los Angeles", timeEAT: "2026-06-28T22:00:00+03:00" },
                        { num: 74, home: "germany", away: "group-abcdf-3rd", citySearch: "Boston", timeEAT: "2026-06-29T23:30:00+03:00" },
                        { num: 75, home: "group-f-1st", away: "morocco", citySearch: "Monterrey", timeEAT: "2026-06-30T04:00:00+03:00" },
                        { num: 76, home: "brazil", away: "group-f-2nd", citySearch: "Houston", timeEAT: "2026-06-29T20:00:00+03:00" },
                        { num: 79, home: "mexico", away: "group-cephi-3rd", citySearch: "Mexico City", timeEAT: "2026-07-01T20:00:00+03:00" },
                        { num: 81, home: "usa", away: "group-befij-3rd", citySearch: "San Francisco", timeEAT: "2026-07-02T03:00:00+03:00" },
                        { num: 85, home: "switzerland", away: "group-efgij-3rd", citySearch: "Vancouver", timeEAT: "2026-07-03T06:00:00+03:00" },
                        { num: 86, home: "argentina", away: "group-h-2nd", citySearch: "Miami", timeEAT: "2026-07-04T01:00:00+03:00" }
                    ];
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
                    _i = 0, matchUpdates_1 = matchUpdates;
                    _b.label = 8;
                case 8:
                    if (!(_i < matchUpdates_1.length)) return [3 /*break*/, 21];
                    update = matchUpdates_1[_i];
                    return [4 /*yield*/, getTeam(update.home)];
                case 9:
                    homeTeam = _b.sent();
                    return [4 /*yield*/, getTeam(update.away)];
                case 10:
                    awayTeam = _b.sent();
                    return [4 /*yield*/, getStadium(update.citySearch)];
                case 11:
                    stadium = _b.sent();
                    kickoffUtc = new Date(update.timeEAT);
                    return [4 /*yield*/, prisma.match.findFirst({
                            where: { matchNumber: update.num }
                        })];
                case 12:
                    matchToUpdate = _b.sent();
                    if (!matchToUpdate) return [3 /*break*/, 19];
                    return [4 /*yield*/, prisma.match.update({
                            where: { id: matchToUpdate.id },
                            data: {
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                stadiumId: stadium.id,
                                kickoffUtc: kickoffUtc,
                                round: "Round of 32"
                            }
                        })];
                case 13:
                    _b.sent();
                    console.log("Updated Match ".concat(update.num, ": ").concat(homeTeam.name, " vs ").concat(awayTeam.name, " at ").concat(stadium.name));
                    // Delete old listings for this match to avoid duplicates, then seed new ones
                    return [4 /*yield*/, prisma.ticketListing.deleteMany({ where: { matchId: matchToUpdate.id } })];
                case 14:
                    // Delete old listings for this match to avoid duplicates, then seed new ones
                    _b.sent();
                    listingsToCreate = [
                        { category: 'CAT1', section: '102', row: 'A', quantity: 4, pricePerTicket: 850.00, deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT2', section: '205', row: 'F', quantity: 2, pricePerTicket: 450.00, deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT3', section: '315', row: 'K', quantity: 6, pricePerTicket: 220.00, deliveryMethod: 'MOBILE_TRANSFER' },
                        { category: 'CAT4', section: '422', row: 'Z', quantity: 3, pricePerTicket: 110.00, deliveryMethod: 'MOBILE_TRANSFER' }
                    ];
                    _a = 0, listingsToCreate_1 = listingsToCreate;
                    _b.label = 15;
                case 15:
                    if (!(_a < listingsToCreate_1.length)) return [3 /*break*/, 18];
                    listing = listingsToCreate_1[_a];
                    return [4 /*yield*/, prisma.ticketListing.create({
                            data: __assign({ matchId: matchToUpdate.id }, listing)
                        })];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    _a++;
                    return [3 /*break*/, 15];
                case 18:
                    console.log("Seeded tickets for Match ".concat(update.num));
                    return [3 /*break*/, 20];
                case 19:
                    console.log("Match ".concat(update.num, " not found in DB!"));
                    _b.label = 20;
                case 20:
                    _i++;
                    return [3 /*break*/, 8];
                case 21:
                    console.log("All done.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
