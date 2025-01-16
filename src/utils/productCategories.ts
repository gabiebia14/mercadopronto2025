export type ProductCategory = 
  | 'Alimentos'
  | 'Bebidas'
  | 'Limpeza'
  | 'Higiene'
  | 'Hortifruti'
  | 'Padaria'
  | 'Carnes'
  | 'Laticínios'
  | 'Outros';

export const categorizeProduct = (productName: string): ProductCategory => {
  const name = productName.toLowerCase();
  
  if (/arroz|feijão|macarrão|farinha|açúcar|sal|óleo|azeite|tempero|molho/i.test(name)) {
    return 'Alimentos';
  }
  if (/água|suco|refrigerante|cerveja|vinho|café|chá|leite/i.test(name)) {
    return 'Bebidas';
  }
  if (/sabão|detergente|desinfetante|água sanitária|papel higiênico|esponja/i.test(name)) {
    return 'Limpeza';
  }
  if (/sabonete|shampoo|condicionador|pasta de dente|escova|desodorante/i.test(name)) {
    return 'Higiene';
  }
  if (/tomate|cebola|alho|batata|cenoura|alface|frutas|legumes/i.test(name)) {
    return 'Hortifruti';
  }
  if (/pão|bolo|biscoito|bolacha|torta|doce/i.test(name)) {
    return 'Padaria';
  }
  if (/carne|frango|peixe|porco|bacon|linguiça|salsicha/i.test(name)) {
    return 'Carnes';
  }
  if (/queijo|iogurte|manteiga|requeijão|cream cheese/i.test(name)) {
    return 'Laticínios';
  }
  
  return 'Outros';
};