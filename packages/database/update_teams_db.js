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
var officialTeams = [
    // UEFA
    { name: "Austria", slug: "austria", countryCode: "at", confederation: "UEFA" },
    { name: "Belgium", slug: "belgium", countryCode: "be", confederation: "UEFA" },
    { name: "Bosnia and Herzegovina", slug: "bosnia-and-herzegovina", countryCode: "ba", confederation: "UEFA" },
    { name: "Croatia", slug: "croatia", countryCode: "hr", confederation: "UEFA" },
    { name: "Czech Republic", slug: "czech-republic", countryCode: "cz", confederation: "UEFA" },
    { name: "Denmark", slug: "denmark", countryCode: "dk", confederation: "UEFA" },
    { name: "England", slug: "england", countryCode: "gb-eng", confederation: "UEFA" },
    { name: "France", slug: "france", countryCode: "fr", confederation: "UEFA" },
    { name: "Germany", slug: "germany", countryCode: "de", confederation: "UEFA" },
    { name: "Netherlands", slug: "netherlands", countryCode: "nl", confederation: "UEFA" },
    { name: "Norway", slug: "norway", countryCode: "no", confederation: "UEFA" },
    { name: "Poland", slug: "poland", countryCode: "pl", confederation: "UEFA" },
    { name: "Portugal", slug: "portugal", countryCode: "pt", confederation: "UEFA" },
    { name: "Scotland", slug: "scotland", countryCode: "gb-sct", confederation: "UEFA" },
    { name: "Spain", slug: "spain", countryCode: "es", confederation: "UEFA" },
    { name: "Sweden", slug: "sweden", countryCode: "se", confederation: "UEFA" },
    { name: "Switzerland", slug: "switzerland", countryCode: "ch", confederation: "UEFA" },
    { name: "Turkey", slug: "turkey", countryCode: "tr", confederation: "UEFA" },
    { name: "Wales", slug: "wales", countryCode: "gb-wls", confederation: "UEFA" },
    // CONMEBOL
    { name: "Argentina", slug: "argentina", countryCode: "ar", confederation: "CONMEBOL" },
    { name: "Brazil", slug: "brazil", countryCode: "br", confederation: "CONMEBOL" },
    { name: "Colombia", slug: "colombia", countryCode: "co", confederation: "CONMEBOL" },
    { name: "Ecuador", slug: "ecuador", countryCode: "ec", confederation: "CONMEBOL" },
    { name: "Paraguay", slug: "paraguay", countryCode: "py", confederation: "CONMEBOL" },
    { name: "Uruguay", slug: "uruguay", countryCode: "uy", confederation: "CONMEBOL" },
    // CAF
    { name: "Algeria", slug: "algeria", countryCode: "dz", confederation: "CAF" },
    { name: "Cape Verde", slug: "cape-verde", countryCode: "cv", confederation: "CAF" },
    { name: "DR Congo", slug: "dr-congo", countryCode: "cd", confederation: "CAF" },
    { name: "Egypt", slug: "egypt", countryCode: "eg", confederation: "CAF" },
    { name: "Ghana", slug: "ghana", countryCode: "gh", confederation: "CAF" },
    { name: "Ivory Coast", slug: "ivory-coast", countryCode: "ci", confederation: "CAF" },
    { name: "Morocco", slug: "morocco", countryCode: "ma", confederation: "CAF" },
    { name: "Senegal", slug: "senegal", countryCode: "sn", confederation: "CAF" },
    { name: "South Africa", slug: "south-africa", countryCode: "za", confederation: "CAF" },
    { name: "Tunisia", slug: "tunisia", countryCode: "tn", confederation: "CAF" },
    // CONCACAF
    { name: "Canada", slug: "canada", countryCode: "ca", confederation: "CONCACAF" },
    { name: "Curaçao", slug: "curacao", countryCode: "cw", confederation: "CONCACAF" },
    { name: "Haiti", slug: "haiti", countryCode: "ht", confederation: "CONCACAF" },
    { name: "Jamaica", slug: "jamaica", countryCode: "jm", confederation: "CONCACAF" },
    { name: "Mexico", slug: "mexico", countryCode: "mx", confederation: "CONCACAF" },
    { name: "Panama", slug: "panama", countryCode: "pa", confederation: "CONCACAF" },
    { name: "United States", slug: "usa", countryCode: "us", confederation: "CONCACAF" },
    // AFC
    { name: "Australia", slug: "australia", countryCode: "au", confederation: "AFC" },
    { name: "Iran", slug: "iran", countryCode: "ir", confederation: "AFC" },
    { name: "Iraq", slug: "iraq", countryCode: "iq", confederation: "AFC" },
    { name: "Japan", slug: "japan", countryCode: "jp", confederation: "AFC" },
    { name: "Jordan", slug: "jordan", countryCode: "jo", confederation: "AFC" },
    { name: "Qatar", slug: "qatar", countryCode: "qa", confederation: "AFC" },
    { name: "Saudi Arabia", slug: "saudi-arabia", countryCode: "sa", confederation: "AFC" },
    { name: "South Korea", slug: "south-korea", countryCode: "kr", confederation: "AFC" },
    { name: "Uzbekistan", slug: "uzbekistan", countryCode: "uz", confederation: "AFC" },
    // OFC
    { name: "New Zealand", slug: "new-zealand", countryCode: "nz", confederation: "OFC" }
];
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, officialTeams_1, t;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Updating all teams...");
                    // First, set all teams to TBD so they don't show on the Teams page
                    return [4 /*yield*/, prisma.team.updateMany({
                            data: { countryCode: 'TBD' }
                        })];
                case 1:
                    // First, set all teams to TBD so they don't show on the Teams page
                    _a.sent();
                    console.log("Set all current teams to TBD.");
                    _i = 0, officialTeams_1 = officialTeams;
                    _a.label = 2;
                case 2:
                    if (!(_i < officialTeams_1.length)) return [3 /*break*/, 5];
                    t = officialTeams_1[_i];
                    return [4 /*yield*/, prisma.team.upsert({
                            where: { slug: t.slug },
                            update: {
                                name: t.name,
                                countryCode: t.countryCode.toUpperCase(),
                                confederation: t.confederation
                            },
                            create: {
                                name: t.name,
                                slug: t.slug,
                                countryCode: t.countryCode.toUpperCase(),
                                confederation: t.confederation,
                                flagUrl: "https://flagcdn.com/w320/".concat(t.countryCode, ".png") // Simple fallback
                            }
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    console.log("Upserted 48 official teams successfully!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(console.error)
    .finally(function () { return prisma.$disconnect(); });
