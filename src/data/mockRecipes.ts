import { Recipe } from '../types';

export const CLUB_RECIPES: Recipe[] = [
  {
    id: 'patapsco-best-bitter',
    name: 'Patapsco Cask Best Bitter',
    style: 'Ordinary & Best Bitter (BJCP 11B)',
    category: 'real-ale',
    brewer: 'Dave "The Caskmaster" Miller',
    og: '1.044',
    fg: '1.011',
    abv: '4.3%',
    ibu: 32,
    srm: 11,
    batchSize: '5.5 Gallons',
    description: 'The definitive CRABS session real ale. Served cellar temp from a beer engine with gentle carbonation, showcasing rich biscuit Maris Otter and floral East Kent Goldings.',
    fermentables: [
      { name: 'Maris Otter Pale Ale Malt', amount: '7.5 lbs' },
      { name: 'Crystal 60L', amount: '0.75 lbs' },
      { name: 'Victory Malt', amount: '0.5 lbs' },
      { name: 'Torrified Wheat', amount: '0.25 lbs', notes: 'Head retention' }
    ],
    hops: [
      { name: 'East Kent Goldings', amount: '1.25 oz', time: '60 min', use: 'Boil' },
      { name: 'Fuggle', amount: '0.75 oz', time: '15 min', use: 'Boil' },
      { name: 'East Kent Goldings', amount: '0.5 oz', time: 'Flameout', use: 'Whirlpool' }
    ],
    yeast: 'Wyeast 1968 London ESB / Imperial A09 Pub',
    mashTemp: '153°F (67°C) for 60 min',
    fermentationTemp: '66°F for 10 days, secondary cask fining with isinglass',
    notes: 'Water profile adjusted with gypsum for a crisp Burton sulfate bite (SO4:Cl ratio 2.5:1). Transfer to pin cask after primary fermentation, prime with 1.5 oz raw cane sugar, add auxiliary isinglass finings, and condition at 54°F for 14 days before pulling on the beer engine.',
    caskConditioned: true,
    award: 'Gold Medal - Maryland State Homebrew Championship (Real Ale Category)'
  },
  {
    id: 'heavy-seas-homage-ipa',
    name: 'Chesapeake Pegleg Double IPA',
    style: 'American IPA / Double IPA (BJCP 21A/22A)',
    category: 'ipa',
    brewer: 'Mark & Sarah Thompson',
    og: '1.072',
    fg: '1.013',
    abv: '7.8%',
    ibu: 74,
    srm: 7,
    batchSize: '5.0 Gallons',
    description: 'Brewed as a nod to our hosts at Heavy Seas Brewery! Bursting with resinous pine, pink grapefruit zest, and an assertive clean hop bitterness balanced by American 2-row and light Munich.',
    fermentables: [
      { name: 'American 2-Row Malt', amount: '12.0 lbs' },
      { name: 'Munich 10L', amount: '1.5 lbs' },
      { name: 'CaraPils / Dextrine', amount: '0.75 lbs' },
      { name: 'White Wheat Malt', amount: '0.5 lbs' }
    ],
    hops: [
      { name: 'Columbus (CTZ)', amount: '1.0 oz', time: '60 min', use: 'Boil' },
      { name: 'Centennial', amount: '1.0 oz', time: '15 min', use: 'Boil' },
      { name: 'Cascade & Simcoe', amount: '1.5 oz each', time: 'Flameout', use: 'Whirlpool 20 min' },
      { name: 'Citra & Amarillo', amount: '2.0 oz each', time: 'Dry Hop', use: '4 Days' }
    ],
    yeast: 'SafAle US-05 or White Labs WLP001 California Ale',
    mashTemp: '150°F (65.5°C) for 60 min for high fermentability',
    fermentationTemp: '67°F for 14 days',
    notes: 'Add whirlfloc at 10 min. Cool wort to 175°F before adding the flameout whirlpool hops to preserve aromatics without adding harsh bitterness. Dry hop on day 10 for 4 days, then cold crash to 34°F before packaging.',
    caskConditioned: false
  },
  {
    id: 'fort-mchenry-oatmeal-stout',
    name: 'Fort McHenry Midnight Oatmeal Stout',
    style: 'Oatmeal Stout (BJCP 16B)',
    category: 'stout',
    brewer: 'Brian Higgins',
    og: '1.058',
    fg: '1.016',
    abv: '5.5%',
    ibu: 34,
    srm: 36,
    batchSize: '5.5 Gallons',
    description: 'Silky smooth, opaque black with a dense tan head. Roasted coffee and baker’s chocolate nuances backed by flaked oats for a luscious mouthfeel.',
    fermentables: [
      { name: 'Maris Otter Pale Malt', amount: '8.0 lbs' },
      { name: 'Flaked Oats', amount: '1.5 lbs' },
      { name: 'Roasted Barley', amount: '0.75 lbs' },
      { name: 'Chocolate Malt', amount: '0.75 lbs' },
      { name: 'Crystal 80L', amount: '0.5 lbs' }
    ],
    hops: [
      { name: 'Target', amount: '1.0 oz', time: '60 min', use: 'Boil' },
      { name: 'Willamette', amount: '1.0 oz', time: '10 min', use: 'Boil' }
    ],
    yeast: 'Fermentis SafAle S-04 / Wyeast 1084 Irish Ale',
    mashTemp: '154°F (68°C) for 60 min',
    fermentationTemp: '68°F for 12 days',
    notes: 'Toast the flaked oats in a 350°F oven for 20 minutes until golden and nutty before mashing. Calcium chloride added to mash water (100 ppm) to accentuate round malt fullness and smooth roast character.',
    caskConditioned: true,
    award: 'People’s Choice - CRABS Winter Warm-Up 2024'
  },
  {
    id: 'chesapeake-bay-saison',
    name: 'Bay Breeze French Saison',
    style: 'Saison (BJCP 25B)',
    category: 'wheat-farmhouse',
    brewer: 'Elena Rostova',
    og: '1.050',
    fg: '1.004',
    abv: '6.0%',
    ibu: 26,
    srm: 4,
    batchSize: '5.0 Gallons',
    description: 'Crisp, peppery, bone-dry and effervescent. Infused with a pinch of fresh coriander seed and dried orange peel for hot summer crab feasts on the bay.',
    fermentables: [
      { name: 'Pilsner Malt (Dingemans)', amount: '8.5 lbs' },
      { name: 'Malted Wheat', amount: '1.5 lbs' },
      { name: 'Acidulated Malt', amount: '0.25 lbs' }
    ],
    hops: [
      { name: 'Saaz', amount: '1.5 oz', time: '60 min', use: 'Boil' },
      { name: 'Styrian Goldings', amount: '1.0 oz', time: '15 min', use: 'Boil' }
    ],
    yeast: 'Lallemand Belle Saison or French Saison (WY3711)',
    mashTemp: '148°F (64.5°C) for 75 min (super dry rest)',
    fermentationTemp: 'Start 68°F, ramp up freely to 80°F',
    notes: 'Do not fear high fermentation temperatures with WY3711; allowing it to rise to 78°F–80°F drives the signature black pepper phenols without off-putting fusels. Bottle condition to 3.0 volumes of CO2 for champagne-like effervescence.',
    caskConditioned: false
  },
  {
    id: 'old-line-english-mild',
    name: 'Old Line Dark Mild',
    style: 'Dark Mild (BJCP 13A)',
    category: 'real-ale',
    brewer: 'Ken "Hophead" Adams',
    og: '1.036',
    fg: '1.010',
    abv: '3.4%',
    ibu: 18,
    srm: 18,
    batchSize: '5.5 Gallons',
    description: 'The quintessential British pub session ale. Low ABV, full flavor: dark fruit, caramel toffee, and toasted bread crusts. Perfectly suited for an authentic cask beer engine.',
    fermentables: [
      { name: 'Golden Promise Malt', amount: '6.0 lbs' },
      { name: 'Crystal 120L', amount: '0.75 lbs' },
      { name: 'Brown Malt', amount: '0.5 lbs' },
      { name: 'Pale Chocolate Malt', amount: '0.25 lbs' }
    ],
    hops: [
      { name: 'Fuggle', amount: '1.0 oz', time: '60 min', use: 'Boil' },
      { name: 'Bramling Cross', amount: '0.5 oz', time: '5 min', use: 'Boil' }
    ],
    yeast: 'Wyeast 1318 London Ale III / Lallemand Windsor',
    mashTemp: '156°F (69°C) for 60 min to retain dextrins',
    fermentationTemp: '66°F for 7 days',
    notes: 'High mash temperature is critical here to preserve unfermentable dextrins and mouthfeel in this low-gravity ale. Prime very lightly (0.8 oz cane sugar for 5 gal) and serve at 52°F from a cask or hand pump.',
    caskConditioned: true
  }
];
