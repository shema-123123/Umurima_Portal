const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Farm = require('./models/Farm');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany();
  await Farm.deleteMany();

  const admin = await User.create({
    username: 'admin',
    identityNumber: '1198880000000001',
    telephone: '0788000001',
    location: 'Kigali - Nyarugenge',
    password: 'admin123',
    role: 'admin',
  });

  const user = await User.create({
    username: 'umuhinzi1',
    identityNumber: '1199880012345678',
    telephone: '0788123456',
    location: 'Kigali - Gasabo',
    password: 'user123',
    role: 'user',
  });

  await Farm.create([
    {
      userId: user._id,
      farmName: 'Umurima wa Mbere',
      cropType: 'Ibigori',
      size: 2.5,
      location: 'Gasabo - Ndera',
      soilType: 'Loam',
      plantingDate: new Date('2024-03-01'),
      expectedHarvest: new Date('2024-08-01'),
      treeCount: 45,
      treeTypes: ['Imyembe', 'Avoka', 'Ibitoke'],
    },
    {
      userId: user._id,
      farmName: 'Umurima wa Kabiri',
      cropType: 'Ibirayi',
      size: 1.8,
      location: 'Gasabo - Ndera',
      soilType: 'Volcanic',
      plantingDate: new Date('2024-04-01'),
      expectedHarvest: new Date('2024-09-01'),
      treeCount: 30,
      treeTypes: ['Ibitoke', 'Imyembe'],
    },
    {
      userId: user._id,
      farmName: 'Umurima w\'Imbuto',
      cropType: 'Imbuto',
      size: 0.9,
      location: 'Gasabo - Kimironko',
      soilType: 'Sandy',
      treeCount: 120,
      treeTypes: ['Imyembe', 'Avoka', 'Papayi', 'Ibitoke'],
    },
  ]);

  console.log('✅ Seed completed!');
  process.exit();
};

seed();