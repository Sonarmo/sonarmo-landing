export function interpretEnergy(value) {
  if (value < 0.3) return "🟦 Calme";
  if (value < 0.6) return "🟨 Modérée";
  if (value < 0.8) return "🟧 Énergique";
  return "🔴 Très énergique";
}

export function interpretValence(value) {
  if (value < 0.3) return "😔 Triste / mélancolique";
  if (value < 0.6) return "😌 Neutre / doux";
  return "😄 Joyeux / positif";
}