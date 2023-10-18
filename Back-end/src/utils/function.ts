export function randomPositiveInteger(): number {
  // Sinh một số thập phân ngẫu nhiên từ 0 đến 1
  const randomNumber = Math.random();

  // Làm tròn xuống để đảm bảo kết quả là số nguyên dương và lớn hơn 0
  const result = Math.floor(randomNumber * Number.MAX_SAFE_INTEGER) + 1;

  return result;
}
