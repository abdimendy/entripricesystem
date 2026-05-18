const defaultMessages = {
  nameRequired: 'Magaca ganacsiga waa lagama maarmaan.',
  nameMin: 'Magacu ugu yaraan 2 xaraf ha ahaado.',
  phoneRequired: 'Telefoonka waa lagama maarmaan.',
  phoneInvalid: 'Geli telefoon sax ah.',
  emailRequired: 'Email waa lagama maarmaan.',
  emailInvalid: 'Geli email sax ah.',
  addressRequired: 'Cinwaanka waa lagama maarmaan.',
  addressMin: 'Cinwaanku ugu yaraan 5 xaraf ha ahaado.',
  categoryRequired: 'Fadlan dooro qayb.',
  categoryNameRequired: 'Magaca qaybta waa lagama maarmaan.',
};

function msg(t, key) {
  return t ? t(`validation.${key}`) : defaultMessages[key];
}

export function validateBusinessForm(form, t) {
  const errors = {};

  if (!form.name?.trim()) errors.name = msg(t, 'nameRequired');
  else if (form.name.trim().length < 2) errors.name = msg(t, 'nameMin');

  if (!form.phone?.trim()) errors.phone = msg(t, 'phoneRequired');
  else if (!/^[\d\s+\-().]{7,20}$/.test(form.phone.trim()))
    errors.phone = msg(t, 'phoneInvalid');

  if (!form.email?.trim()) errors.email = msg(t, 'emailRequired');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = msg(t, 'emailInvalid');

  if (!form.address?.trim()) errors.address = msg(t, 'addressRequired');
  else if (form.address.trim().length < 5) errors.address = msg(t, 'addressMin');

  if (!form.categoryId) errors.categoryId = msg(t, 'categoryRequired');

  return errors;
}

export function validateCategoryForm(name, t) {
  const errors = {};
  if (!name?.trim()) errors.name = msg(t, 'categoryNameRequired');
  else if (name.trim().length < 2) errors.name = msg(t, 'nameMin');
  return errors;
}
