import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stadiumImages: Record<string, string> = {
  'metlife-stadium':         'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307182/Metlife_stadium__Aerial_view_ozywne.jpg',
  'sofi-stadium':            'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307236/SoFi_Stadium_2023_fzzuuc.jpg',
  'estadio-azteca':          'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307185/Estadio_Azteca_-_2026_-_02_jpevn0.jpg',
  'bmo-field':               'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307178/bmo_field_ngoycc.avif',
  'att-stadium':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307180/ATT_economic-1_jqbqoh.jpg',
  'arrowhead-stadium':       'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/Aerial_view_of_Arrowhead_Stadium_08-31-2013_podq2f.jpg',
  'nrg-stadium':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307268/Nrg_stadium_dkhltx.jpg',
  'mercedes-benz-stadium':   'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307145/Mercedes_Benz_Stadium_time_lapse_capture_2017-08-13_cwql91.jpg',
  'lincoln-financial-field': 'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/Lincoln_Financial_Field__Aerial_view_bquhy6.jpg',
  'lumen-field':             'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307070/LumenFieldAerialB500_krblfo.webp',
  'levis-stadium':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307175/levis-stadium-cover_c7qwzt.webp',
  'gillette-stadium':        'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307085/Gillette_Stadium__Top_View_aepxrg.jpg',
  'hard-rock-stadium':       'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307062/hard-rock-stadium-hero_kxq0ml.jpg',
  'bc-place':                'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307069/bcplace_zbkhwe.jpg',
  'estadio-akron':           'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307058/Estadio-Akron_ncqjr2.jpg',
  'estadio-bbva':            'https://res.cloudinary.com/dm12f7lnc/image/upload/v1780307254/Estadio_BBVA_Bancomer_fifa_world_cup_2026_6_cpn91l.jpg',
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(stadiumImages)) {
    try {
      const stadium = await prisma.stadium.update({
        where: { slug },
        data: { imageUrl }
      });
      console.log(`Updated ${slug} -> ${stadium.imageUrl}`);
    } catch (e) {
      console.error(`Failed to update ${slug}`, e);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
