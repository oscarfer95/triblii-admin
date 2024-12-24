
export class NumbersHelper {

  public static getRandomFloat(min: number, max: number, decimals: number = 2): number {
    const randomNumber = (Math.random() * (max - min) + min)
      .toFixed(decimals);

    return parseFloat(randomNumber);
  }
}
