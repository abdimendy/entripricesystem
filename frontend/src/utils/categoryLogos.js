/** Category-matched images (keep in sync with BusinessCategoryLogoMapper.cs). */
const U = (id) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=400&fit=crop&q=80`;

export const categoryLogoByName = (categoryName, businessName = '') => {
  const name = businessName.toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  if (name.includes('hormuud') || name.includes('somtel') || name.includes('telecom'))
    return U('1556742049-0cfed4f6a45d');
  if (name.includes('bank') || name.includes('premier') || name.includes('salaam'))
    return 'https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/models.jpg';
  if (name.includes('serena') || name.includes('hotel'))
    return U('1566073771259-6a8506099945');
  if (name.includes('lido') || name.includes('fork') || name.includes('restaurant'))
    return U('1517248135467-4c7edcad34c4');
  if (name.includes('beco') || name.includes('supermarket'))
    return U('1604719312566-8912e9227c6a');
  if (name.includes('simad') || name.includes('university') || name.includes('school'))
    return U('1523050854058-8df90110c9f1');
  if (name.includes('medical') || name.includes('hospital') || name.includes('sunrise') || name.includes('health'))
    return U('1519494026892-80bbd2d6fd0d');

  if (cat.includes('restaurant') || cat.includes('food')) return U('1517248135467-4c7edcad34c4');
  if (cat.includes('hotel')) return U('1566073771259-6a8506099945');
  if (cat.includes('bank') || cat.includes('finance'))
    return 'https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/docs/models.jpg';
  if (cat.includes('health') || cat.includes('hospital') || cat.includes('medical'))
    return U('1519494026892-80bbd2d6fd0d');
  if (cat.includes('school') || cat.includes('universit') || cat.includes('education'))
    return U('1523050854058-8df90110c9f1');
  if (cat.includes('telecom') || cat.includes('service')) return U('1556742049-0cfed4f6a45d');
  if (cat.includes('retail') || cat.includes('supermarket')) return U('1604719312566-8912e9227c6a');
  if (cat.includes('sport')) return U('1574629810360-7efbbe195018');

  return 'https://res.cloudinary.com/demo/image/upload/w_800,h_400,c_fill,q_auto/sample.jpg';
};
