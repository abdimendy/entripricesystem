import { categoryLogoByName } from '../utils/categoryLogos';

export const cloudinaryDemo = (path) =>
  `https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/${path}`;

export const demoCategories = [
  { id: 1, name: 'Restaurants', description: 'Dining', icon: 'restaurant', businessCount: 2 },
  { id: 2, name: 'Hotels', description: 'Hotels', icon: 'hotel', businessCount: 1 },
  { id: 3, name: 'Healthcare', description: 'Healthcare', icon: 'hospital', businessCount: 1 },
  { id: 4, name: 'Retail', description: 'Retail', icon: 'supermarket', businessCount: 1 },
  { id: 5, name: 'Services', description: 'Services', icon: 'telecom', businessCount: 1 },
  { id: 7, name: 'school', description: 'Education', icon: 'school', businessCount: 1 },
];

const biz = (id, name, categoryName, categoryId, extra = {}) => ({
  id,
  name,
  categoryName,
  categoryId,
  city: 'Mogadishu',
  rating: 4.6,
  reviewCount: 3,
  logoUrl: categoryLogoByName(categoryName, name),
  ...extra,
});

export const demoBusinessList = [
  biz(1, 'Hormuud Telecom', 'Services', 5, {
    phone: '+252 61 5000000',
    email: 'info@hormuud.com',
    address: 'Howlwadaag, Mogadishu',
    description: 'Leading mobile, internet and digital services across Somalia.',
    rating: 4.9,
    website: 'https://www.hormuud.com',
  }),
  biz(2, 'Mogadishu Serena Hotel', 'Hotels', 2, {
    phone: '+252 61 2000000',
    email: 'reservations@serena.co',
    address: 'Airport Road, Wadajir',
    description: 'Luxury hotel with conference halls and waterfront views.',
    rating: 4.8,
  }),
  biz(3, 'Lido Seafood Restaurant', 'Restaurants', 1, {
    phone: '+252 61 7700000',
    email: 'hello@lidoseafood.so',
    address: 'Lido Beach',
    description: 'Fresh seafood and traditional Somali cuisine by the beach.',
    rating: 4.7,
  }),
  biz(4, 'Beco Supermarket', 'Retail', 4, {
    phone: '+252 61 8800000',
    email: 'info@beco.so',
    address: 'KM4, Hodan District',
    description: 'Groceries, household goods and fresh produce.',
    rating: 4.6,
  }),
  biz(5, 'SIMAD University', 'school', 7, {
    phone: '+252 61 4444444',
    email: 'info@simad.edu.so',
    address: 'Afgooye Road',
    description: 'Private university — business, IT and health sciences.',
    rating: 4.7,
    website: 'https://www.simad.edu.so',
  }),
  biz(6, 'Golden Fork Restaurant', 'Restaurants', 1, {
    phone: '+252 61 7800001',
    email: 'info@goldenfork.so',
    address: 'Hodan District',
    description: 'Popular dining spot for families and groups.',
    rating: 4.5,
  }),
  biz(7, 'Sunrise Medical Center', 'Healthcare', 3, {
    phone: '+252 61 1500001',
    email: 'care@sunrisemedical.so',
    address: 'Wadajir District',
    description: 'Outpatient care, diagnostics and emergency services.',
    rating: 4.4,
  }),
];

export const demoStats = {
  totalBusinesses: demoBusinessList.length,
  totalCategories: 6,
  totalReviews: 12,
  totalPayments: 4,
  averageRating: 4.7,
  businessesByCategory: demoCategories.map((c) => ({
    categoryName: c.name,
    count: c.businessCount,
  })),
  recentBusinesses: demoBusinessList.slice(0, 4),
};

export const demoReviews = [
  { id: 1, businessId: 1, userName: 'Ahmed H.', rating: 5, comment: 'Excellent network coverage.' },
  { id: 2, businessId: 3, userName: 'Fatima M.', rating: 5, comment: 'Best seafood in Mogadishu.' },
  { id: 3, businessId: 2, userName: 'Omar K.', rating: 5, comment: 'Beautiful hotel stay.' },
  { id: 4, businessId: 5, userName: 'Hodan A.', rating: 5, comment: 'Great lecturers and campus.' },
  { id: 5, businessId: 4, userName: 'Yusuf I.', rating: 4, comment: 'Well stocked supermarket.' },
];

export const demoBusinesses = demoBusinessList.map(({ id, name, city }) => ({ id, name, city }));
