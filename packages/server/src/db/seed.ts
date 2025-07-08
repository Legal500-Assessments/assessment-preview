import { db } from './index';
import { characters } from './schema';

const seedData = [
  {
    id: "1",
    name: "Spider-Man",
    alignment: "good",
    intelligence: 90,
    strength: 55,
    speed: 67,
    durability: 75,
    power: 74,
    combat: 85,
    total: 446
  },
  {
    id: "2",
    name: "Captain America",
    alignment: "good",
    intelligence: 63,
    strength: 19,
    speed: 35,
    durability: 56,
    power: 55,
    combat: 85,
    total: 313
  },
  {
    id: "3",
    name: "Iron Man",
    alignment: "good",
    intelligence: 100,
    strength: 85,
    speed: 58,
    durability: 85,
    power: 100,
    combat: 64,
    total: 492
  },
  {
    id: "4",
    name: "Hulk",
    alignment: "good",
    intelligence: 88,
    strength: 100,
    speed: 63,
    durability: 100,
    power: 98,
    combat: 85,
    total: 534
  },
  {
    id: "5",
    name: "Thanos",
    alignment: "bad",
    intelligence: 100,
    strength: 100,
    speed: 83,
    durability: 100,
    power: 100,
    combat: 85,
    total: 568
  }
];

async function seed() {
  console.log('Seeding database...');
  
  // Clear existing data
  await db.delete(characters);
  
  // Insert seed data
  await db.insert(characters).values(seedData);
  
  console.log('Database seeded successfully!');
  process.exit(0);
}

seed();
