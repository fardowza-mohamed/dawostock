const METHODS = {
  cash: 'Cash',
  card: 'Card',
  evc_plus: 'EVC Plus',
  zaad: 'Zaad',
  sahal: 'Sahal',
  bank_transfer: 'Bank Transfer',
};

export function paymentLabel(v) {
  return METHODS[v] || v;
}

export default METHODS;
