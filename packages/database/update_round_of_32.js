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
        var placeholderTeams, _i, placeholderTeams_1, pt, getTeam, getStadium, matchesToCreate, i, m, homeTeam, awayTeam, stadium, kickoffUtc, matchSlug;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Adding placeholder teams...");
                    placeholderTeams = [
                        { name: "Group A/B/C/D/F third place", code: "TBD1", slug: "group-abcdf-3rd" },
                        { name: "Group F winners", code: "TBD2", slug: "group-f-1st" },
                        { name: "Group F runners-up", code: "TBD3", slug: "group-f-2nd" },
                        { name: "Group C/E/F/H/I third place", code: "TBD4", slug: "group-cephi-3rd" },
                        { name: "Group B/E/F/I/J third place", code: "TBD5", slug: "group-befij-3rd" },
                        { name: "Group E/F/G/I/J third place", code: "TBD6", slug: "group-efgij-3rd" },
                        { name: "Group H runners-up", code: "TBD7", slug: "group-h-2nd" },
                        { name: "South Africa", code: "RSA", slug: "south-africa" } // Ensuring SA exists
                    ];
                    _i = 0, placeholderTeams_1 = placeholderTeams;
                    _a.label = 1;
                case 1:
                    if (!(_i < placeholderTeams_1.length)) return [3 /*break*/, 4];
                    pt = placeholderTeams_1[_i];
                    return [4 /*yield*/, prisma.team.upsert({
                            where: { slug: pt.slug },
                            update: {},
                            create: {
                                name: pt.name,
                                slug: pt.slug,
                                countryCode: pt.code,
                                confederation: "TBD",
                                flagUrl: pt.code === 'RSA' ? 'https://upload.wikimedia.org/wikipedia/commons/a/af/Flag_of_South_Africa.svg' : null
                            }
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
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
                    matchesToCreate = [
                        {
                            home: "south-africa",
                            away: "canada",
                            stadiumSearch: "Toronto", // Defaulting to somewhere if not specified
                            timeEAT: "2026-06-28T22:00:00+03:00"
                        },
                        {
                            home: "germany",
                            away: "group-abcdf-3rd",
                            stadiumSearch: "Boston",
                            timeEAT: "2026-06-29T23:30:00+03:00"
                        },
                        {
                            home: "group-f-1st",
                            away: "morocco",
                            stadiumSearch: "Monterrey",
                            timeEAT: "2026-06-30T04:00:00+03:00"
                        },
                        {
                            home: "brazil",
                            away: "group-f-2nd",
                            stadiumSearch: "Houston",
                            timeEAT: "2026-06-29T20:00:00+03:00"
                        },
                        {
                            home: "mexico",
                            away: "group-cephi-3rd",
                            stadiumSearch: "Mexico City",
                            timeEAT: "2026-07-01T20:00:00+03:00" // Guessed time as requested missing
                        },
                        {
                            home: "usa",
                            away: "group-befij-3rd",
                            stadiumSearch: "San Francisco",
                            timeEAT: "2026-07-02T03:00:00+03:00"
                        },
                        {
                            home: "switzerland",
                            away: "group-efgij-3rd",
                            stadiumSearch: "Vancouver",
                            timeEAT: "2026-07-03T06:00:00+03:00"
                        },
                        {
                            home: "argentina",
                            away: "group-h-2nd",
                            stadiumSearch: "Miami",
                            timeEAT: "2026-07-04T01:00:00+03:00"
                        }
                    ];
                    i = 0;
                    _a.label = 5;
                case 5:
                    if (!(i < matchesToCreate.length)) return [3 /*break*/, 11];
                    m = matchesToCreate[i];
                    return [4 /*yield*/, getTeam(m.home)];
                case 6:
                    homeTeam = _a.sent();
                    return [4 /*yield*/, getTeam(m.away)];
                case 7:
                    awayTeam = _a.sent();
                    return [4 /*yield*/, getStadium(m.stadiumSearch)];
                case 8:
                    stadium = _a.sent();
                    kickoffUtc = new Date(m.timeEAT);
                    matchSlug = "match-r32-".concat(i + 1);
                    return [4 /*yield*/, prisma.match.upsert({
                            where: { slug: matchSlug },
                            update: {
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                stadiumId: stadium.id,
                                kickoffUtc: kickoffUtc,
                            },
                            create: {
                                slug: matchSlug,
                                matchNumber: 73 + i, // Arbitrary match number for R32
                                round: "Round of 32",
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                stadiumId: stadium.id,
                                kickoffUtc: kickoffUtc
                            }
                        })];
                case 9:
                    _a.sent();
                    console.log("Upserted match: ".concat(homeTeam.name, " vs ").concat(awayTeam.name, " at ").concat(stadium.name));
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 5];
                case 11:
                    console.log("Done updating matches!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
